import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import MyTradingArea from "./pages/me/MyTradingArea.tsx";
import DealerSnapshot from "./pages/me/DealerSnapshot.tsx";
import GuidedConversation from "./pages/me/GuidedConversation.tsx";
import EngagementTheme from "./pages/me/EngagementTheme.tsx";
import VisitNotes from "./pages/me/VisitNotes.tsx";
import VisitComplete from "./pages/me/VisitComplete.tsx";
import VisitSummary from "./pages/me/VisitSummary.tsx";
import Dashboard from "./pages/leadership/Dashboard.tsx";
import Objections from "./pages/leadership/Objections.tsx";
import Insights from "./pages/leadership/Insights.tsx";
import Coverage from "./pages/leadership/Coverage.tsx";
import Leaderboard from "./pages/leadership/Leaderboard.tsx";
import ASMDashboard from "./pages/asm/ASMDashboard.tsx";
import ASMObjections from "./pages/asm/ASMObjections.tsx";
import ASMAllRetailers from "./pages/asm/ASMAllRetailers.tsx";
import ASMInsights from "./pages/asm/ASMInsights.tsx";
import AsmDashboardNew from "./pages/AsmDashboardNew.tsx";
import AsmReportsNew from "./pages/AsmReportsNew.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/me/area" element={<MyTradingArea />} />
          <Route path="/me/dealer/:id" element={<DealerSnapshot />} />
          <Route path="/me/conversation/:id" element={<GuidedConversation />} />
          <Route path="/me/engagement/:id/:themeId" element={<EngagementTheme />} />
          <Route path="/me/notes/:id" element={<VisitNotes />} />
          <Route path="/me/complete/:id" element={<VisitComplete />} />
          <Route path="/me/visit-summary/:id" element={<VisitSummary />} />
          <Route path="/leadership" element={<Dashboard />} />
          <Route path="/leadership/objections" element={<Objections />} />
          <Route path="/leadership/insights" element={<Insights />} />
          <Route path="/leadership/coverage" element={<Coverage />} />
          <Route path="/leadership/leaderboard" element={<Leaderboard />} />
          {/* ASM Analytics App */}
          <Route path="/asm" element={<ASMDashboard />} />
          <Route path="/asm/objections" element={<ASMObjections />} />
          <Route path="/asm/retailers" element={<ASMAllRetailers />} />
          <Route path="/asm/insights" element={<ASMInsights />} />
          {/* Backwards-compatible aliases */}
          <Route path="/asm-dashboard-new" element={<AsmDashboardNew />} />
          <Route path="/asm/area-snapshot" element={<ASMDashboard />} />
          <Route path="/asm/weekly-snapshot" element={<ASMDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
