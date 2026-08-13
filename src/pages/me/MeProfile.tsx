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
import { ArrowRight, LayoutDashboard, MapPin } from "lucide-react";
import { dealers } from "@/data/mockData";

type NudgeKey = "engagement" | "objections" | "bestPractice";

const newRetailers = dealers.filter((d) => d.type === "new");

// Retailers with a pending objection, each paired with a response tailored to their specific situation
// (rather than a generic FAQ) — drawn from their type and last-visit outcome.
const pendingObjections = [
  {
    dealerId: "3", // Krishna Traders
    objection: "Considering a competitor brand for better schemes",
    response: "Highlight our current scheme edge and share a side-by-side comparison — most retailers reconsider once they see the full picture.",
  },
  {
    dealerId: "4", // Gupta Paint House
    objection: "Shop has gone inactive — reason unclear",
    response: "Try an off-peak visit or a phone check-in first to understand if it's a temporary closure or a deeper issue before re-pitching.",
  },
  {
    dealerId: "7", // Singh Building Centre
    objection: "Feels under-served by ME visit frequency",
    response: "Step up visit cadence for the next month and proactively share upcoming scheme changes — under-visited retailers respond well to a visible increase in attention.",
  },
  {
    dealerId: "9", // Deshpande Hardware Stores
    objection: "Cited service gaps in past engagements",
    response: "Acknowledge the specific service gap first, then offer a concrete fix (faster delivery commitment, dedicated support contact) before reintroducing the product pitch.",
  },
].map((o) => ({ ...o, dealer: dealers.find((d) => d.id === o.dealerId) }));

const nudges: { key: NudgeKey; label: string; quote: string; cta: string }[] = [
  {
    key: "engagement",
    label: "Engagement Nudge:",
    quote: "You have engaged with only 2% of new retailers in the area. Engage with them to make them active.",
    cta: "Click here to see the list of retailers",
  },
  {
    key: "objections",
    label: "Pending Objections Nudge:",
    quote: "30% of retailer objections in your trading area are yet to be addressed.",
    cta: "Click here to see how to respond",
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

      {/* Pending Objections Nudge popup */}
      <Dialog open={openNudge === "objections"} onOpenChange={(open) => !open && setOpenNudge(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to respond</DialogTitle>
            <DialogDescription>Retailers with a pending objection, and how to approach each one</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto space-y-3 pr-1">
            {pendingObjections.map((o) => (
              <div key={o.dealerId} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">{o.dealer?.name}</p>
                <p className="text-xs text-foreground/85 leading-snug mt-1">“{o.objection}”</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{o.response}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-7 text-xs"
                  onClick={() => {
                    setOpenNudge(null);
                    navigate(`/me/dealer/${o.dealerId}`);
                  }}
                >
                  Engage →
                </Button>
              </div>
            ))}
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
                  "Identify 1-2 upcoming construction clusters in your trading area",
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
