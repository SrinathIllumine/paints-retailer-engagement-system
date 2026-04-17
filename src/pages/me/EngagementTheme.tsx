import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  StickyNote,
  Layers,
  Rocket,
  Users,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { engagementThemes, dealers } from "@/data/mockData";

const themeIcons: Record<string, typeof Layers> = { Layers, Rocket, Users };

// Per-theme best practices (contextual to each objection)
const bestPracticesMap: Record<string, string[]> = {
  wi1: [
    "Start with a small trial batch to test actual demand before committing further",
    "Ask 3-4 regular contractors what products they currently source from elsewhere",
    "Place JK products near high-traffic areas in the shop for passive visibility",
    "Track weekly enquiries for 30 days to build a real demand picture",
  ],
  wi2: [
    "Begin with JK's minimum order quantity to limit initial outlay",
    "Focus on fast-moving SKUs that turn over within 2-3 weeks",
    "Monitor sell-through rates to guide future ordering decisions",
    "Reinvest initial margins into gradually expanding the range",
  ],
  wi3: [
    "Use JK's compact 4 sq ft display stand designed for small shops",
    "Position near the billing counter for maximum visibility with minimal space",
    "Rotate slow-moving items monthly to keep the display fresh",
    "Stack vertically using wall-mounted shelving provided by JK",
  ],
  wi4: [
    "Start with the top 3 proven sellers in your market segment",
    "Set a 30-day review checkpoint to assess traction before expanding",
    "Connect with 2-3 nearby retailers who successfully added JK products",
    "Track customer feedback to build confidence in the product range",
  ],
  wi5: [
    "Position JK as a premium complement, not a replacement for existing brands",
    "Create a clear display showing good-better-best options for customers",
    "Let customers choose — more options mean more footfall and higher basket value",
    "Highlight JK's unique product strengths in conversations with contractors",
  ],
  wi6: [
    "Request free JK product samples for personal testing before stocking",
    "Arrange a contractor application demo at a local site",
    "Share JK's quality certifications and test reports with enquiring buyers",
    "Start with one product category and validate quality before expanding",
  ],
  wi7: [
    "Organize a hands-on training session for 5-8 key contractors",
    "Share a side-by-side performance comparison to show contractor benefits",
    "Offer exclusive first-access to new JK products through your shop",
    "Build trust through consistent product quality and availability",
  ],
  wi8: [
    "Request JK field team to introduce you to 8-10 active local contractors",
    "Host a small painter meet at your shop for product awareness",
    "Build relationships with contractors through regular engagement",
    "Start with one painter meet and grow based on response",
  ],
};

// Per-theme takeaways (action-oriented outcomes)
const themePositiveTakeaways: Record<string, string[]> = {
  et1: [
    "I'll try 2–3 relevant SKUs with contractors before the next meeting to see if it works for me",
    "I'll introduce JK products to existing contractor network and get their feedback",
    "To test product performance at select customer sites will be my top priority",
    "Will share contractor feedback regarding the new paint in next meeting",
  ],
  et2: [
    "I'll place initial order of fast-moving SKUs this week to test the waters",
    "Connecting with 3 local contractors for product trials will give me some market exposure",
    "I'll set up JK product display in high-visibility area to gain more attention",
    "Share first-month performance review in next visit",
  ],
  et3: [
    "My aim is to identify 5 key contractors for JK engagement",
    "I'll organize a hands-on product demo at shop to gain contractors' and painters' trust.",
    "We can invite painters to the upcoming JK meet event",
    "I'll collect contractor feedback after first application to understand more about the product",
  ],
};

const EngagementTheme = () => {
  const { themeId, id: dealerId } = useParams();
  const navigate = useNavigate();
  const theme = engagementThemes.find((t) => t.id === themeId) || engagementThemes[0];
  const dealer = dealers.find((d) => d.id === dealerId) || dealers[0];
  const Icon = themeIcons[theme.icon] || Layers;

  const currentThemeIndex = engagementThemes.findIndex((t) => t.id === themeId);
  const isLastTheme = currentThemeIndex === engagementThemes.length - 1;
  const nextTheme = !isLastTheme ? engagementThemes[currentThemeIndex + 1] : null;

  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [selectedWhatIfs, setSelectedWhatIfs] = useState<Set<string>>(new Set());
  const [expandedBestPractices, setExpandedBestPractices] = useState<Record<string, boolean>>({});
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  useEffect(() => {
    setCompletedPoints(new Set());
    setSelectedWhatIfs(new Set());
    setExpandedBestPractices({});
    setSelectedChips(new Set());
    setAdditionalNotes("");
    window.scrollTo(0, 0);
  }, [themeId]);

  const toggleComplete = (id: string) => {
    const next = new Set(completedPoints);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompletedPoints(next);
  };

  const toggleWhatIf = (id: string) => {
    // Only one objection's Best Practices visible at a time
    if (selectedWhatIfs.has(id)) {
      setSelectedWhatIfs(new Set());
      setExpandedBestPractices({});
    } else {
      setSelectedWhatIfs(new Set([id]));
      // Best practices open by default for the newly selected objection only
      setExpandedBestPractices({ [id]: true });
    }
  };

  const toggleChip = (chip: string) => {
    const next = new Set(selectedChips);
    if (next.has(chip)) next.delete(chip); else next.add(chip);
    setSelectedChips(next);
  };

  const progress = theme.discussionPoints.length > 0
    ? (completedPoints.size / theme.discussionPoints.length) * 100
    : 0;

  const takeaways = themePositiveTakeaways[theme.id] || themePositiveTakeaways.et1;

  return (
    <MeLayout title={theme.title} showBack>
      <div className="p-4 space-y-5">
        {/* Theme Header — plain text, no red */}
        <div className="animate-slide-up flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 text-${theme.color}`} />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-snug">{theme.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Conversation with {dealer.name}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium">{completedPoints.size} of {theme.discussionPoints.length} discussed</span>
            <span className="font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full bg-${theme.color} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Discussion Points - horizontal swipe carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 uppercase tracking-wider font-extrabold text-card-foreground text-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              CORE DISCUSSION POINTS
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {activeSlide + 1} / {theme.discussionPoints.length}
            </span>
          </div>

          <Carousel setApi={setCarouselApi} opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {theme.discussionPoints.map((point, i) => {
                const isDone = completedPoints.has(point.id);
                return (
                  <CarouselItem key={point.id} className="basis-full">
                    <Card className={`overflow-hidden transition-all ${isDone ? "border-success/40 bg-success/5" : ""}`}>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-base">{point.title}</h4>
                            <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                          </div>
                        </div>

                        {/* USEFUL INSIGHTS — always visible & open */}
                        <div className="bg-secondary/40 rounded-lg p-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">USEFUL INSIGHTS FOR YOU</p>
                          <p className="text-sm text-foreground/85 leading-relaxed font-normal">{point.detail}</p>
                        </div>

                        <Button
                          variant={isDone ? "secondary" : "field"}
                          size="sm"
                          className="w-full"
                          onClick={() => toggleComplete(point.id)}
                        >
                          {isDone ? "Mark as Not Discussed" : "Mark as Discussed ✓"}
                        </Button>
                      </div>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-3">
              <CarouselPrevious className="static translate-y-0" />
              <div className="flex gap-1.5">
                {theme.discussionPoints.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to point ${i + 1}`}
                    onClick={() => carouselApi?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all ${i === activeSlide ? `w-5 bg-${theme.color}` : "w-1.5 bg-muted"}`}
                  />
                ))}
              </div>
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* What-Ifs / Objections - with Best Practices only */}
        {theme.whatIfs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 uppercase tracking-wider text-sm font-extrabold text-card-foreground">
              <Lightbulb className="w-3.5 h-3.5" />
              What-Ifs &amp; Objections
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Select any objection the retailer raises.</p>
            {theme.whatIfs.map((wi) => {
              const isSelected = selectedWhatIfs.has(wi.id);
              const practices = bestPracticesMap[wi.id] || [];
              const practicesOpen = expandedBestPractices[wi.id] !== false; // default open

              return (
                <Card key={wi.id} className={`overflow-hidden transition-all ${isSelected ? "border-warning/30" : ""}`}>
                  <button
                    className={`w-full tap-target px-4 py-3 text-left text-sm font-medium transition-all ${
                      isSelected ? "bg-warning/10 text-warning" : "bg-card text-foreground"
                    }`}
                    onClick={() => toggleWhatIf(wi.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-warning bg-warning text-warning-foreground" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </span>
                      {wi.label}
                    </span>
                  </button>

                  {isSelected && practices.length > 0 && (
                    <div className="px-4 pb-4 space-y-2 animate-fade-in">
                      <div className="border border-info/20 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between px-3 py-2.5 bg-info/5 text-left"
                          onClick={() => setExpandedBestPractices(prev => ({ ...prev, [wi.id]: prev[wi.id] === false ? true : false }))}
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold text-info uppercase">
                            <BookOpen className="w-3.5 h-3.5" />
                            BEST PRACTICES FOR THE RETAILER
                          </span>
                          {practicesOpen ? <ChevronUp className="w-3.5 h-3.5 text-info" /> : <ChevronDown className="w-3.5 h-3.5 text-info" />}
                        </button>
                        {practicesOpen && (
                          <div className="px-3 pb-3 pt-2 bg-info/5 space-y-1.5 animate-fade-in max-h-48 overflow-y-auto">
                            {practices.map((practice, idx) => (
                              <div key={idx} className="bg-background/60 border border-info/15 rounded-lg px-3 py-2.5 text-sm text-foreground/80">
                                {practice}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Retailer Response */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 uppercase tracking-wider text-sm font-extrabold text-card-foreground">
            <StickyNote className="w-3.5 h-3.5" />
            RETAILER ACTION POINTS / GO-FORWARDS
          </div>
          <p className="text-xs text-muted-foreground -mt-1">Select key retailer action points from your discussion.</p>

          <div className="space-y-2">
            {takeaways.map((chip) => {
              const isSelected = selectedChips.has(chip);
              return (
                <label
                  key={chip}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 cursor-pointer transition-all hover:border-primary/30 tap-target"
                  onClick={() => toggleChip(chip)}
                >
                  <Checkbox checked={isSelected} className="mt-0.5" />
                  <span className="text-sm text-foreground">{chip}</span>
                </label>
              );
            })}
          </div>

          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any key critical feedback from the retailer..."
            className="min-h-[60px] rounded-xl bg-card text-sm"
          />
        </div>

        {/* Navigation */}
        <div className="pt-2 space-y-2 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          <Button
            variant="field"
            className="w-full"
            onClick={() => {
              try {
                const key = `visitData:${dealer.id}`;
                const existing = JSON.parse(sessionStorage.getItem(key) || "{}");
                const themesData = existing.themes || {};
                themesData[theme.id] = {
                  themeTitle: theme.title,
                  discussedPoints: theme.discussionPoints
                    .filter((p) => completedPoints.has(p.id))
                    .map((p) => p.title),
                  objections: theme.whatIfs
                    .filter((w) => selectedWhatIfs.has(w.id))
                    .map((w) => w.label),
                  actionPoints: Array.from(selectedChips),
                  feedback: additionalNotes.trim() ? [additionalNotes.trim()] : [],
                };
                sessionStorage.setItem(key, JSON.stringify({ ...existing, themes: themesData }));
              } catch {}
              navigate(`/me/notes/${dealer.id}`);
            }}
          >
            Save and Go to Summary Page
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </MeLayout>
  );
};

export default EngagementTheme;
