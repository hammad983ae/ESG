/**
 * Sustaino Pro - ESG Property Assessment Platform - Rent Revision Page
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Professional rent revision system for all property types with industry-specific terminology
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RentRevisionForm } from "@/components/RentRevisionForm";
import { RentRevisionResults } from "@/components/RentRevisionResults";
import { RentRevisionInputs, RentRevisionResults as RentRevisionResultsType, calculateRentRevision } from "@/utils/rentRevisionCalculations";

export default function RentRevision() {
  const [inputs, setInputs] = useState<RentRevisionInputs | null>(null);
  const [results, setResults] = useState<RentRevisionResultsType | null>(null);

  const handleSubmit = (formInputs: RentRevisionInputs) => {
    try {
      const calculatedResults = calculateRentRevision(formInputs);
      setInputs(formInputs);
      setResults(calculatedResults);
      toast.success("Rent revision analysis completed successfully!");
    } catch (error) {
      toast.error(`Rent revision analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = () => {
    setInputs(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">
                Professional Rent Revision
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive rent review system with property-specific terminology and market analysis for all commercial property types
            </p>
          </div>
        </div>

        {/* Main Content */}
        {!results ? (
          <div className="max-w-6xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rent Revision Analysis
                </CardTitle>
                <CardDescription>
                  Professional rent review with industry-specific terminology for all property types including:
                  Childcare (LDC placements), Office (per sqm), Retail (per sqm), Warehouse (per sqm), 
                  Agricultural (per hectare), Hotels (room/key rates), Retirement (per unit), 
                  Petrol Stations (per site), Sports Venues (per seat), Healthcare (per bed/room), 
                  and Residential (per week) properties.
                </CardDescription>
              </CardHeader>
            </Card>
            <RentRevisionForm onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Rent Revision Analysis Complete</h2>
                <p className="text-muted-foreground">
                  Professional analysis for {results.lessee} - {results.property_type.charAt(0).toUpperCase() + results.property_type.slice(1)} Property
                </p>
              </div>
              <Button onClick={handleReset} variant="outline">
                New Analysis
              </Button>
            </div>
            <RentRevisionResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
}