import { useState } from "react";
import { ArrowLeft, Target, TrendingUp, Leaf, Calculator, Settings, Building2, Sliders } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
                Comprehensive property valuation with ARY, ESG, and capitalization rate analysis
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="ary" className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="ary" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              All Risks Yield
            </TabsTrigger>
            <TabsTrigger value="esg" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              ESG-Adjusted ARY
            </TabsTrigger>
            <TabsTrigger value="capitalization" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Cap Rate Sensitivity
            </TabsTrigger>
            <TabsTrigger value="netincome" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Net Income Approach
            </TabsTrigger>
            <TabsTrigger value="esgcapitalization" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ESG Cap Analysis
            </TabsTrigger>
            <TabsTrigger value="esgcomparablesales" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              ESG Comparable Sales
            </TabsTrigger>
            <TabsTrigger value="esgweighting" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              ESG Factors Weighting
            </TabsTrigger>
            <TabsTrigger value="capnetincome" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Cap Net Income
            </TabsTrigger>
            <TabsTrigger value="esgvariablecontrol" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ESG Variable Control
            </TabsTrigger>
            <TabsTrigger value="esgcaprateimpact" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              ESG Cap Rate Impact
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
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      About All Risks Yield (ARY)
                    </CardTitle>
                    <CardDescription>
                      ARY represents the total return required by investors, combining the risk-free rate with property-specific risk premiums. 
                      Our calculation uses the Australian cash rate as the risk-free base and applies comprehensive risk factors.
                    </CardDescription>
                  </CardHeader>
                </Card>
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
        </Tabs>
      </div>
    </div>
  );
}