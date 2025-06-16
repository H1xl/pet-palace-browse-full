
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

// Route transition component
const RouteChangeProgress = () => {
  const location = useLocation();
  const [isChangingRoute, setIsChangingRoute] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsChangingRoute(true);
    setProgress(30);

    const timer = setTimeout(() => {
      setProgress(100);
      
      const endTimer = setTimeout(() => {
        setIsChangingRoute(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(endTimer);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isChangingRoute) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <Progress value={progress} className="h-1" />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteChangeProgress />
        <div className="page-transition-enter">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
