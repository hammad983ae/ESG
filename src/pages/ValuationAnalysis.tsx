import { useState } from "react";
import { ArrowLeft, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ARYCalculationForm } from "@/components/ARYCalculationForm";
import { ARYResultsDisplay } from "@/components/ARYResults";
import { ARYInputs, ARYResults, calculateAllRisksYield } from "@/utils/aryCalculations";

export default function ValuationAnalysis() {
  const [inputs, setInputs] = useState<ARYInputs | null>(null);
  const [results, setResults] = useState<ARYResults | null>(null);

  const handleARYSubmit = (aryInputs: ARYInputs) => {
    try {
      const calculatedResults = calculateAllRisksYield(aryInputs);
      setInputs(aryInputs);
      setResults(calculatedResults);
      toast.success("ARY calculation completed successfully!");
    } catch (error) {
      toast.error(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = () => {
    setInputs(null);
    setResults(null);
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
                All Risks Yield Analysis
              </h1>
              <p className="text-muted-foreground">
                Calculate ARY using dynamic risk-free rate and comprehensive risk assessment
              </p>
            </div>
          </div>
          {results && (
            <Button onClick={handleReset} variant="outline">
              New Calculation
            </Button>
          )}
        </div>

        {/* Main Content */}
        {!results ? (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  About All Risks Yield (ARY)
                </CardTitle>
                <CardDescription>
                  ARY represents the total return required by investors, combining the risk-free rate with property-specific risk premiums. 
                  Our calculation uses the Australian cash rate as the risk-free base and applies comprehensive risk factors based on property type.
                </CardDescription>
              </CardHeader>
            </Card>
            <ARYCalculationForm onSubmit={handleARYSubmit} />
          </div>
        ) : (
          <ARYResultsDisplay results={results} inputs={inputs!} />
        )}
      </div>
    </div>
  );
}