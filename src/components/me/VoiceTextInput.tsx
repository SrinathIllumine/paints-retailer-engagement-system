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

// Minimal browser SpeechRecognition typings (vendor-prefixed)
type SR = {
  new (): {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: (e: any) => void;
    onerror: (e: any) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
  };
};

const getSR = (): SR | null => {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

// Mock AI summarizer — produces 2–4 short bullets from the raw note.
const mockSummarize = (text: string, category: string): string => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  // Naive sentence split
  const parts = cleaned.split(/(?<=[.!?।])\s+|\s*[;|]\s*/).filter(Boolean);
  const truncated = parts.length ? parts : cleaned.split(",").map((s) => s.trim()).filter(Boolean);
  const top = truncated.slice(0, 3).map((s) => {
    const words = s.split(" ").slice(0, 16).join(" ");
    return words.endsWith(".") ? words.slice(0, -1) : words;
  });
  const bullets = [
    `${category} signal: ${top[0] || cleaned.slice(0, 60)}`,
    top[1] && `Implication: ${top[1]}`,
    top[2] && `Watch-out: ${top[2]}`,
  ].filter(Boolean) as string[];
  return bullets.slice(0, 4).map((b) => `• ${b}`).join("\n");
};

const VoiceTextInput = ({ category, placeholder, value, onChange, summary, onSummaryChange }: Props) => {
  const [listening, setListening] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const recRef = useRef<any>(null);
  const supportsVoice = !!getSR();

  const startListening = () => {
    const SR = getSR();
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    let finalText = value ? value + " " : "";
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      onChange((finalText + interim).replace(/\s+/g, " ").trimStart());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const stopListening = () => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  };

  useEffect(() => () => { try { recRef.current?.stop(); } catch {} }, []);

  const runSummarize = () => {
    if (!value.trim()) return;
    setSummarizing(true);
    // Simulated AI latency
    setTimeout(() => {
      onSummaryChange(mockSummarize(value, category));
      setSummarizing(false);
    }, 600);
  };

  return (
    <div className="space-y-3">
      {/* Input */}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Type or tap Speak to capture this insight…"}
          className="min-h-[80px] rounded-xl bg-card text-sm"
        />
        {listening && (
          <p className="text-[11px] text-destructive mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            Listening… speak clearly
          </p>
        )}
      </div>

      {/* Summarize action */}
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

      {/* Summary */}
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
