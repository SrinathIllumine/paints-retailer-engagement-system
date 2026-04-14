import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import {
  Search,
  MapPin,
  Play,
  Layers,
  Rocket,
  Users,
  Map,
  LayoutGrid,
  TrendingUp,
  IndianRupee,
  ChevronRight,
  Store,
} from "lucide-react";
import { dealers, engagementThemes, type DealerType, type RevenueCategory } from "@/data/mockData";

type DiscoveryMode = "area" | "category" | "revenue" | "map";

const categoryConfig: Record<DealerType, { label: string; count: number; icon: typeof Store }> = {
  new: { label: "New", count: 0, icon: Rocket },
  loyal: { label: "Loyal", count: 0, icon: TrendingUp },
  inactive: { label: "Inactive", count: 0, icon: Store },
  declining: { label: "Declining", count: 0, icon: Store },
};

const revenueConfig: Record<RevenueCategory, { label: string; range: string }> = {
  A: { label: "A Category", range: "> ₹2 Cr" },
  B: { label: "B Category", range: "₹1–2 Cr" },
  C: { label: "C Category", range: "< ₹1 Cr" },
};

const themeIcons: Record<string, typeof Layers> = {
  Layers,
  Rocket,
  Users,
};

const MyTradingArea = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DealerType | null>(null);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueCategory | null>(null);

  const areas = useMemo(() => [...new Set(dealers.map((d) => d.area))], []);

  const categoryCounts = useMemo(() => {
    const counts: Record<DealerType, number> = { new: 0, loyal: 0, inactive: 0, declining: 0 };
    dealers.forEach((d) => counts[d.type]++);
    return counts;
  }, []);

  const revenueCounts = useMemo(() => {
    const counts: Record<RevenueCategory, number> = { A: 0, B: 0, C: 0 };
    dealers.forEach((d) => counts[d.revenueCategory]++);
    return counts;
  }, []);

  const filteredDealers = useMemo(() => {
    let result = dealers;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q) ||
          d.dealerCode.toLowerCase().includes(q)
      );
    }
    if (selectedArea) result = result.filter((d) => d.area === selectedArea);
    if (selectedCategory) result = result.filter((d) => d.type === selectedCategory);
    if (selectedRevenue) result = result.filter((d) => d.revenueCategory === selectedRevenue);
    return result;
  }, [searchQuery, selectedArea, selectedCategory, selectedRevenue]);

  const showDealerList = searchQuery.trim() || selectedArea || selectedCategory || selectedRevenue || discoveryMode === "map";

  const clearFilters = () => {
    setSelectedArea(null);
    setSelectedCategory(null);
    setSelectedRevenue(null);
    setDiscoveryMode(null);
    setSearchQuery("");
  };

  return (
    <MeLayout title="My Trading Area">
      <div className="p-4 space-y-5">
        {/* Global Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, area, or dealer code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-card border-border/60 text-sm"
          />
        </div>

        {/* Discovery Modes */}
        {!showDealerList && (
          <>
            <div className="animate-slide-up">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Discover Retailers</h2>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                  onClick={() => setDiscoveryMode("area")}
                >
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center mb-2">
                    <MapPin className="w-5 h-5 text-info" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">By Area</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{areas.length} localities</p>
                </Card>

                <Card
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                  onClick={() => setDiscoveryMode("category")}
                >
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                    <LayoutGrid className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">By Category</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">4 segments</p>
                </Card>

                <Card
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                  onClick={() => setDiscoveryMode("revenue")}
                >
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mb-2">
                    <IndianRupee className="w-5 h-5 text-warning" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">By Revenue</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">A, B, C tiers</p>
                </Card>

                <Card
                  className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                  onClick={() => setDiscoveryMode("map")}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Map View</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Visual overview</p>
                </Card>
              </div>
            </div>

            {/* Customized Engagement Plan */}
            <div className="animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customized Engagement Plan</h2>
              <p className="text-xs text-muted-foreground mb-3 -mt-1">Guided discussions to help your dealers grow — not a sales pitch.</p>
              <div className="space-y-3">
                {engagementThemes.map((theme, i) => {
                  const Icon = themeIcons[theme.icon] || Layers;
                  return (
                    <Card
                      key={theme.id}
                      className="p-4 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md animate-slide-up"
                      style={{ animationDelay: `${(i + 2) * 60}ms`, animationFillMode: "backwards" }}
                      onClick={() => navigate(`/me/engagement/${theme.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-${theme.color}/10 flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 text-${theme.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm leading-snug">{theme.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{theme.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Discovery Sub-views */}
        {discoveryMode === "area" && !selectedArea && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Select Area</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-medium">Back</button>
            </div>
            {areas.map((area) => (
              <Card
                key={area}
                className="p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setSelectedArea(area)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-info" />
                  <span className="font-medium text-sm text-foreground">{area}</span>
                </div>
                <span className="text-xs text-muted-foreground">{dealers.filter((d) => d.area === area).length} dealers</span>
              </Card>
            ))}
          </div>
        )}

        {discoveryMode === "category" && !selectedCategory && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Select Category</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-medium">Back</button>
            </div>
            {(["new", "loyal", "inactive", "declining"] as DealerType[]).map((type) => (
              <Card
                key={type}
                className="p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setSelectedCategory(type)}
              >
                <div className="flex items-center gap-2">
                  <DealerTypeBadge type={type} />
                </div>
                <span className="text-xs text-muted-foreground">{categoryCounts[type]} dealers</span>
              </Card>
            ))}
          </div>
        )}

        {discoveryMode === "revenue" && !selectedRevenue && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Select Revenue Tier</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-medium">Back</button>
            </div>
            {(["A", "B", "C"] as RevenueCategory[]).map((cat) => (
              <Card
                key={cat}
                className="p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setSelectedRevenue(cat)}
              >
                <div>
                  <span className="font-semibold text-sm text-foreground">{revenueConfig[cat].label}</span>
                  <span className="text-xs text-muted-foreground ml-2">{revenueConfig[cat].range}</span>
                </div>
                <span className="text-xs text-muted-foreground">{revenueCounts[cat]} dealers</span>
              </Card>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {discoveryMode === "map" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Map View</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-medium">Back</button>
            </div>
            <Card className="overflow-hidden">
              <div className="relative bg-secondary/30 h-52 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                  {/* Stylized map dots */}
                  {dealers.map((d, i) => (
                    <div
                      key={d.id}
                      className="absolute w-3 h-3 rounded-full bg-primary shadow-sm"
                      style={{
                        left: `${15 + (i % 4) * 20 + Math.random() * 10}%`,
                        top: `${15 + Math.floor(i / 4) * 40 + Math.random() * 10}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center z-10">
                  <Map className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">Interactive map coming soon</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{dealers.length} dealers in your territory</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Dealer List */}
        {showDealerList && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">{filteredDealers.length} retailers found</span>
              {(selectedArea || selectedCategory || selectedRevenue) && (
                <button onClick={clearFilters} className="text-xs text-primary font-medium">Clear filters</button>
              )}
            </div>
            {filteredDealers.map((dealer, i) => (
              <Card
                key={dealer.id}
                className="p-4 cursor-pointer active:scale-[0.98] transition-transform animate-slide-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
                onClick={() => navigate(`/me/dealer/${dealer.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate text-sm">{dealer.name}</h3>
                      <DealerTypeBadge type={dealer.type} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{dealer.location}</span>
                      <span className="mx-1">·</span>
                      <span className="font-medium">{dealer.dealerCode}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{dealer.lastVisit}</p>
                  </div>
                  <Button
                    variant="field"
                    size="sm"
                    className="shrink-0 h-9 px-3 rounded-lg text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/me/dealer/${dealer.id}`);
                    }}
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Visit
                  </Button>
                </div>
              </Card>
            ))}
            {filteredDealers.length === 0 && (
              <div className="text-center py-8">
                <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No retailers match your search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MeLayout>
  );
};

export default MyTradingArea;
