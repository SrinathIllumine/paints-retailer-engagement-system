import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, User } from "lucide-react";

interface MeLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  /** Render a fixed footer pinned to the bottom of the mobile viewport. */
  footer?: ReactNode;
}

const MeLayout = ({ children, title, showBack = false, footer }: MeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col relative">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground px-4 py-3 flex items-center gap-3 shadow-md border-b border-sidebar-border">
        {showBack ? (
          <button
            onClick={() => {
              if (title === "My Trading Area") {
                navigate("/");
              } else {
                navigate(-1);
              }
            }}
            className="p-1 text-sidebar-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-sidebar-foreground/15 flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-foreground" />
          </div>
        )}
        <h1 className="text-sidebar-foreground font-display font-semibold text-lg flex-1 truncate">{title}</h1>
        {location.pathname !== "/" && (
          <button onClick={() => navigate("/")} className="p-1 text-sidebar-foreground" aria-label="Home">
            <Home className="w-5 h-5" />
          </button>
        )}
      </header>
      <main className={`flex-1 overflow-y-auto ${footer ? "pb-24" : ""}`}>{children}</main>
      {footer && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t border-border bg-background/95 backdrop-blur-sm">
          {footer}
        </div>
      )}
    </div>
  );
};

export default MeLayout;
