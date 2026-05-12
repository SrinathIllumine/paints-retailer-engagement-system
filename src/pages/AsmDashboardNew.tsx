import { Link } from "react-router-dom";
import KpiCards from "@/components/asm-dashboard/KpiCards";
import EngagementUnitCoverage from "@/components/asm-dashboard/EngagementUnitCoverage";
import ObjectionsAndDonut from "@/components/asm-dashboard/ObjectionsAndDonut";
import MarketInsights from "@/components/asm-dashboard/MarketInsights";
import EngagementQuality from "@/components/asm-dashboard/EngagementQuality";
import DailyEngagementReports from "@/components/asm-dashboard/DailyEngagementReports";

const AsmDashboardNew = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <header className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            ASM Dashboard · Pune Zone
          </p>
          <h1 className="text-[22px] font-medium text-foreground">Rajiv Sharma</h1>
          <p className="text-[12px] text-muted-foreground">7 MEs · 1,400 retailers (200 per ME)</p>
        </div>
        <span className="text-[12px] border rounded-md bg-muted px-2.5 py-1 text-muted-foreground">
          Week: Apr 28 – May 5, 2026
        </span>
      </header>

      <KpiCards />
      <EngagementUnitCoverage />
      <ObjectionsAndDonut />
      <MarketInsights />
      <EngagementQuality />
      <DailyEngagementReports />
    </div>
  </div>
);

export default AsmDashboardNew;
