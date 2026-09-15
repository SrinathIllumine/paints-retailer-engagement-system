import { useState } from "react";
import ASMLayout from "@/components/asm/ASMLayout";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb, MapPin } from "lucide-react";

const COLORS = [
  "hsl(0,78%,48%)",
  "hsl(30,80%,52%)",
  "hsl(210,80%,52%)",
  "hsl(152,60%,40%)",
  "hsl(220,10%,46%)",
];

const objections = [
  { name: "Competition Related", value: 45 },
  { name: "Product quality", value: 30 },
  { name: "Scheme related", value: 9 },
  { name: "SKU Space related", value: 7 },
  { name: "Working Capital related", value: 3 },
];

const topObjections: { cat: string; items: { q: string; e: string; bestPractices: string[] }[] }[] = [
  {
    cat: "Competition-related",
    items: [
      {
        q: "Competitor schemes are more visible and frequent.",
        e: "Retailers feel other brands are more active with scratch cards, gifts, or painter rewards.",
        bestPractices: [
          "Show the retailer the current company scheme and explain the direct earning / benefit on his likely purchases.",
          "Prioritize and communicate the most relevant schemes to the retailer instead of sharing every scheme without context.",
          "Increase scheme visibility through every ME interaction — share scheme details on WhatsApp and revisit the retailer before the scheme closes to drive participation.",
        ],
      },
      {
        q: "Customers recognize competitor paint shades faster.",
        e: "Strong tinting/touchpoint presence from larger paint brands.",
        bestPractices: [
          "Carry the shade card and tinting guide on every visit so customers can compare instantly at the counter.",
          "Coach the retailer's staff on 2-3 close shade matches to our range so they can respond confidently to walk-ins.",
          "Push for better in-shop shade display placement near the entrance to build recall.",
        ],
      },
      {
        q: "Competitors are doing more painter meets and site activities.",
        e: "Retailers feel our activation has become weak compared to others.",
        bestPractices: [
          "Propose a painter meet at this retailer's shop and loop in the ME team for scheduling support.",
          "Identify 2-3 active painters in the area and organize a small on-site demo to rebuild visibility.",
          "Share our activation calendar with the retailer so they see upcoming events they can host.",
        ],
      },
    ],
  },
  {
    cat: "Product-quality related",
    items: [
      {
        q: "Retailers feel product consistency changes batch-to-batch.",
        e: "Especially around workability, smoothness, or drying behavior in the primer.",
        bestPractices: [
          "Acknowledge the specific batch issue and log it for QA tracking with the batch number and date.",
          "Offer a replacement/exchange for the affected stock to preserve trust immediately.",
          "Share the quality-control certification process to reassure the retailer on consistency.",
        ],
      },
    ],
  },
  {
    cat: "Scheme-related",
    items: [
      {
        q: "Schemes are either unclear or not exciting enough.",
        e: "Retailers want simpler, faster, and more visible benefits tied to movement.",
        bestPractices: [
          "Simplify the scheme pitch to one clear headline benefit instead of multiple conditions.",
          "Use a visual scheme calendar/poster in-shop so retailers can track progress themselves.",
          "Gather retailer feedback on scheme structure and escalate to ASM for the next cycle's design.",
        ],
      },
    ],
  },
];

const ASMObjections = () => {
  const [openTop, setOpenTop] = useState(false);
  const [expandedObjection, setExpandedObjection] = useState<string | null>(null);

  return (
    <ASMLayout hideFilters>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            What are the key Objections raised by Retailers?
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Pune · 6 MEs · 6 Market Areas
          </p>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Common objections</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Share of objections raised by category
              </p>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              engagement signals
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={objections}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {objections.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-end pt-2 border-t border-border mt-2">
            <button
              onClick={() => setOpenTop(true)}
              className="text-primary text-sm font-medium hover:underline"
            >
              See top 5 objections in the area →
            </button>
          </div>
        </Card>
      </div>

      <Dialog
        open={openTop}
        onOpenChange={(open) => {
          setOpenTop(open);
          if (!open) setExpandedObjection(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top 5 objections in Pune</DialogTitle>
            <DialogDescription>
              Most frequently raised retailer concerns this period · tap one for best practices
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-auto pr-1 space-y-6">
            {topObjections.map((sec) => (
              <section key={sec.cat}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
                  {sec.cat}
                </p>
                <div className="space-y-2">
                  {sec.items.map((it, idx) => {
                    const key = `${sec.cat}-${idx}`;
                    const isExpanded = expandedObjection === key;
                    return (
                      <div key={key} className="rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => setExpandedObjection(isExpanded ? null : key)}
                          className="w-full flex items-start justify-between gap-2 p-3 text-left hover:bg-accent/40 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground leading-snug">
                              “{it.q}”
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                              {it.e}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3">
                            <div className="flex items-center gap-1.5 text-xs font-medium italic text-muted-foreground mb-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              Best Practices
                            </div>
                            <ul className="space-y-1.5">
                              {it.bestPractices.map((bp, i) => (
                                <li key={i} className="text-sm text-foreground/85 leading-relaxed flex gap-2">
                                  <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ASMLayout>
  );
};

export default ASMObjections;
