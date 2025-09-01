/**
 * Delorenzo Property Group - ESG Property Assessment Platform - Valuation Analysis Module
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Comprehensive property valuation analysis including:
 * - All Risks Yield (ARY) calculations
 * - ESG-adjusted ARY with sustainability factors
 * - Capitalization rate sensitivity analysis
 * - Net income approach valuations
 * - Comparable sales analysis with ESG weighting
 * - Direct comparison and summation approaches
 * - Advanced weighted attribute analysis
 * 
 * Integrates with automated CPI updates and market data APIs
 * for professional real estate valuation workflows.
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { useState } from "react";
import { ArrowLeft, Target, TrendingUp, Leaf, Calculator, Settings, Building2, Sliders, Baby, Fuel, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ARYCalculationForm } from "@/components/ARYCalculationForm";
import { ARYResultsDisplay } from "@/components/ARYResults";
import { ESGCalculationForm } from "@/components/ESGCalculationForm";
import { ESGResultsDisplay } from "@/components/ESGResults";
import { CapitalizationSensitivityForm } from "@/components/CapitalizationSensitivityForm";
import { CapitalizationSensitivityResultsDisplay } from "@/components/CapitalizationSensitivityResults";
import { CapitalizationNetIncomeForm } from "@/components/CapitalizationNetIncomeForm";
import { CapitalizationNetIncomeResultsDisplay } from "@/components/CapitalizationNetIncomeResults";
import { ESGAdjustedCapitalizationForm } from "@/components/ESGAdjustedCapitalizationForm";
import { ESGAdjustedCapitalizationResultsDisplay } from "@/components/ESGAdjustedCapitalizationResults";
import { ESGComparableSalesForm } from "@/components/ESGComparableSalesForm";
import { ESGComparableSalesResultsDisplay } from "@/components/ESGComparableSalesResults";
import { ESGFactorsWeightingPanel } from "@/components/ESGFactorsWeightingPanel";
import { ESGVariableControlPanel } from "@/components/ESGVariableControlPanel";
import { ESGCapRateImpactCalculator } from "@/components/ESGCapRateImpactCalculator";
import { SimpleCapNetIncomeForm } from "@/components/SimpleCapNetIncomeForm";
import { SimpleCapNetIncomeResultsDisplay } from "@/components/SimpleCapNetIncomeResults";
import { ValuationSummationForm } from "@/components/ValuationSummationForm";
import { ValuationDirectComparisonForm } from "@/components/ValuationDirectComparisonForm";
import { HypotheticalDevelopmentForm } from "@/components/HypotheticalDevelopmentForm";
import { HypotheticalDevelopmentResults } from "@/components/HypotheticalDevelopmentResults";
import { SummationApproachForm } from "@/components/SummationApproachForm";
import { SummationApproachResults } from "@/components/SummationApproachResults";
import { HospitalityValuationForm } from "@/components/HospitalityValuationForm";
import { HospitalityValuationResults } from "@/components/HospitalityValuationResults";
import { ChildcareValuationForm } from "@/components/ChildcareValuationForm";
import { ChildcareValuationResults } from "@/components/ChildcareValuationResults";
import { ComprehensiveESGAssessmentForm } from "@/components/ComprehensiveESGAssessmentForm";
import { ComprehensiveESGAssessmentResults } from "@/components/ComprehensiveESGAssessmentResults";
import { PetrolStationValuationForm } from "@/components/PetrolStationValuationForm";
import { PetrolStationValuationResults } from "@/components/PetrolStationValuationResults";
import { DeferredManagementValuationForm } from "@/components/DeferredManagementValuationForm";
import { DeferredManagementValuationResults } from "@/components/DeferredManagementValuationResults";
import { DCFCalculationForm } from "@/components/DCFCalculationForm";
import { DCFCalculationResults } from "@/components/DCFCalculationResults";
import { ARYInputs, ARYResults, calculateAllRisksYield } from "@/utils/aryCalculations";
import { 
  ESGInputs, 
  ESGResults, 
  CapitalizationSensitivityInputs, 
  CapitalizationSensitivityResults,
  calculateESGAdjustedARY,
  calculateCapitalizationRateSensitivity
} from "@/utils/esgCalculations";
import { 
  CapitalizationNetIncomeInputs, 
  CapitalizationNetIncomeResults,
  ESGAdjustedCapitalizationInputs,
  calculateCapitalisationRateSensitivity
} from "@/utils/advancedCalculations";
import {
  ESGWeightedSalesInputs,
  ESGWeightedSalesResults,
  calculateESGWeightedComparableSales
} from "@/utils/comparableSalesCalculations";
import {
  HypotheticalDevelopmentParams,
  HypotheticalDevelopmentResult,
  performConventionalValuation,
  performESDValuation
} from "@/utils/hypotheticalDevelopmentCalculations";
import {
  SummationInputs,
  SummationResults,
  calculateSummationValue
} from "@/utils/summationCalculations";
import {
  HospitalityInputs,
  HospitalityResults,
  calculateHospitalityValuation
} from "@/utils/hospitalityCalculations";
import {
  ChildcareInputs,
  ChildcareResults,
  calculateChildcareValuation
} from "@/utils/childcareCalculations";
import {
  ComprehensiveESGInputs,
  ComprehensiveESGResults,
  calculateComprehensiveESG
} from "@/utils/comprehensiveESGCalculations";
import {
  PetrolStationInputs,
  PetrolStationResults,
  calculatePetrolStationValuation
} from "@/utils/petrolStationCalculations";
import {
  DeferredManagementInputs,
  DeferredManagementResults,
  calculateDeferredManagementValuation
} from "@/utils/deferredManagementCalculations";
import {
  StadiumInputs,
  StadiumResults,
  calculateStadiumValuation
} from "@/utils/stadiumCalculations";
import { StadiumValuationForm } from "@/components/StadiumValuationForm";
import { StadiumValuationResults } from "@/components/StadiumValuationResults";

export default function ValuationAnalysis() {
  // ARY States
  const [aryInputs, setARYInputs] = useState<ARYInputs | null>(null);
  const [aryResults, setARYResults] = useState<ARYResults | null>(null);
  
  // ESG States
  const [esgInputs, setESGInputs] = useState<ESGInputs | null>(null);
  const [esgResults, setESGResults] = useState<ESGResults | null>(null);
  
  // Capitalization Sensitivity States
  const [capInputs, setCapInputs] = useState<CapitalizationSensitivityInputs | null>(null);
  const [capResults, setCapResults] = useState<CapitalizationSensitivityResults | null>(null);
  
  // Capitalization Net Income States
  const [netIncomeInputs, setNetIncomeInputs] = useState<CapitalizationNetIncomeInputs | null>(null);
  const [netIncomeResults, setNetIncomeResults] = useState<CapitalizationNetIncomeResults | null>(null);
  
  // ESG-Adjusted Capitalization States
  const [esgCapInputs, setEsgCapInputs] = useState<ESGAdjustedCapitalizationInputs | null>(null);
  const [esgCapResults, setEsgCapResults] = useState<CapitalizationNetIncomeResults | null>(null);
  
  // ESG Comparable Sales States
  const [esgSalesInputs, setEsgSalesInputs] = useState<ESGWeightedSalesInputs | null>(null);
  const [esgSalesResults, setEsgSalesResults] = useState<ESGWeightedSalesResults | null>(null);
  
  // Cap Net Income States
  const [capNetIncomeInputs, setCapNetIncomeInputs] = useState<any>(null);
  const [capNetIncomeResults, setCapNetIncomeResults] = useState<any>(null);
  
  // Summation Approach States
  const [summationInputs, setSummationInputs] = useState<SummationInputs | null>(null);
  const [summationResults, setSummationResults] = useState<SummationResults | null>(null);
  
  // Direct Comparison States
  const [directCompInputs, setDirectCompInputs] = useState<any>(null);
  const [directCompResults, setDirectCompResults] = useState<any>(null);

  // Hypothetical Development States
  const [hypotheticalInputs, setHypotheticalInputs] = useState<HypotheticalDevelopmentParams | null>(null);
  const [hypotheticalResults, setHypotheticalResults] = useState<HypotheticalDevelopmentResult | null>(null);
  const [hypotheticalApproach, setHypotheticalApproach] = useState<'conventional' | 'esd'>('conventional');

  // Hospitality Valuation States
  const [hospitalityInputs, setHospitalityInputs] = useState<HospitalityInputs | null>(null);
  const [hospitalityResults, setHospitalityResults] = useState<HospitalityResults | null>(null);

  // Childcare Valuation States
  const [childcareInputs, setChildcareInputs] = useState<ChildcareInputs | null>(null);
  const [childcareResults, setChildcareResults] = useState<ChildcareResults | null>(null);

  // Comprehensive ESG Assessment States
  const [comprehensiveESGInputs, setComprehensiveESGInputs] = useState<ComprehensiveESGInputs | null>(null);
  const [comprehensiveESGResults, setComprehensiveESGResults] = useState<ComprehensiveESGResults | null>(null);

  // Petrol Station Valuation States
  const [petrolStationInputs, setPetrolStationInputs] = useState<PetrolStationInputs | null>(null);
  const [petrolStationResults, setPetrolStationResults] = useState<PetrolStationResults | null>(null);

  // Deferred Management Valuation States
  const [deferredManagementInputs, setDeferredManagementInputs] = useState<DeferredManagementInputs | null>(null);
  const [deferredManagementResults, setDeferredManagementResults] = useState<DeferredManagementResults | null>(null);
  
  // DCF Analysis States
  const [dcfInputs, setDcfInputs] = useState<any>(null);
  const [dcfResults, setDcfResults] = useState<any>(null);
  
  // Stadium Valuation States
  const [stadiumInputs, setStadiumInputs] = useState<StadiumInputs | null>(null);
  const [stadiumResults, setStadiumResults] = useState<StadiumResults | null>(null);

  const handleARYSubmit = (inputs: ARYInputs) => {
    try {
      const calculatedResults = calculateAllRisksYield(inputs);
      setARYInputs(inputs);
      setARYResults(calculatedResults);
      toast.success("ARY calculation completed successfully!");
    } catch (error) {
      toast.error(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleESGSubmit = (inputs: ESGInputs) => {
    try {
      const calculatedResults = calculateESGAdjustedARY(inputs);
      setESGInputs(inputs);
      setESGResults(calculatedResults);
      toast.success("ESG-adjusted ARY calculated successfully!");
    } catch (error) {
      toast.error(`ESG calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCapitalizationSubmit = (inputs: CapitalizationSensitivityInputs) => {
    try {
      const calculatedResults = calculateCapitalizationRateSensitivity(inputs);
      setCapInputs(inputs);
      setCapResults(calculatedResults);
      toast.success("Capitalization sensitivity analysis completed!");
    } catch (error) {
      toast.error(`Capitalization analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleNetIncomeSubmit = (inputs: CapitalizationNetIncomeInputs) => {
    try {
      const calculatedResults = calculateCapitalisationRateSensitivity(inputs);
      setNetIncomeInputs(inputs);
      setNetIncomeResults(calculatedResults);
      toast.success("Net income capitalization analysis completed!");
    } catch (error) {
      toast.error(`Net income analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleESGCapitalizationSubmit = (inputs: ESGAdjustedCapitalizationInputs) => {
    try {
      const calculatedResults = calculateCapitalisationRateSensitivity(inputs);
      setEsgCapInputs(inputs);
      setEsgCapResults(calculatedResults);
      toast.success("ESG-adjusted capitalization analysis completed!");
    } catch (error) {
      toast.error(`ESG capitalization analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleESGComparableSalesSubmit = (inputs: ESGWeightedSalesInputs) => {
    try {
      const calculatedResults = calculateESGWeightedComparableSales(inputs);
      setEsgSalesInputs(inputs);
      setEsgSalesResults(calculatedResults);
      toast.success("ESG comparable sales analysis completed!");
    } catch (error) {
      toast.error(`ESG comparable sales analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = (tab: string) => {
    switch (tab) {
      case 'ary':
        setARYInputs(null);
        setARYResults(null);
        break;
      case 'esg':
        setESGInputs(null);
        setESGResults(null);
        break;
      case 'capitalization':
        setCapInputs(null);
        setCapResults(null);
        break;
      case 'netincome':
        setNetIncomeInputs(null);
        setNetIncomeResults(null);
        break;
      case 'esgcapitalization':
        setEsgCapInputs(null);
        setEsgCapResults(null);
        break;
      case 'esgcomparablesales':
        setEsgSalesInputs(null);
        setEsgSalesResults(null);
        break;
      case 'capnetincome':
        setCapNetIncomeInputs(null);
        setCapNetIncomeResults(null);
        break;
      case 'summation':
        setSummationInputs(null);
        setSummationResults(null);
        break;
      case 'directcomparison':
        setDirectCompInputs(null);
        setDirectCompResults(null);
        break;
      case 'hypotheticaldevelopment':
        setHypotheticalInputs(null);
        setHypotheticalResults(null);
        setHypotheticalApproach('conventional');
        break;
      case 'hospitality':
        setHospitalityInputs(null);
        setHospitalityResults(null);
        break;
      case 'childcare':
        setChildcareInputs(null);
        setChildcareResults(null);
        break;
      case 'comprehensive-esg':
        setComprehensiveESGInputs(null);
        setComprehensiveESGResults(null);
        break;
      case 'petrol-station':
        setPetrolStationInputs(null);
        setPetrolStationResults(null);
        break;
      case 'deferred-management':
        setDeferredManagementInputs(null);
        setDeferredManagementResults(null);
        break;
      case 'stadium':
        setStadiumInputs(null);
        setStadiumResults(null);
        break;
    }
  };

  const handleCapNetIncomeSubmit = (inputs: any) => {
    try {
      // Calculate market value using basic cap rate approach
      const marketValue = inputs.noi / (inputs.capitalizationRate / 100);
      const results = {
        marketValue,
        marketValueRounded: Math.round(marketValue),
        adjustedRiskPremium: inputs.riskPremium,
        adjustedCapRate: inputs.capitalizationRate,
      };
      setCapNetIncomeInputs(inputs);
      setCapNetIncomeResults(results);
      toast.success("Capitalisation of Net Income analysis completed!");
    } catch (error) {
      toast.error(`Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSummationSubmit = (inputs: SummationInputs) => {
    try {
      const calculatedResults = calculateSummationValue(inputs.components, inputs.esg_factor);
      setSummationInputs(inputs);
      setSummationResults(calculatedResults);
      toast.success("Summation valuation analysis completed!");
    } catch (error) {
      toast.error(`Summation analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDirectComparisonSubmit = (inputs: any) => {
    try {
      setDirectCompInputs(inputs);
      setDirectCompResults(inputs);
      toast.success("Direct comparison valuation completed!");
    } catch (error) {
      toast.error(`Direct comparison analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleHypotheticalDevelopmentSubmit = (params: HypotheticalDevelopmentParams, approach: 'conventional' | 'esd') => {
    try {
      const calculatedResults = approach === 'esd' 
        ? performESDValuation(params) 
        : performConventionalValuation(params);
      setHypotheticalInputs(params);
      setHypotheticalResults(calculatedResults);
      setHypotheticalApproach(approach);
      toast.success(`${approach === 'esd' ? 'ESD' : 'Conventional'} development valuation completed!`);
    } catch (error) {
      toast.error(`Hypothetical development analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleHospitalityValuationSubmit = (inputs: HospitalityInputs) => {
    try {
      const calculatedResults = calculateHospitalityValuation(inputs);
      setHospitalityInputs(inputs);
      setHospitalityResults(calculatedResults);
      toast.success("Hospitality valuation completed successfully!");
    } catch (error) {
      toast.error(`Hospitality valuation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChildcareValuationSubmit = (inputs: ChildcareInputs) => {
    try {
      const calculatedResults = calculateChildcareValuation(inputs);
      setChildcareInputs(inputs);
      setChildcareResults(calculatedResults);
      toast.success("Childcare valuation completed successfully!");
    } catch (error) {
      toast.error(`Childcare valuation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleComprehensiveESGSubmit = (inputs: ComprehensiveESGInputs) => {
    try {
      const calculatedResults = calculateComprehensiveESG(inputs);
      setComprehensiveESGInputs(inputs);
      setComprehensiveESGResults(calculatedResults);
      toast.success("Comprehensive ESG assessment completed successfully!");
    } catch (error) {
      toast.error(`ESG assessment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePetrolStationValuationSubmit = (inputs: PetrolStationInputs) => {
    try {
      const calculatedResults = calculatePetrolStationValuation(inputs);
      setPetrolStationInputs(inputs);
      setPetrolStationResults(calculatedResults);
      toast.success("Petrol station valuation completed successfully!");
    } catch (error) {
      toast.error(`Petrol station valuation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeferredManagementValuationSubmit = (inputs: DeferredManagementInputs) => {
    try {
      const calculatedResults = calculateDeferredManagementValuation(inputs);
      setDeferredManagementInputs(inputs);
      setDeferredManagementResults(calculatedResults);
      toast.success("Deferred management valuation completed successfully!");
    } catch (error) {
      toast.error(`Deferred management valuation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStadiumSubmit = (inputs: StadiumInputs) => {
    try {
      const calculatedResults = calculateStadiumValuation(inputs);
      setStadiumInputs(inputs);
      setStadiumResults(calculatedResults);
      toast.success("Stadium valuation completed successfully!");
    } catch (error) {
      toast.error(`Stadium valuation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDCFSubmit = (inputs: any) => {
    try {
      // Create basic DCF calculation results
      const calculatedResults = {
        netPresentValue: inputs.cashFlows.reduce((sum: number, cf: number, i: number) => 
          sum + cf / Math.pow(1 + inputs.discountRate, i + 1), 0) - inputs.initialInvestment,
        irr: inputs.discountRate + 0.02, // Simple approximation
        profitabilityIndex: 1.2,
        paybackPeriod: 3.5
      };
      setDcfInputs(inputs);
      setDcfResults(calculatedResults);
      toast.success("DCF analysis completed successfully!");
    } catch (error) {
      toast.error(`DCF analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Target className="w-8 h-8" />
                Valuation Analysis
              </h1>
              <p className="text-muted-foreground">
                World's first comprehensive property valuation with ARY, ESG, and capitalization rate analysis
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="ary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 h-auto p-2">
            <TabsTrigger value="ary" className="flex items-center gap-2 p-3">
              <Target className="w-4 h-4" />
              All Risks Yield
            </TabsTrigger>
            <TabsTrigger value="esg" className="flex items-center gap-2 p-3">
              <Leaf className="w-4 h-4" />
              ESG-Adjusted ARY
            </TabsTrigger>
            <TabsTrigger value="capitalization" className="flex items-center gap-2 p-3">
              <Calculator className="w-4 h-4" />
              Cap Rate Sensitivity
            </TabsTrigger>
            <TabsTrigger value="netincome" className="flex items-center gap-2 p-3">
              <TrendingUp className="w-4 h-4" />
              Net Income Approach
            </TabsTrigger>
            <TabsTrigger value="esgcapitalization" className="flex items-center gap-2 p-3">
              <Settings className="w-4 h-4" />
              ESG Cap Analysis
            </TabsTrigger>
            <TabsTrigger value="esgcomparablesales" className="flex items-center gap-2 p-3">
              <Building2 className="w-4 h-4" />
              ESG Comparable Sales
            </TabsTrigger>
            <TabsTrigger value="esgweighting" className="flex items-center gap-2 p-3">
              <Sliders className="w-4 h-4" />
              ESG Factors Weighting
            </TabsTrigger>
            <TabsTrigger value="capnetincome" className="flex items-center gap-2 p-3">
              <Calculator className="w-4 h-4" />
              Cap Net Income
            </TabsTrigger>
            <TabsTrigger value="esgvariablecontrol" className="flex items-center gap-2 p-3">
              <Settings className="w-4 h-4" />
              ESG Variable Control
            </TabsTrigger>
            <TabsTrigger value="esgcaprateimpact" className="flex items-center gap-2 p-3">
              <Calculator className="w-4 h-4" />
              ESG Cap Rate Impact
            </TabsTrigger>
            <TabsTrigger value="summation" className="flex items-center gap-2 p-3">
              <Building2 className="w-4 h-4" />
              Summation Approach
            </TabsTrigger>
            <TabsTrigger value="directcomparison" className="flex items-center gap-2 p-3">
              <TrendingUp className="w-4 h-4" />
              Direct Comparison
            </TabsTrigger>
            <TabsTrigger value="hypotheticaldevelopment" className="flex items-center gap-2 p-3">
              <Building2 className="w-4 h-4" />
              Hypothetical Development
            </TabsTrigger>
            <TabsTrigger value="hospitality" className="flex items-center gap-2 p-3">
              <Building2 className="w-4 h-4" />
              Hospitality & Commercial
            </TabsTrigger>
            <TabsTrigger value="childcare" className="flex items-center gap-2 p-3">
              <Baby className="w-4 h-4" />
              Childcare Facilities
            </TabsTrigger>
            <TabsTrigger value="comprehensive-esg" className="flex items-center gap-2 p-3">
              <Leaf className="w-4 h-4" />
              Comprehensive ESG
            </TabsTrigger>
            <TabsTrigger value="petrol-station" className="flex items-center gap-2 p-3">
              <Fuel className="w-4 h-4" />
              Petrol Stations
            </TabsTrigger>
            <TabsTrigger value="deferred-management" className="flex items-center gap-2 p-3">
              <Users className="w-4 h-4" />
              Deferred Management
            </TabsTrigger>
            <TabsTrigger value="dcf" className="flex items-center gap-2 p-3">
              <TrendingUp className="w-4 h-4" />
              DCF Analysis
            </TabsTrigger>
            <TabsTrigger value="stadium" className="flex items-center gap-2 p-3">
              <Building2 className="w-4 h-4" />
              Sports Stadium
            </TabsTrigger>
          </TabsList>

          {/* ARY Analysis Tab */}
          <TabsContent value="ary" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">All Risks Yield Analysis</h2>
                <p className="text-muted-foreground">
                  Calculate ARY using dynamic risk-free rate and comprehensive risk assessment
                </p>
              </div>
              {aryResults && (
                <Button onClick={() => handleReset('ary')} variant="outline">
                  New Calculation
                </Button>
              )}
            </div>

            {!aryResults ? (
              <div className="max-w-4xl mx-auto">
                <ARYCalculationForm onSubmit={handleARYSubmit} />
              </div>
            ) : (
              <ARYResultsDisplay results={aryResults} inputs={aryInputs!} />
            )}
          </TabsContent>

          {/* ESG Analysis Tab */}
          <TabsContent value="esg" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG-Adjusted All Risks Yield</h2>
                <p className="text-muted-foreground">
                  Calculate ARY with environmental, social, and governance risk adjustments
                </p>
              </div>
              {esgResults && (
                <Button onClick={() => handleReset('esg')} variant="outline">
                  New Calculation
                </Button>
              )}
            </div>

            {!esgResults ? (
              <div className="max-w-4xl mx-auto">
                <ESGCalculationForm onSubmit={handleESGSubmit} />
              </div>
            ) : (
              <ESGResultsDisplay results={esgResults} inputs={esgInputs!} />
            )}
          </TabsContent>

          {/* Capitalization Rate Sensitivity Tab */}
          <TabsContent value="capitalization" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Capitalization Rate Sensitivity Analysis</h2>
                <p className="text-muted-foreground">
                  Analyze property valuation sensitivity with optional ESG-adjusted capitalization rates
                </p>
              </div>
              {capResults && (
                <Button onClick={() => handleReset('capitalization')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!capResults ? (
              <div className="max-w-4xl mx-auto">
                <CapitalizationSensitivityForm onSubmit={handleCapitalizationSubmit} />
              </div>
            ) : (
              <CapitalizationSensitivityResultsDisplay results={capResults} inputs={capInputs!} />
            )}
          </TabsContent>

          {/* Capitalization of Net Income Approach Tab */}
          <TabsContent value="netincome" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Capitalization of Net Income Approach</h2>
                <p className="text-muted-foreground">
                  Comprehensive property valuation using income capitalization with scenario analysis
                </p>
              </div>
              {netIncomeResults && (
                <Button onClick={() => handleReset('netincome')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!netIncomeResults ? (
              <div className="max-w-4xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      About Net Income Capitalization
                    </CardTitle>
                    <CardDescription>
                      This approach values property by capitalizing its net operating income using various capitalization rates. 
                      It provides sensitivity analysis across optimistic, realistic, and pessimistic market scenarios.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <CapitalizationNetIncomeForm onSubmit={handleNetIncomeSubmit} />
              </div>
            ) : (
              <CapitalizationNetIncomeResultsDisplay results={netIncomeResults} inputs={netIncomeInputs!} />
            )}
          </TabsContent>

          {/* ESG-Adjusted Capitalization Analysis Tab */}
          <TabsContent value="esgcapitalization" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG-Adjusted Capitalization Analysis</h2>
                <p className="text-muted-foreground">
                  Enhanced capitalization sensitivity analysis with optional ESG risk factor adjustments
                </p>
              </div>
              {esgCapResults && (
                <Button onClick={() => handleReset('esgcapitalization')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!esgCapResults ? (
              <div className="max-w-4xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      ESG-Enhanced Capitalization Analysis
                    </CardTitle>
                    <CardDescription>
                      This analysis extends the traditional capitalization approach by allowing you to apply ESG risk adjustments 
                      to the capitalization rates. ESG factors can either increase or decrease required returns based on 
                      environmental, social, and governance considerations.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <ESGAdjustedCapitalizationForm onSubmit={handleESGCapitalizationSubmit} />
              </div>
            ) : (
              <ESGAdjustedCapitalizationResultsDisplay results={esgCapResults} inputs={esgCapInputs!} />
            )}
          </TabsContent>

          {/* ESG Comparable Sales Analysis Tab */}
          <TabsContent value="esgcomparablesales" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG-Weighted Comparable Sales Assessment</h2>
                <p className="text-muted-foreground">
                  Enhanced sales comparison approach incorporating ESG factors and sustainability-weighted adjustments
                </p>
              </div>
              {esgSalesResults && (
                <Button onClick={() => handleReset('esgcomparablesales')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!esgSalesResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      ESG-Enhanced Sales Comparison Analysis
                    </CardTitle>
                    <CardDescription>
                      This advanced valuation method extends traditional sales comparison by quantitatively incorporating 
                      Environmental, Social, and Governance (ESG) factors. Properties with stronger sustainability profiles 
                      receive higher weighting in the analysis, reflecting market premiums for ESG-compliant assets.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <ESGComparableSalesForm onSubmit={handleESGComparableSalesSubmit} />
              </div>
            ) : (
              <ESGComparableSalesResultsDisplay results={esgSalesResults} inputs={esgSalesInputs!} />
            )}
          </TabsContent>

          {/* ESG Factors Weighting Tab */}
          <TabsContent value="esgweighting" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG Factors Weighting</h2>
                <p className="text-muted-foreground">
                  Compare and adjust ESG variables with real-time risk score calculation
                </p>
              </div>
            </div>
            <ESGFactorsWeightingPanel />
          </TabsContent>

          {/* Cap Net Income Tab */}
          <TabsContent value="capnetincome" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Capitalisation of Net Income Approach</h2>
                <p className="text-muted-foreground">
                  Calculate market value by dividing net income (NOI) by the Capitalisation Rate with risk premium adjustments
                </p>
              </div>
              {capNetIncomeResults && (
                <Button onClick={() => handleReset('capnetincome')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!capNetIncomeResults ? (
              <div className="max-w-4xl mx-auto">
                <SimpleCapNetIncomeForm onSubmit={handleCapNetIncomeSubmit} />
              </div>
            ) : (
              <SimpleCapNetIncomeResultsDisplay results={capNetIncomeResults} inputs={capNetIncomeInputs!} />
            )}
          </TabsContent>

          {/* ESG Variable Control Tab */}
          <TabsContent value="esgvariablecontrol" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG Variable Control</h2>
                <p className="text-muted-foreground">
                  Adjust ESG variables with real-time impact on risk premium and capitalisation rates
                </p>
              </div>
            </div>
            <ESGVariableControlPanel />
          </TabsContent>

          {/* ESG Cap Rate Impact Tab */}
          <TabsContent value="esgcaprateimpact" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">ESG Cap Rate Impact Calculator</h2>
                <p className="text-muted-foreground">
                  Interactive analysis of how ESG factors influence capitalization rates with real-time visual feedback
                </p>
              </div>
            </div>
            <ESGCapRateImpactCalculator />
          </TabsContent>

          {/* Summation Approach Tab */}
          <TabsContent value="summation" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Valuation Summation Approach</h2>
                <p className="text-muted-foreground">
                  Automated summation valuation with sustainability factor adjustments for individual asset types
                </p>
              </div>
              {summationResults && (
                <Button onClick={() => handleReset('summation')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!summationResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      About Summation Approach
                    </CardTitle>
                    <CardDescription>
                      The summation approach calculates property value by adding the individual values of all property 
                      components (land, buildings, improvements, etc.) based on their respective areas and rates. 
                      An ESG factor can be applied to adjust the final value based on sustainability considerations.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <SummationApproachForm onSubmit={handleSummationSubmit} />
              </div>
            ) : (
              <SummationApproachResults 
                results={summationResults} 
                onNewCalculation={() => handleReset('summation')} 
              />
            )}
          </TabsContent>

          {/* Direct Comparison Approach Tab */}
          <TabsContent value="directcomparison" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Valuation Direct Comparison Approach</h2>
                <p className="text-muted-foreground">
                  Automated comparable sales analysis with flexible asset type selection and adjustment factors
                </p>
              </div>
              {directCompResults && (
                <Button onClick={() => handleReset('directcomparison')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!directCompResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      About Direct Comparison Approach
                    </CardTitle>
                    <CardDescription>
                      The direct comparison approach determines property value by analyzing recent sales of similar properties, 
                      with adjustments made for differences in location, condition, size, timing, and sustainability factors.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <ValuationDirectComparisonForm onSubmit={handleDirectComparisonSubmit} />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Direct Comparison Valuation Results</CardTitle>
                  <CardDescription>
                    Based on {directCompResults.valuation?.comparablesCount} comparable sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label>Subject Property</Label>
                      <div className="font-semibold">{directCompResults.subjectProperty?.name}</div>
                      <div className="text-sm text-muted-foreground">{directCompResults.subjectProperty?.location}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Average Price per sqm</Label>
                      <div className="text-xl font-bold">
                        ${directCompResults.valuation?.averagePricePerSqm?.toFixed(0)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Value</Label>
                      <div className="text-2xl font-bold text-primary">
                        ${directCompResults.valuation?.estimatedValue?.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Value Range</Label>
                      <div className="text-sm">
                        ${directCompResults.valuation?.valueRange?.low?.toLocaleString()} - ${directCompResults.valuation?.valueRange?.high?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comparable Sales</h3>
                    {directCompResults.comparables?.map((comp: any, index: number) => (
                      <Card key={comp.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Property</Label>
                            <div className="font-medium">{comp.property}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Location</Label>
                            <div>{comp.location}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Sale Date</Label>
                            <div>{comp.saleDate}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Sale Price</Label>
                            <div>${comp.price?.toLocaleString()}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Price per sqm</Label>
                            <div>${comp.pricePerSqm?.toFixed(0)}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Adjusted Price</Label>
                            <div className="font-semibold">${comp.adjustedPrice?.toLocaleString()}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Hypothetical Development Approach Tab */}
          <TabsContent value="hypotheticaldevelopment" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Hypothetical Development Approach</h2>
                <p className="text-muted-foreground">
                  Calculate residual land value based on development feasibility with comprehensive cost analysis
                </p>
              </div>
              {hypotheticalResults && (
                <Button onClick={() => handleReset('hypotheticaldevelopment')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!hypotheticalResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      About Hypothetical Development Approach
                    </CardTitle>
                    <CardDescription>
                      This valuation method determines land value by analyzing what a developer would pay for the site, 
                      considering the completed development's value minus all development costs and required profit margins. 
                      It's particularly useful for development sites and investment analysis.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <HypotheticalDevelopmentForm onSubmit={handleHypotheticalDevelopmentSubmit} />
              </div>
            ) : (
              <HypotheticalDevelopmentResults 
                results={hypotheticalResults} 
                approach={hypotheticalApproach}
                onNewCalculation={() => handleReset('hypotheticaldevelopment')} 
              />
            )}
          </TabsContent>

          {/* Hospitality & Commercial Valuation Tab */}
          <TabsContent value="hospitality" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Hospitality & Commercial Valuation</h2>
                <p className="text-muted-foreground">
                  Comprehensive valuation using five specialized approaches for hospitality and commercial properties
                </p>
              </div>
              {hospitalityResults && (
                <Button onClick={() => handleReset('hospitality')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!hospitalityResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Hospitality & Commercial Property Valuation Methods
                    </CardTitle>
                    <CardDescription>
                      This comprehensive analysis includes five specialized valuation approaches designed for hospitality 
                      and commercial properties: Income Approach, Gross Income Multiplier (GIM), Per Unit Valuation, 
                      Revenue Multiplier, and Replacement Cost Method. Each method can be adjusted with ESG factors 
                      to reflect sustainability premiums or discounts.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <HospitalityValuationForm onSubmit={handleHospitalityValuationSubmit} />
              </div>
            ) : (
              <HospitalityValuationResults results={hospitalityResults} />
            )}
          </TabsContent>

          {/* Childcare Facilities Valuation Tab */}
          <TabsContent value="childcare" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Childcare Facilities Valuation</h2>
                <p className="text-muted-foreground">
                  Specialized valuation approaches for childcare properties including LCD, comparison, and rent-based methods
                </p>
              </div>
              {childcareResults && (
                <Button onClick={() => handleReset('childcare')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!childcareResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Baby className="w-5 h-5" />
                      Childcare Property Valuation Methods
                    </CardTitle>
                    <CardDescription>
                      This analysis includes specialized approaches for childcare facilities: Land, Construction & Development (LCD), 
                      Direct Comparison using comparable sales, and Rent-based valuations. ESG factors can be applied to reflect 
                      sustainability premiums for green childcare facilities.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <ChildcareValuationForm onSubmit={handleChildcareValuationSubmit} />
              </div>
            ) : (
              <ChildcareValuationResults results={childcareResults} />
            )}
          </TabsContent>

          {/* Comprehensive ESG Assessment Tab */}
          <TabsContent value="comprehensive-esg" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Comprehensive ESG Assessment</h2>
                <p className="text-muted-foreground">
                  Complete Environmental, Social, and Governance evaluation with automated scoring and valuation impact analysis
                </p>
              </div>
              {comprehensiveESGResults && (
                <Button onClick={() => handleReset('comprehensive-esg')} variant="outline">
                  New Assessment
                </Button>
              )}
            </div>

            {!comprehensiveESGResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Professional ESG Factors Checklist & Scoring
                    </CardTitle>
                    <CardDescription>
                      This comprehensive assessment evaluates 13 key ESG factors across Environmental (5), Social (4), 
                      and Governance (4) categories. Each factor is scored and weighted to generate an overall ESG score 
                      and calculate the impact on property valuation. The system provides automated recommendations and 
                      exportable reports for stakeholder communication.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <ComprehensiveESGAssessmentForm onSubmit={handleComprehensiveESGSubmit} />
              </div>
            ) : (
              <ComprehensiveESGAssessmentResults results={comprehensiveESGResults} />
            )}
          </TabsContent>

          {/* Petrol Station Valuation Tab */}
          <TabsContent value="petrol-station" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Petrol Station Valuation</h2>
                <p className="text-muted-foreground">
                  Comprehensive valuation using six specialized methods for petrol stations and fuel retail properties
                </p>
              </div>
              {petrolStationResults && (
                <Button onClick={() => handleReset('petrol-station')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!petrolStationResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fuel className="w-5 h-5" />
                      Petrol Station Valuation Methods
                    </CardTitle>
                    <CardDescription>
                      This comprehensive analysis includes six valuation approaches specifically designed for petrol stations: 
                      Income Method (NOI/Cap Rate), Sales Comparison, Land/Asset Value, Replacement Cost (Insurance), 
                      Rent Approach, and Industry Multiplier Method. Each method incorporates ESG sustainability factors 
                      and provides detailed analysis of value per pump and building efficiency metrics.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <PetrolStationValuationForm onSubmit={handlePetrolStationValuationSubmit} />
              </div>
            ) : (
              <PetrolStationValuationResults results={petrolStationResults} />
            )}
          </TabsContent>

          {/* Deferred Management Valuation Tab */}
          <TabsContent value="deferred-management" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Deferred Management Valuation - Retirement Villages</h2>
                <p className="text-muted-foreground">
                  Specialized valuation for retirement village management rights with deferred cash flow analysis and present value calculations
                </p>
              </div>
              {deferredManagementResults && (
                <Button onClick={() => handleReset('deferred-management')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!deferredManagementResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Retirement Village Management Rights Valuation
                    </CardTitle>
                    <CardDescription>
                      This specialized methodology calculates the present value of deferred management income for retirement villages. 
                      It considers deferral periods, turnover rates, occupancy levels, and deferred management fee structures 
                      to provide comprehensive valuation analysis including NPV, IRR, and sensitivity testing for investment decisions.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <DeferredManagementValuationForm onSubmit={handleDeferredManagementValuationSubmit} />
              </div>
            ) : (
              <DeferredManagementValuationResults inputs={deferredManagementInputs!} results={deferredManagementResults} />
            )}
          </TabsContent>
          
          {/* DCF Analysis Tab */}
          <TabsContent value="dcf" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Discounted Cash Flow (DCF) Analysis</h2>
                <p className="text-muted-foreground">
                  Comprehensive DCF valuation with NPV, IRR, profitability index, and payback period analysis
                </p>
              </div>
              {dcfResults && (
                <Button onClick={() => handleReset('dcf')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!dcfResults ? (
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      DCF Investment Analysis
                    </CardTitle>
                    <CardDescription>
                      This comprehensive DCF analysis calculates Net Present Value (NPV), Internal Rate of Return (IRR), 
                      profitability index, and payback periods to provide complete investment decision metrics. 
                      Includes ESG adjustment options, terminal value calculations, and sensitivity analysis 
                      for property investment evaluation and decision-making.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <DCFCalculationForm onSubmit={handleDCFSubmit} />
              </div>
            ) : (
              <DCFCalculationResults data={dcfInputs!} results={dcfResults} />
            )}
          </TabsContent>
          
          {/* Stadium Valuation Tab */}
          <TabsContent value="stadium" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Sports Stadium Valuation</h2>
                <p className="text-muted-foreground">
                  Comprehensive stadium valuation using sublease income, retail income, and turnover methods
                </p>
              </div>
              {stadiumResults && (
                <Button onClick={() => handleReset('stadium')} variant="outline">
                  New Analysis
                </Button>
              )}
            </div>

            {!stadiumResults ? (
              <div className="max-w-6xl mx-auto">
                <StadiumValuationForm onSubmit={handleStadiumSubmit} />
              </div>
            ) : (
              <StadiumValuationResults results={stadiumResults} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}