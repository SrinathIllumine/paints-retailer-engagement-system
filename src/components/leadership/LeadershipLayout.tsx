import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, AlertTriangle, Lightbulb, Pentagon, Trophy, LogOut } from "lucide-react";

const navItems = [
  {
    icon: TrendingUp,
    label: "National Engagement",
    sub: "How are ME–retailer engagements improving on the ground?",
    path: "/leadership",
  },
  {
    icon: AlertTriangle,
    label: "Retailer Objections",
    sub: "What are common objection patterns across retailers in the country?",
    path: "/leadership/objections",
  },
  {
    icon: Lightbulb,
    label: "Market Intelligence",
    sub: "What patterns are emerging from the ground across the states?",
    path: "/leadership/insights",
  },
  {
    icon: Pentagon,
    label: "Engagement Coverage",
    sub: "What's the coverage of the Engagement Units across the retail network?",
    path: "/leadership/coverage",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    sub: "Top MEs, top & bottom states, top objections",
    path: "/leadership/leaderboard",
  },
];

const LeadershipLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="font-display font-bold text-lg text-sidebar-foreground">JK Cement</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Leadership Analytics</p>
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
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                  <p
                    className={`text-[11px] leading-snug mt-0.5 ${
                      active ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/55"
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
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default LeadershipLayout;
