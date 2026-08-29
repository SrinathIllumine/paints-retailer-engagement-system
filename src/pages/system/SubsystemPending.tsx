import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";

const SubsystemPending = ({ name }: { name: string }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Systemic view
        </button>

        <div className="mt-24 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Construction className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sub-system</p>
          <h1 className="font-display font-bold text-3xl text-foreground">{name}</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            This sub-system will be detailed in an upcoming iteration.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Systemic view
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubsystemPending;
