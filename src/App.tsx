import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import CheckerPage from "@/pages/CheckerPage";
import DashboardPage from "@/pages/DashboardPage";
import AuthPage from "@/pages/AuthPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checker" element={<CheckerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<AuthPage mode="login" onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<AuthPage mode="register" onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
