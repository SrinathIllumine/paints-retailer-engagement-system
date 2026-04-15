import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserCircle, Target, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/leadership" },
  { icon: Users, label: "Segmentation", path: "/leadership/segmentation" },
  { icon: UserCircle, label: "Retailer 360°", path: "/leadership/dealer-profile" },
  { icon: Target, label: "Strategic", path: "/leadership/targeting" },
  { icon: BarChart3, label: "Analytics", path: "/leadership/analytics" },
];

const LeadershipLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="font-display font-bold text-lg text-sidebar-foreground">JK Cement</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Retailer Intelligence System</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default LeadershipLayout;
