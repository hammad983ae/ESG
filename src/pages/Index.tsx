/**
 * Delorenzo Property Group - ESG Property Assessment Platform - Main Dashboard
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Professional sustainability and risk evaluation platform for real estate properties.
 * Provides basic ESG assessment and advanced automated calculations with comprehensive 
 * risk analysis capabilities.
 * 
 * Features:
 * - Environmental, Social, and Governance scoring
 * - Property risk rating and assessment
 * - Climate risk evaluation with customizable thresholds
 * - Financial integration with SEIFA socioeconomic scoring
 * - Export tools for CSV, JSON, and Excel integration
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PropertyAssessmentForm, PropertyData } from "@/components/PropertyAssessmentForm";
import { BeforeAfterValuationForm, BeforeAfterValuationData } from "@/components/BeforeAfterValuationForm";
import { BeforeAfterValuationResults } from "@/components/BeforeAfterValuationResults";
import { ESGDashboard } from "@/components/ESGDashboard";
import { ExportTools } from "@/components/ExportTools"; 
import { AdvancedCalculationsForm, AdvancedPropertyData } from "@/components/AdvancedCalculationsForm";
import { AdvancedDashboard } from "@/components/AdvancedDashboard";
import SpecializedAVMSection from "@/components/SpecializedAVMSection";
import { SearchFunction } from "@/components/SearchFunction";
import { calculateESGScores, ESGScores } from "@/utils/esgCalculations";
import { calculateAdvancedRiskAssessment, AdvancedCalculationResults } from "@/utils/advancedCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Calculator, BarChart3, ArrowLeft, Target, TrendingUp, Shield, ArrowUpDown, Sprout, Building2, Activity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'before-after'>('basic');
  
  // Basic ESG Assessment State
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [esgScores, setESGScores] = useState<ESGScores | null>(null);
  
  // Advanced Assessment State
  const [advancedPropertyData, setAdvancedPropertyData] = useState<AdvancedPropertyData | null>(null);
  const [advancedResults, setAdvancedResults] = useState<AdvancedCalculationResults | null>(null);
  
  // Before & After Valuation State
  const [beforeAfterData, setBeforeAfterData] = useState<BeforeAfterValuationData | null>(null);

  const handleBasicFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    const scores = calculateESGScores(data);
    setESGScores(scores);
    setCurrentStep('results');
  };

  const handleAdvancedFormSubmit = (data: AdvancedPropertyData) => {
    setAdvancedPropertyData(data);
    const results = calculateAdvancedRiskAssessment(data);
    setAdvancedResults(results);
    setCurrentStep('results');
  };

  const handleBeforeAfterFormSubmit = (data: BeforeAfterValuationData) => {
    setBeforeAfterData(data);
    setCurrentStep('results');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleSearchSelection = (item: any) => {
    if (item.route === "/") {
      // Handle internal navigation
      if (item.tab && ['basic', 'advanced', 'before-after'].includes(item.tab)) {
        setActiveTab(item.tab as 'basic' | 'advanced' | 'before-after');
        setCurrentStep('form');
      } else if (item.tab?.includes('avm')) {
        // Scroll to AVM section
        setTimeout(() => {
          const avmSection = document.querySelector('#specialized-avm-section');
          if (avmSection) {
            avmSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // Navigate to external route
      navigate(item.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'form' ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                🌍 First in the World ESG Property Assessment Platform
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Building className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  ESG Property Assessment Platform
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                The world's first comprehensive ESG-integrated property valuation system.
                Professional sustainability and risk evaluation platform for real estate properties. 
                Choose between basic ESG assessment or advanced automated calculations with comprehensive risk analysis.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/client-presentation">
                  <Button size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    📊 Client Presentation
                  </Button>
                </Link>
                <Link to="/valuation">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <TrendingUp className="w-5 h-5" />
                    Valuation Analysis
                  </Button>
                </Link>
                <Link to="/rent-revision">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <ArrowUpDown className="w-5 h-5" />
                    Rent Revision
                  </Button>
                </Link>
                <Link to="/agricultural-hub">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <Sprout className="w-5 h-5" />
                    Agricultural Hub
                  </Button>
                </Link>
                <Link to="/property-hub">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <Building2 className="w-5 h-5" />
                    Property Hub
                  </Button>
                </Link>
                <Link to="/economic-activity">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <Activity className="w-5 h-5" />
                    Economic Activity
                  </Button>
                </Link>
                <Link to="/crop-harvest-simulation">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 touch-manipulation min-h-[44px]">
                    <Sprout className="w-5 h-5" />
                    Crop Game Theory
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search Function */}
            <div className="mb-8">
              <SearchFunction onSelectMethod={handleSearchSelection} />
            </div>

            {/* Assessment Type Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'advanced' | 'before-after')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Basic Assessment
                </TabsTrigger>
                <TabsTrigger value="before-after" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Before & After
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Advanced Calculations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Basic Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <Calculator className="h-5 w-5" />
                        ESG Scoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive Environmental, Social, and Governance assessment 
                        with industry-standard scoring methodology.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-info/10 border-info/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-info">
                        <BarChart3 className="h-5 w-5" />
                        Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Property risk rating incorporating sustainability factors, 
                        property age, and certification status.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Building className="h-5 w-5" />
                        Export Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Export results to CSV, JSON, and Excel templates 
                        for integration with valuation workflows.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <PropertyAssessmentForm onSubmit={handleBasicFormSubmit} />
              </TabsContent>

              <TabsContent value="before-after" className="space-y-6">
                {/* Before & After Features Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <ArrowUpDown className="h-5 w-5" />
                        Value Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Compare property values before and after changes, improvements, 
                        or market conditions with detailed impact analysis.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Calculator className="h-5 w-5" />
                        Change Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Quantify the financial impact of property improvements, 
                        deterioration, or market adjustments with percentage calculations.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <TrendingUp className="h-5 w-5" />
                        Professional Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Generate comprehensive before/after reports with detailed 
                        reasoning and supporting documentation for valuations.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <BeforeAfterValuationForm onSubmit={handleBeforeAfterFormSubmit} />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Advanced Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Target className="h-5 w-5" />
                        Automated Formulas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Advanced calculations using weighted averages, climate risk thresholds, 
                        and normalized scoring systems with Excel-compatible formulas.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Calculator className="h-5 w-5" />
                        Climate Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive climate risk evaluation including flood, bushfire, 
                        cyclone, heatwave, and drought risk with customizable thresholds.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <BarChart3 className="h-5 w-5" />
                        Financial Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        SEIFA socioeconomic scoring, financial risk factors, 
                        and overall 1-5 risk rating for insurance and lending decisions.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <AdvancedCalculationsForm onSubmit={handleAdvancedFormSubmit} />
              </TabsContent>
            </Tabs>

            {/* Specialized AVM Section */}
            <div id="specialized-avm-section" className="mt-12 pt-8 border-t border-border/50">
              <SpecializedAVMSection />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              onClick={handleBackToForm}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment Form
            </Button>

            {/* Results Display */}
            {activeTab === 'basic' && propertyData && esgScores && (
              <>
                <ESGDashboard scores={esgScores} propertyName={propertyData.propertyName} />
                <ExportTools scores={esgScores} propertyData={propertyData} />
              </>
            )}

            {activeTab === 'before-after' && beforeAfterData && (
              <BeforeAfterValuationResults data={beforeAfterData} />
            )}

            {activeTab === 'advanced' && advancedResults && (
              <AdvancedDashboard results={advancedResults} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
