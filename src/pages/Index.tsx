import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Monitor,
  BarChart3,
  UserCircle,
  Users,
  Network,
  Building2,
  ArrowRight,
} from "lucide-react";

type View = "systemic" | "product";

const subsystems = [
  {
    id: "me-retailer",
    name: "ME – Retailer sub-system",
    blurb:
      "The field engagement loop between an ME and each retailer, quietly shaped by the intelligence layers behind it.",
    image: "/Placeholder%20Images/Picture1.jpg",
    icon: Users,
    ready: true,
  },
  {
    id: "me-asm",
    name: "ME – ASM sub-system",
    blurb:
      "How ME engagements roll up into an ASM's tactical decisions across the retailers they oversee.",
    image: null,
    icon: BarChart3,
    ready: false,
  },
  {
    id: "me-asm-leadership",
    name: "ME – ASM – Leadership sub-system",
    blurb:
      "The full chain from field engagement to strategic intelligence at the leadership layer.",
    image: null,
    icon: Building2,
    ready: false,
  },
];

const includedLayers = ["Retailer Intelligence", "Nudges", "Continuous Evolution"];

const Index = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("systemic");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-lg font-medium tracking-wide mb-1">Paints</p>
          <h1 className="font-display font-bold text-4xl text-foreground">Retailer Engagement System</h1>
          <p className="text-muted-foreground text-sm">
            {view === "systemic"
              ? "Explore the system as a set of interacting sub-systems"
              : "Select your interface to continue"}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
            {(
              [
                { key: "systemic" as View, label: "Systemic view", icon: Network },
                { key: "product" as View, label: "Product view", icon: Smartphone },
              ]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  view === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === "systemic" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subsystems.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.id}
                  className={`overflow-hidden flex flex-col transition-shadow group ${
                    s.ready ? "cursor-pointer hover:shadow-lg" : "opacity-90"
                  }`}
                  onClick={() => s.ready && navigate(`/system/${s.id}`)}
                >
                  <div className="h-32 bg-secondary relative overflow-hidden">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-10 h-10 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-display font-bold text-lg text-foreground leading-snug">{s.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1.5 flex-1">{s.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {includedLayers.map((l) => (
                        <span
                          key={l}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      {s.ready ? (
                        <Button variant="outline" className="w-full">
                          Open sub-system <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center">Description coming soon</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/me/area")}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Smartphone className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">ME App</h2>
              <p className="text-sm text-muted-foreground mb-4">MEs use the app with each of their retailers for their day-to-day engagements as part of their field visits...</p>
              <Button variant="field" className="w-full">Open ME App →</Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/asm")}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BarChart3 className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">ASM Analytics App</h2>
              <p className="text-sm text-muted-foreground mb-4">Aggregated visibility for ASMs across the MEs they oversee - patterns, objections, and engagement quality.</p>
              <Button variant="outline" className="w-full">Open ASM App →</Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/leadership")}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Monitor className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">Leadership App</h2>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                {`Enables leadership of the paints business to have:
-> strategic vision of retailer networks
-> high-quality engagement at ME level`}
              </p>
              <Button variant="outline" className="w-full">Open Dashboard →</Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/me/profile")}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <UserCircle className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">ME Profile</h2>
              <p className="text-sm text-muted-foreground mb-4">MEs can see an overview of their retailers' objections, market insights shared and the past engagements.</p>
              <Button variant="outline" className="w-full">Open ME Profile →</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
