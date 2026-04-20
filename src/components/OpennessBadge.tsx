import type { OpennessLevel } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const config: Record<OpennessLevel, { label: string; className: string; help: string }> = {
  high: {
    label: "High",
    className: "bg-success/15 text-success",
    help: "High openness - retailer engages actively, asks questions, and explores new ideas across recent visits.",
  },
  medium: {
    label: "Medium",
    className: "bg-warning/15 text-warning",
    help: "Medium openness - retailer participates but is selective; engagement varies by topic or visit.",
  },
  low: {
    label: "Low",
    className: "bg-destructive/15 text-destructive",
    help: "Low openness - retailer is guarded or resistant; conversations rarely move beyond transactional topics.",
  },
};

const OpennessBadge = ({ level, withTooltip = true }: { level: OpennessLevel; withTooltip?: boolean }) => {
  const { label, className, help } = config[level];
  const badge = (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === "high" ? "bg-success" : level === "medium" ? "bg-warning" : "bg-destructive"}`} />
      {label}
    </span>
  );
  if (!withTooltip) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">{help}</TooltipContent>
    </Tooltip>
  );
};

export default OpennessBadge;
