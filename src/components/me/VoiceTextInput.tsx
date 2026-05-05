import { forwardRef, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Sparkles, Loader2, Pencil } from "lucide-react";

type Props = {
  category: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  summary: string;
  onSummaryChange: (next: string) => void;
};

const getSR = (): any => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

// ---------- Smarter mock summarizer ----------
const STOP = new Set([
  "the","a","an","is","are","was","were","be","been","being","of","to","in","on","for","and","or","but",
  "with","as","at","by","from","that","this","these","those","it","its","i","you","he","she","we","they",
  "them","my","our","your","their","so","if","then","than","also","just","very","really","not","no","yes",
  "do","does","did","done","have","has","had","will","would","can","could","should","may","might","about",
  "into","over","under","up","down","out","off","there","here","what","which","who","whom","how","why",
  "when","where","because","while","ok","okay","right","like","said","says","say"
]);

const splitSentences = (t: string): string[] =>
  t.replace(/\s+/g, " ").trim()
    .split(/(?<=[.!?।])\s+|\s*[;|]\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

const keywordScore = (sent: string, freq: Map<string, number>): number => {
  const words = sent.toLowerCase().match(/[a-z0-9₹%]+/g) || [];
  let s = 0;
  for (const w of words) if (!STOP.has(w) && w.length > 2) s += freq.get(w) || 0;
  // Boost sentences that mention numbers, money, % or action verbs
  if (/\d/.test(sent)) s += 3;
  if (/(₹|rs\.?|inr|%|bag|bags|tonne|ton|cr|lakh)/i.test(sent)) s += 4;
  if (/(want|need|ask|request|demand|complain|issue|problem|prefer|suggest|plan|launch|offer|scheme|margin|price|delivery|stock|supply)/i.test(sent)) s += 3;
  return s / Math.max(1, Math.sqrt(words.length));
};

const trimSent = (s: string, maxWords = 18) => {
  const w = s.replace(/[.!?।]+$/g, "").trim().split(/\s+/);
  return w.length <= maxWords ? w.join(" ") : w.slice(0, maxWords).join(" ") + "…";
};

const mockSummarize = (text: string, category: string): string => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  const sentences = splitSentences(cleaned);
  if (sentences.length === 0) return `• ${category}: ${trimSent(cleaned)}`;

  // Build word frequency
  const freq = new Map<string, number>();
  for (const s of sentences) {
    const words = s.toLowerCase().match(/[a-z0-9₹%]+/g) || [];
    for (const w of words) {
      if (STOP.has(w) || w.length <= 2) continue;
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }

  // Rank
  const ranked = sentences
    .map((s, i) => ({ s, i, score: keywordScore(s, freq) }))
    .sort((a, b) => b.score - a.score);

  // Dedupe by first 5 keyword signature
  const seen = new Set<string>();
  const picked: { s: string; i: number }[] = [];
  for (const r of ranked) {
    const sig = (r.s.toLowerCase().match(/[a-z0-9]+/g) || [])
      .filter(w => !STOP.has(w)).slice(0, 5).join(" ");
    if (seen.has(sig)) continue;
    seen.add(sig);
    picked.push({ s: r.s, i: r.i });
    if (picked.length === 3) break;
  }
  // Restore original order for readability
  picked.sort((a, b) => a.i - b.i);

  const labels = [`${category}`, "Implication", "Watch-out"];
  return picked
    .map((p, idx) => `• ${labels[idx] || "Note"}: ${trimSent(p.s)}`)
    .join("\n");
};

// ---------- Component ----------
const VoiceTextInput = ({ category, placeholder, value, onChange, summary, onSummaryChange }: Props) => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [error, setError] = useState<string>("");

  const recRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const baseTextRef = useRef<string>("");
  const valueRef = useRef<string>(value);
  const onChangeRef = useRef(onChange);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const supportsVoice = !!getSR();

  const stopMediaStream = () => {
    try {
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
    mediaStreamRef.current = null;
  };

  const buildRecognizer = () => {
    const SR = getSR();
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      let interim = "";
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const transcript = r[0]?.transcript ?? "";
        if (r.isFinal) finalChunk += transcript + " ";
        else interim += transcript;
      }
      if (finalChunk) {
        const merged = (baseTextRef.current + " " + finalChunk).replace(/\s+/g, " ").trim();
        baseTextRef.current = merged;
        onChangeRef.current(merged);
      }
      setInterimText(interim);
    };

    rec.onerror = (e: any) => {
      const code = e?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("Microphone permission blocked. Allow access and try again.");
        shouldListenRef.current = false;
      } else if (code === "audio-capture") {
        setError("No microphone found.");
        shouldListenRef.current = false;
      } else if (code && code !== "no-speech" && code !== "aborted") {
        // Surface but don't kill session
        setError(`Mic: ${code}`);
      }
    };

    rec.onend = () => {
      // continuous=true should keep it alive; if it ends while user wants to keep listening,
      // restart silently ONCE without any extra UI churn (this is the only way Chrome
      // sometimes drops the session). We avoid aggressive loop-restarts that cause beeps.
      if (shouldListenRef.current) {
        try {
          rec.start();
          return;
        } catch {
          // fall through to stopped state
        }
      }
      setListening(false);
      setInterimText("");
      stopMediaStream();
    };

    return rec;
  };

  const startListening = async () => {
    if (!getSR()) {
      setError("Voice not supported in this browser. Please type your note.");
      return;
    }
    setError("");
    baseTextRef.current = valueRef.current.trim();

    // Pre-acquire mic stream so Chrome keeps the device warm and reduces re-prompt beeps
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err: any) {
      setError(err?.name === "NotAllowedError"
        ? "Microphone permission blocked. Allow access and try again."
        : "Could not access microphone.");
      return;
    }

    shouldListenRef.current = true;
    const rec = buildRecognizer();
    if (!rec) { stopMediaStream(); return; }
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      // Already started — treat as listening
      setListening(true);
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
    setListening(false);
    setInterimText("");
    stopMediaStream();
  };

  useEffect(() => () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
    stopMediaStream();
  }, []);

  const runSummarize = () => {
    if (!value.trim()) return;
    setSummarizing(true);
    setTimeout(() => {
      onSummaryChange(mockSummarize(value, category));
      setSummarizing(false);
    }, 450);
  };

  const displayedValue = listening && interimText
    ? (value ? value + " " : "") + interimText
    : value;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Your note</span>
          {supportsVoice && (
            <Button
              type="button"
              size="sm"
              variant={listening ? "destructive" : "outline"}
              className="h-8 px-2.5"
              onClick={listening ? stopListening : startListening}
            >
              {listening ? (
                <><MicOff className="w-3.5 h-3.5 mr-1.5" />Stop</>
              ) : (
                <><Mic className="w-3.5 h-3.5 mr-1.5" />Speak</>
              )}
            </Button>
          )}
        </div>
        <Textarea
          value={displayedValue}
          onChange={(e) => {
            baseTextRef.current = e.target.value;
            onChange(e.target.value);
          }}
          placeholder={placeholder || "Type or tap Speak to capture this insight…"}
          className="min-h-[80px] rounded-xl bg-card text-sm"
        />
        {listening && (
          <p className="text-[11px] text-destructive mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            Listening… tap Stop when done
          </p>
        )}
        {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
        {!supportsVoice && (
          <p className="text-[11px] text-muted-foreground mt-1">
            Voice input not supported in this browser — type your note above.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8"
          disabled={!value.trim() || summarizing}
          onClick={runSummarize}
        >
          {summarizing ? (
            <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Summarizing…</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5 mr-1.5" />{summary ? "Re-summarize" : "Summarize with AI"}</>
          )}
        </Button>
        {summary && !editingSummary && (
          <Button type="button" size="sm" variant="ghost" className="h-8" onClick={() => setEditingSummary(true)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" />Edit
          </Button>
        )}
      </div>

      {summary && (
        <div className="rounded-xl border border-info/20 bg-info/5 p-3">
          <p className="text-[11px] font-semibold text-info uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Summary
          </p>
          {editingSummary ? (
            <Textarea
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              onBlur={() => setEditingSummary(false)}
              autoFocus
              className="min-h-[70px] text-sm bg-card"
            />
          ) : (
            <p className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">{summary}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceTextInput;
