import { useState } from "react";
import { ArrowLeft, Target, TrendingUp, Leaf, Calculator } from "lucide-react";
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
import { ARYInputs, ARYResults, calculateAllRisksYield } from "@/utils/aryCalculations";
import { 
  ESGInputs, 
  ESGResults, 
  CapitalizationSensitivityInputs, 
  CapitalizationSensitivityResults,
  calculateESGAdjustedARY,
  calculateCapitalizationRateSensitivity
} from "@/utils/esgCalculations";

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
          <TabsList className="grid w-full grid-cols-3">
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
        </Tabs>
      </div>
    </div>
  );
}