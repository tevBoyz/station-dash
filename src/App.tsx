import { Toaster } from "sonner";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import Bookings from "./pages/Bookings";
import Slots from "./pages/Slots";
import Analytics from "./pages/Analytics";
import SystemHealth from "./pages/SystemHealth";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import { useStationStore } from "./lib/store";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useStationStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Overview />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/health" element={<SystemHealth />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
