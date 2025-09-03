/**
 * Delorenzo Property Group - ESG Property Assessment Platform
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Main application component providing routing and core providers
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ValuationAnalysis from "./pages/ValuationAnalysis";
import RentRevision from "./pages/RentRevision";
import Security from "./pages/Security";
import AgriculturalHub from "./pages/AgriculturalHub";
import PropertyHub from "./pages/PropertyHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/valuation" element={<ValuationAnalysis />} />
          <Route path="/rent-revision" element={<RentRevision />} />
          <Route path="/agricultural-hub" element={<AgriculturalHub />} />
          <Route path="/property-hub" element={<PropertyHub />} />
          <Route path="/security" element={<Security />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
