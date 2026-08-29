import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Brain,
  BellRing,
  RefreshCw,
  ShieldQuestion,
  Lightbulb,
  GraduationCap,
  Flag,
  Radar,
  MessageSquareQuote,
  Users2,
  Zap,
  Database,
  Gauge,
  Check,
} from "lucide-react";

const ME_IMG = "/Placeholder%20Images/IMG_20260622_101109.jpg";
const RETAILER_IMG = "/Placeholder%20Images/IMG_20260506_115422.jpg";

const reportSections = [
  {
    icon: ShieldQuestion,
    label: "Objections Handled",
    text: "Demand is low — premium slowdown in the area. Pushed faster-moving mid-range SKUs first instead of forcing premium.",
  },
  {
    icon: Lightbulb,
    label: "Business Ideas Proposed",
    text: "New construction sites coming up — offered the complete solutions range and a business growth session for contractors.",
  },
  {
    icon: GraduationCap,
    label: "Product / Scheme Education",
    text: "Promoted the new small-sized repainting packs; explained the newly launched Painter Loyalty Scheme.",
  },
  {
    icon: Flag,
    label: "Action Points / Go-Forwards",
    text: "Meet key painters / contractors within the next 7 days to generate demand.",
  },
  {
    icon: Radar,
    label: "New Market Insights",
    text: "New competitor 'Chetak Paints' is gaining popularity among contractors and retailers in the market.",
  },
  {
    icon: MessageSquareQuote,
    label: "Key Critical Feedback",
    text: "We can educate some contractors on the premium product offerings.",
  },
];

const intelligenceModels = [
  {
    icon: Users2,
    title: "Retailer Morphologies",
    points: ["Classifies every retailer by their current engagement state"],
    tags: ["New", "Declining", "Inactive", "Loyal"],
  },
  {
    icon: Zap,
    title: "AI-based flashpoints retrieval model",
    points: [
      "Library of flashpoints",
      "Library of best practices per flashpoint — mapped from the top MEs & retailers",
      "Voice-based retrieval tagging for faster, relevant access",
    ],
    tags: [],
  },
  {
    icon: Database,
    title: "Knowledge-harvesting models",
    points: [
      "Spots patterns across insight types",
      "Captures them in market-specific insight databases",
    ],
    tags: ["Competition", "Contractor", "Schemes", "Demand", "Painter", "Product"],
  },
  {
    icon: Gauge,
    title: "Engagement Quality Index model",
    points: [
      "Analyses the engagement report output",
      "Time spent / duration",
      "Preparation levels",
      "Pending action points",
      "Objections raised, and more",
    ],
    tags: [],
  },
];

const nudgeTypes = [
  { label: "Engagement nudge", hint: "Engage under-served or newly introduced retailers" },
  { label: "Pending objection nudge", hint: "Objections still left unaddressed" },
  { label: "Best practice nudge", hint: "An approach that worked for a comparable ME / retailer" },
];

const evolutionAreas = [
  "Engagement units",
  "Conversation structure",
  "Objection handling logic",
  "Retailer action playbook",
];

const SecondaryCard = ({
  icon: Icon,
  title,
  caption,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  caption: string;
  children: React.ReactNode;
}) => (
  <Card className="p-4 bg-secondary/40 border-border/60 h-full">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center border border-border/60 shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-base text-foreground/90">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{caption}</p>
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </Card>
);

const PersonCard = ({
  img,
  objectPosition,
  role,
  name,
}: {
  img: string;
  objectPosition: string;
  role: string;
  name: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-card shadow-md ring-1 ring-border">
      <img src={img} alt={name} className="w-full h-full object-cover" style={{ objectPosition }} />
    </div>
    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-primary">{role}</p>
    <p className="text-sm font-semibold text-foreground leading-snug max-w-[12rem]">{name}</p>
  </div>
);

const MeRetailerSubsystem = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-5 py-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Systemic view
        </button>

        <div className="mt-4 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sub-system</p>
          <h1 className="font-display font-bold text-3xl text-foreground">ME – Retailer</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            The engagement between an ME and a retailer is the core loop. The intelligence layers below never appear in
            the room — they quietly prepare it and quietly learn from it.
          </p>
        </div>

        {/* Primary emphasis: the engagement */}
        <div className="relative rounded-3xl border-2 border-dashed border-primary/25 bg-gradient-to-b from-primary/[0.04] to-transparent p-6 md:p-8">
          <span className="absolute -top-3 left-6 bg-background px-2 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
            The engagement
          </span>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-4 items-stretch">
            <div className="flex items-center justify-center">
              <PersonCard img={ME_IMG} objectPosition="50% 25%" role="ME" name="Manish Kumar" />
            </div>

            {/* Engagement Report — the connecting interface */}
            <Card className="border-primary/20 shadow-sm">
              <div className="px-4 py-2.5 border-b border-border bg-primary/5 rounded-t-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Engagement Report</span>
              </div>
              <div className="px-4 py-2 border-b border-border/70 text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                <span>29 Aug 2026</span>
                <span>·</span>
                <span>ME: Manish Kumar</span>
                <span>·</span>
                <span>Retailer: Jai Maharashtra Hardware &amp; Electricals</span>
              </div>
              <ul className="divide-y divide-border/60">
                {reportSections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label} className="px-4 py-2.5 flex gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{s.label}</p>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{s.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="flex items-center justify-center">
              <PersonCard
                img={RETAILER_IMG}
                objectPosition="78% 55%"
                role="Retailer"
                name="Jai Maharashtra Hardware & Electricals"
              />
            </div>
          </div>
        </div>

        {/* Subtle loop-back cue */}
        <div className="flex items-center gap-3 my-6 text-muted-foreground">
          <div className="flex-1 border-t border-dashed border-border" />
          <span className="text-[11px] uppercase tracking-wide">What goes on in the background</span>
          <div className="flex-1 border-t border-dashed border-border" />
        </div>

        {/* Secondary emphasis: the intelligence layers */}
        <div className="space-y-4">
          <SecondaryCard
            icon={Brain}
            title="Retailer Intelligence"
            caption="AI + rules layer · prepares the next engagement"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intelligenceModels.map((m) => {
                const MIcon = m.icon;
                return (
                  <div key={m.title} className="rounded-lg bg-card border border-border/60 p-3.5">
                    <div className="flex items-center gap-2">
                      <MIcon className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm font-semibold text-foreground leading-snug">{m.title}</p>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-1.5 text-xs text-muted-foreground leading-snug">
                          <Check className="w-3 h-3 mt-0.5 text-success shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    {m.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SecondaryCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecondaryCard icon={BellRing} title="Nudges" caption="execution layer · steers the ME before the visit">
              <ul className="divide-y divide-border/60 rounded-lg bg-card border border-border/60">
                {nudgeTypes.map((n) => (
                  <li key={n.label} className="px-3 py-2 flex items-baseline gap-2">
                    <BellRing className="w-3 h-3 text-primary shrink-0 translate-y-0.5" />
                    <span className="text-xs font-semibold text-foreground">{n.label}</span>
                    <span className="text-xs text-muted-foreground leading-snug">— {n.hint}</span>
                  </li>
                ))}
              </ul>
            </SecondaryCard>

            <SecondaryCard
              icon={RefreshCw}
              title="Continuous Evolution"
              caption="ongoing improvement layer · refines what comes next"
            >
              <p className="text-xs text-muted-foreground mb-2">Continuously refines</p>
              <div className="grid grid-cols-2 gap-1.5">
                {evolutionAreas.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 rounded-md bg-card border border-border/60 px-2 py-1.5 text-xs text-foreground/80"
                  >
                    <RefreshCw className="w-3 h-3 text-primary shrink-0" />
                    {a}
                  </span>
                ))}
              </div>
            </SecondaryCard>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-6 italic">
          Morphologies, flashpoints, harvested knowledge and the engagement quality index all fold back into the next
          ME – Retailer engagement — without either side having to ask for them.
        </p>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Systemic view
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeRetailerSubsystem;
