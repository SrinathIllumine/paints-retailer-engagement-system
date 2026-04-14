import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, User } from "lucide-react";

interface MeLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
}

const MeLayout = ({ children, title, showBack = false }: MeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-primary px-4 py-3 flex items-center gap-3 shadow-md">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-1 text-primary-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <h1 className="text-primary-foreground font-display font-semibold text-lg flex-1 truncate">{title}</h1>
        {!showBack && location.pathname !== "/" && (
          <button onClick={() => navigate("/me")} className="p-1 text-primary-foreground">
            <Home className="w-5 h-5" />
          </button>
        )}
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MeLayout;
