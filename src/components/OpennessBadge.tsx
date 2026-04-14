import type { OpennessLevel } from "@/data/mockData";

const config: Record<OpennessLevel, { label: string; className: string }> = {
  high: { label: "High", className: "bg-success/15 text-success" },
  medium: { label: "Medium", className: "bg-warning/15 text-warning" },
  low: { label: "Low", className: "bg-destructive/15 text-destructive" },
};

const OpennessBadge = ({ level }: { level: OpennessLevel }) => {
  const { label, className } = config[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === "high" ? "bg-success" : level === "medium" ? "bg-warning" : "bg-destructive"}`} />
      {label}
    </span>
  );
};

export default OpennessBadge;
