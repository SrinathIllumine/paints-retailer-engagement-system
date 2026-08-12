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
import { AlertTriangle, MapPin } from "lucide-react";

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

const topObjections: { cat: string; items: { q: string; e: string }[] }[] = [
  {
    cat: "Competition-related",
    items: [
      { q: "Competitor schemes are more visible and frequent.", e: "Retailers feel other brands are more active with scratch cards, gifts, or painter rewards." },
      { q: "Customers recognize competitor paint shades faster.", e: "Strong tinting/touchpoint presence from larger paint brands." },
      { q: "Competitors are doing more painter meets and site activities.", e: "Retailers feel our activation has become weak compared to others." },
    ],
  },
  {
    cat: "Product-quality related",
    items: [
      { q: "Retailers feel product consistency changes batch-to-batch.", e: "Especially around workability, smoothness, or drying behavior in the primer." },
    ],
  },
  {
    cat: "Scheme-related",
    items: [
      { q: "Schemes are either unclear or not exciting enough.", e: "Retailers want simpler, faster, and more visible benefits tied to movement." },
    ],
  },
];

const ASMObjections = () => {
  const [openTop, setOpenTop] = useState(false);

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

      <Dialog open={openTop} onOpenChange={setOpenTop}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top 5 objections in Pune</DialogTitle>
            <DialogDescription>
              Most frequently raised retailer concerns this period
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[72vh] overflow-auto pr-1 space-y-6">
            {topObjections.map((sec) => (
              <section key={sec.cat}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
                  {sec.cat}
                </p>
                <ul className="space-y-3">
                  {sec.items.map((it, idx) => (
                    <li key={idx} className="pl-3 border-l-2 border-primary/40">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        “{it.q}”
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {it.e}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ASMLayout>
  );
};

export default ASMObjections;
