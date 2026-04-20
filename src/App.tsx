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
import Dashboard from "./pages/leadership/Dashboard.tsx";
import AllRetailers from "./pages/leadership/AllRetailers.tsx";
import StrategicSlicing from "./pages/leadership/StrategicSlicing.tsx";
import MEView from "./pages/leadership/MEView.tsx";
import ASMDashboard from "./pages/asm/ASMDashboard.tsx";
import MEsAreaSnapshot from "./pages/asm/MEsAreaSnapshot.tsx";
import MEsWeeklySnapshot from "./pages/asm/MEsWeeklySnapshot.tsx";

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
          <Route path="/leadership" element={<Dashboard />} />
          <Route path="/leadership/all-retailers" element={<AllRetailers />} />
          <Route path="/leadership/me-view" element={<MEView />} />
          {/* Backwards-compatible aliases */}
          <Route path="/leadership/segmentation" element={<AllRetailers />} />
          <Route path="/leadership/dealer-profile" element={<AllRetailers />} />
          <Route path="/leadership/targeting" element={<StrategicSlicing />} />
          {/* ASM Analytics App */}
          <Route path="/asm" element={<ASMDashboard />} />
          <Route path="/asm/area-snapshot" element={<MEsAreaSnapshot />} />
          <Route path="/asm/weekly-snapshot" element={<MEsWeeklySnapshot />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
