import { useEffect, useRef, useState } from "react";
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

// Crisp mock AI summarizer — 2–3 short, scannable bullets.
const mockSummarize = (text: string, category: string): string => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  // Split into sentence-like chunks
  const sentences = cleaned
    .split(/(?<=[.!?।])\s+|\s*[;|]\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  const pool = sentences.length ? sentences : [cleaned];

  // Dedupe by lowercased first 6 words
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of pool) {
    const sig = s.toLowerCase().split(/\s+/).slice(0, 6).join(" ");
    if (seen.has(sig)) continue;
    seen.add(sig);
    unique.push(s);
  }

  const trim = (s: string, n = 14) => {
    const words = s.replace(/[.!?।]+$/g, "").split(/\s+/);
    return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "…";
  };

  const bullets = unique.slice(0, 3).map(trim);
  const labelled = bullets.map((b, i) => {
    if (i === 0) return `${category}: ${b}`;
    if (i === 1) return `Implication: ${b}`;
    return `Watch-out: ${b}`;
  });

  return labelled.map((b) => `• ${b}`).join("\n");
};

const VoiceTextInput = ({ category, placeholder, value, onChange, summary, onSummaryChange }: Props) => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [error, setError] = useState<string>("");

  const recRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const baseTextRef = useRef<string>(""); // committed text before current session
  const valueRef = useRef<string>(value);

  useEffect(() => { valueRef.current = value; }, [value]);

  const supportsVoice = !!getSR();

  const buildRecognizer = () => {
    const SR = getSR();
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      let interim = "";
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const transcript = r[0].transcript;
        if (r.isFinal) finalChunk += transcript + " ";
        else interim += transcript;
      }
      if (finalChunk) {
        baseTextRef.current = (baseTextRef.current + " " + finalChunk).replace(/\s+/g, " ").trim();
        onChange(baseTextRef.current);
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };

    rec.onerror = (e: any) => {
      // 'no-speech' / 'aborted' are common — keep session alive if user wants it on
      if (e?.error && e.error !== "no-speech" && e.error !== "aborted") {
        setError(`Mic error: ${e.error}`);
      }
    };

    rec.onend = () => {
      // Auto-restart while user hasn't pressed Stop
      if (shouldListenRef.current) {
        try { rec.start(); } catch { /* ignore double-start */ }
      } else {
        setListening(false);
        setInterimText("");
      }
    };

    return rec;
  };

  const startListening = () => {
    if (!getSR()) {
      setError("Voice not supported in this browser.");
      return;
    }
    setError("");
    baseTextRef.current = valueRef.current.trim();
    shouldListenRef.current = true;
    const rec = buildRecognizer();
    if (!rec) return;
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      // already started
      setListening(true);
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
    setListening(false);
    setInterimText("");
  };

  useEffect(() => () => {
    shouldListenRef.current = false;
    try { recRef.current?.stop(); } catch {}
  }, []);

  const runSummarize = () => {
    if (!value.trim()) return;
    setSummarizing(true);
    setTimeout(() => {
      onSummaryChange(mockSummarize(value, category));
      setSummarizing(false);
    }, 500);
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
            // Manual edits become the new committed base
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
