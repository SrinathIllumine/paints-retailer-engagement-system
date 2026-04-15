import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DealerTypeBadge from "@/components/DealerTypeBadge";
import {
  Search,
  MapPin,
  Play,
  Map,
  Store,
  ChevronRight,
} from "lucide-react";
import { dealers, type DealerType, type RevenueCategory } from "@/data/mockData";

type DiscoveryMode = "area" | "category" | "revenue" | "map" | null;

const revenueConfig: Record<RevenueCategory, { label: string; range: string }> = {
  A: { label: "A Category", range: "> ₹2 Cr" },
  B: { label: "B Category", range: "₹1–2 Cr" },
  C: { label: "C Category", range: "< ₹1 Cr" },
};

const puneZones = [
  { name: "Pune West", dealers: dealers.filter((d) => d.area === "Pune West"), x: 20, y: 45 },
  { name: "Pune East", dealers: dealers.filter((d) => d.area === "Pune East"), x: 75, y: 40 },
  { name: "Pune South", dealers: dealers.filter((d) => d.area === "Pune South"), x: 45, y: 75 },
  { name: "Pune North", dealers: dealers.filter((d) => d.area === "Pune North"), x: 45, y: 15 },
  { name: "Pune NE", dealers: dealers.filter((d) => d.area === "Pune NE"), x: 72, y: 18 },
  { name: "Pune SE", dealers: dealers.filter((d) => d.area === "Pune SE"), x: 72, y: 72 },
  { name: "Pune NW", dealers: dealers.filter((d) => d.area === "Pune NW"), x: 20, y: 18 },
  { name: "Pune SW", dealers: dealers.filter((d) => d.area === "Pune SW"), x: 20, y: 72 },
];

const MyTradingArea = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DealerType | null>(null);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueCategory | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

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

  const showDealerList = searchQuery.trim() || selectedArea || selectedCategory || selectedRevenue;

  const clearFilters = () => {
    setSelectedArea(null);
    setSelectedCategory(null);
    setSelectedRevenue(null);
    setDiscoveryMode(null);
    setSearchQuery("");
  };

  const handleDiscoveryChange = (value: string) => {
    clearFilters();
    setDiscoveryMode(value as DiscoveryMode);
  };

  return (
    <MeLayout title="My Trading Area" showBack>
      <div className="p-4 space-y-4">
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

        {/* Discover Retailers Dropdown */}
        <div className="animate-slide-up">
          <Select value={discoveryMode || ""} onValueChange={handleDiscoveryChange}>
            <SelectTrigger className="h-12 rounded-xl bg-card border-border/60 text-sm">
              <SelectValue placeholder="Discover Retailers By..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Search By Area</SelectItem>
              <SelectItem value="category">Search By Category</SelectItem>
              <SelectItem value="revenue">Search By Revenue</SelectItem>
              <SelectItem value="map">Map View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Filters based on dropdown */}
        {discoveryMode === "area" && !selectedArea && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <h3 className="font-semibold text-foreground text-sm">Select Area</h3>
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{dealers.filter((d) => d.area === area).length} dealers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {discoveryMode === "category" && !selectedCategory && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <h3 className="font-semibold text-foreground text-sm">Select Category</h3>
            {(["new", "loyal", "inactive", "declining"] as DealerType[]).map((type) => (
              <Card
                key={type}
                className="p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setSelectedCategory(type)}
              >
                <DealerTypeBadge type={type} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{categoryCounts[type]} dealers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {discoveryMode === "revenue" && !selectedRevenue && !showDealerList && (
          <div className="space-y-2 animate-fade-in">
            <h3 className="font-semibold text-foreground text-sm">Select Revenue Tier</h3>
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{revenueCounts[cat]} dealers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Interactive Pune Map */}
        {discoveryMode === "map" && (
          <div className="animate-fade-in space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Pune Dealer Map</h3>
            <Card className="overflow-hidden">
              <div className="relative bg-secondary/20 h-72">
                {/* Map grid background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* City boundary */}
                    <ellipse cx="48" cy="48" rx="42" ry="40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
                    {/* Cross lines */}
                    <line x1="48" y1="5" x2="48" y2="90" stroke="hsl(var(--border))" strokeWidth="0.3" />
                    <line x1="5" y1="48" x2="90" y2="48" stroke="hsl(var(--border))" strokeWidth="0.3" />
                  </svg>
                </div>

                {/* Zone pins */}
                {puneZones.map((zone) => (
                  <div
                    key={zone.name}
                    className="absolute cursor-pointer transition-transform hover:scale-110"
                    style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: "translate(-50%, -50%)" }}
                    onMouseEnter={() => setHoveredZone(zone.name)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => setSelectedArea(zone.name)}
                  >
                    <div className={`relative flex flex-col items-center gap-1 ${hoveredZone === zone.name ? "z-20" : "z-10"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors ${
                        hoveredZone === zone.name ? "bg-primary text-primary-foreground scale-110" : "bg-card text-foreground border border-border"
                      }`}>
                        {zone.dealers.length}
                      </div>
                      <span className={`text-[10px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded ${
                        hoveredZone === zone.name ? "bg-primary text-primary-foreground" : "bg-card/90 text-muted-foreground"
                      }`}>
                        {zone.name.replace("Pune ", "")}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Center label */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                  <Map className="w-6 h-6 text-muted-foreground/20" />
                </div>
              </div>
              <div className="p-3 border-t border-border/50 bg-card">
                <p className="text-xs text-muted-foreground text-center">Tap a zone to see dealers in that area · {dealers.length} total dealers</p>
              </div>
            </Card>
          </div>
        )}

        {/* Dealer List */}
        {showDealerList && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">{filteredDealers.length} retailers found</span>
              <button onClick={clearFilters} className="text-xs text-primary font-medium">Clear filters</button>
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
