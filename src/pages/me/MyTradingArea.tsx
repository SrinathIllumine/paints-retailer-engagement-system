import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MeLayout from "@/components/me/MeLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Store,
  ChevronRight,
  MessageSquare,
  Zap,
} from "lucide-react";
import { dealers } from "@/data/mockData";

const FixedFooter = () => (
  <div className="px-4 py-3">
    <div className="grid grid-cols-2 gap-2">
      <Card className="p-2.5 border-primary/30 bg-primary/5">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-[11px] leading-tight">Proactive Engagement</h3>
            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">Build structured discussions with retailers around specific business outcomes</p>
          </div>
        </div>
      </Card>

      <Card className="p-2.5 opacity-60 cursor-not-allowed relative">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="min-w-0 pr-8">
            <h3 className="font-display font-bold text-foreground text-[11px] leading-tight">Flashpoints</h3>
            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">Capture &amp; curate best practices, solve day-to-day challenges</p>
          </div>
        </div>
        <span className="absolute top-1 right-1 text-[8px] bg-muted text-muted-foreground px-1 py-0.5 rounded-full font-medium">Soon</span>
      </Card>
    </div>
  </div>
);

const MyTradingArea = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const sortedDealers = useMemo(() => {
    // Per spec: only Jai Maharashtra Hardware & Electricals is shown.
    let result = dealers.filter((d) => d.id === "1");
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q) ||
          d.dealerCode.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery]);

  return (
    <MeLayout title="My Trading Area" showBack footer={<FixedFooter />}>
      <div className="p-4 pb-2 space-y-4">
        {/* Welcoming Message */}
        <div className="animate-fade-in">
          <p className="text-base text-foreground font-medium">Good to see you Manish Kumar 👋</p>
          <p className="text-sm text-muted-foreground">Let's plan your engagements with retailers today.</p>
        </div>

        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, area, or retailer code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-card border-border/60 text-sm"
          />
        </div>

        {/* Retailer List */}
        <div className="space-y-3 animate-fade-in">
          <span className="text-sm text-muted-foreground font-medium">{sortedDealers.length} retailer(s)</span>
          {sortedDealers.map((dealer, i) => (
            <Card
              key={dealer.id}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
              onClick={() => navigate(`/me/dealer/${dealer.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-sm mb-1">{dealer.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{dealer.location}</span>
                    <span className="mx-1">-</span>
                    <span className="font-medium">{dealer.dealerCode}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{dealer.lastVisit}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </Card>
          ))}
          {sortedDealers.length === 0 && (
            <div className="text-center py-8">
              <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No retailers match your search</p>
            </div>
          )}
        </div>
      </div>
    </MeLayout>
  );
};

export default MyTradingArea;
