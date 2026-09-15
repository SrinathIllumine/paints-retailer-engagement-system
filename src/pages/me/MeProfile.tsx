import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, ChevronDown, ChevronUp, LayoutDashboard, Lightbulb, MapPin } from "lucide-react";
import { dealers } from "@/data/mockData";

type NudgeKey = "engagement" | "objections" | "bestPractice";

const newRetailers = dealers.filter((d) => d.type === "new");

// Competition-related objections raised across the trading area, each paired with
// concrete best practices an ME can use to respond (rather than a generic FAQ).
const competitionObjections = [
  {
    id: "co1",
    text: "Competitor schemes are more visible and frequent",
    bestPractices: [
      "Show the retailer the current company scheme and explain the direct earning / benefit on his likely purchases.",
      "Prioritize and communicate the most relevant schemes to the retailer instead of sharing every scheme without context.",
      "Increase scheme visibility through every ME interaction — share scheme details on WhatsApp and revisit the retailer before the scheme closes to drive participation.",
    ],
  },
  {
    id: "co2",
    text: "Customers recognize competitor paint shades faster",
    bestPractices: [
      "Carry the shade card and tinting guide on every visit so customers can compare instantly at the counter.",
      "Coach the retailer's staff on 2-3 close shade matches to our range so they can respond confidently to walk-ins.",
      "Push for better in-shop shade display placement near the entrance to build recall.",
    ],
  },
  {
    id: "co3",
    text: "Competitors are doing more painter meets and site activities",
    bestPractices: [
      "Propose a painter meet at this retailer's shop and loop in the ME team for scheduling support.",
      "Identify 2-3 active painters in the area and organize a small on-site demo to rebuild visibility.",
      "Share our activation calendar with the retailer so they see upcoming events they can host.",
    ],
  },
];

const nudges: { key: NudgeKey; label: string; quote: string; cta: string }[] = [
  {
    key: "engagement",
    label: "Engagement Nudge:",
    quote: "You have engaged with only 2% of new retailers in the area. Engage with them to make them active.",
    cta: "Click here to see the list of retailers",
  },
  {
    key: "objections",
    label: "Objections Nudge:",
    quote: "45% of the objections in your trading area are competition-related",
    cta: "Click here to see the best practices",
  },
  {
    key: "bestPractice",
    label: "Best Practice Nudge:",
    quote: "ME in Nagpur has cracked a new market outreach approach.",
    cta: "Click here to see how this can be applied in your area",
  },
];

const MeProfile = () => {
  const navigate = useNavigate();
  const [openNudge, setOpenNudge] = useState<NudgeKey | null>(null);
  const [expandedObjectionId, setExpandedObjectionId] = useState<string | null>(null);

  return (
    <MeLayout title="ME Profile" showBack>
      <div className="p-4 space-y-4">
        <Button
          className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
          onClick={() => navigate("/me/dashboard")}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          View my dashboard
        </Button>

        <Card className="p-5">
          <h2 className="font-display font-bold text-xl text-foreground">Your Nudges</h2>
          <p className="text-xs text-muted-foreground mt-0.5">For the current week</p>

          <div className="mt-4 divide-y divide-border">
            {nudges.map((n) => (
              <div key={n.key} className="py-4 first:pt-0 last:pb-0">
                <p className="font-semibold text-foreground text-sm">{n.label}</p>
                <p className="italic text-foreground/85 text-sm leading-relaxed mt-1">“{n.quote}”</p>
                <button
                  onClick={() => setOpenNudge(n.key)}
                  className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-2 hover:underline"
                >
                  {n.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engagement Nudge popup */}
      <Dialog open={openNudge === "engagement"} onOpenChange={(open) => !open && setOpenNudge(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New retailers to engage</DialogTitle>
            <DialogDescription>Retailers introduced recently but not yet active</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto space-y-2.5 pr-1">
            {newRetailers.map((d) => (
              <div key={d.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {d.location}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{d.lastOutcome}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-7 text-xs"
                  onClick={() => {
                    setOpenNudge(null);
                    navigate(`/me/dealer/${d.id}`);
                  }}
                >
                  Engage →
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Objections Nudge popup */}
      <Dialog
        open={openNudge === "objections"}
        onOpenChange={(open) => {
          if (!open) {
            setOpenNudge(null);
            setExpandedObjectionId(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to respond – best practices</DialogTitle>
            <DialogDescription>
              What are the best practices which I can use to resolve retailer objections
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto space-y-2.5 pr-1">
            {competitionObjections.map((ob) => {
              const isExpanded = expandedObjectionId === ob.id;
              return (
                <div key={ob.id} className="rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedObjectionId(isExpanded ? null : ob.id)}
                    className="w-full flex items-start justify-between gap-2 p-3 text-left"
                  >
                    <p className="text-sm font-semibold text-foreground leading-snug flex-1">
                      {ob.text}
                    </p>
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
                        {ob.bestPractices.map((bp, i) => (
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
        </DialogContent>
      </Dialog>

      {/* Best Practice Nudge popup */}
      <Dialog open={openNudge === "bestPractice"} onOpenChange={(open) => !open && setOpenNudge(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nagpur's market outreach approach</DialogTitle>
            <DialogDescription>How this can be applied in your area</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-foreground/85 leading-relaxed">
              The Nagpur ME identified a cluster of untapped hardware stores near an upcoming residential project and ran a
              focused 2-week outreach: door-to-door introductions bundled with free sample kits, followed by a joint site
              visit with a contractor already active in the area. This converted 6 new retailers to active status within a
              month.
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                To apply this in your area
              </p>
              <ul className="space-y-1.5">
                {[
                  "Identify 1-2 upcoming construction prospects in your trading area",
                  "Shortlist retailers within that cluster who aren't yet engaged",
                  "Open with a sample kit + joint site visit alongside an active contractor",
                  "Follow up within 2 weeks to convert interest into a first order",
                ].map((step, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex gap-2">
                    <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MeLayout>
  );
};

export default MeProfile;
