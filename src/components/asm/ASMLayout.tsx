import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Store,
  Lightbulb,
  LogOut,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  {
    icon: Users,
    label: "Leaderboard",
    sub: "How are MEs engaging with retailers?",
    path: "/asm",
  },
  {
    icon: AlertTriangle,
    label: "Retailer Objections",
    sub: "Key objections raised in my area",
    path: "/asm/objections",
  },
  {
    icon: Store,
    label: "All Retailers",
    sub: "Master list & profiles",
    path: "/asm/retailers",
  },
  {
    icon: Lightbulb,
    label: "Market Insights",
    sub: "Qualitative signals from the field",
    path: "/asm/insights",
  },
];

interface Props {
  children: ReactNode;
  /** Optional: hide global filters on screens that have their own */
  hideFilters?: boolean;
}

const ASMLayout = ({ children, hideFilters = false }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [period, setPeriod] = useState<"daily" | "weekly">("weekly");
  const [scope, setScope] = useState("maharashtra");

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="font-display font-bold text-lg text-sidebar-foreground">
            JK Cement
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">
            ASM Analytics
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {item.label}
                  </p>
                  <p
                    className={`text-[11px] leading-snug mt-0.5 ${
                      active
                        ? "text-sidebar-primary-foreground/80"
                        : "text-sidebar-foreground/55"
                    }`}
                  >
                    {item.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4" />
            Switch Role
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {!hideFilters && (
          <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Scope
              </span>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger className="h-8 w-[180px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="maharashtra">State · Maharashtra</SelectItem>
                  <SelectItem value="pune">Area · Pune</SelectItem>
                  <SelectItem value="pune-west">Market · Pune West</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <Tabs
                  value={period}
                  onValueChange={(v) => setPeriod(v as "daily" | "weekly")}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="daily" className="text-xs px-3">
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs px-3">
                      Weekly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default ASMLayout;
