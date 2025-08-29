import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Leaf } from "lucide-react";

interface ESGFactor {
  name: string;
  maxRiskScore: number;
  riskPremium: number;
  weight: number;
}

export const ESGFactorsWeightingPanel = () => {
  // Sample data based on the provided example
  const initialFactors: ESGFactor[] = [
    { name: 'Ecological Sustainability', maxRiskScore: 10, riskPremium: 0.5, weight: 1 },
    { name: 'Architecture/Type of Construction', maxRiskScore: 10, riskPremium: 0.25, weight: 1 },
    { name: 'Structural Condition', maxRiskScore: 10, riskPremium: 0.35, weight: 1 },
    { name: 'Plot Situation', maxRiskScore: 10, riskPremium: 0.25, weight: 1 },
    { name: 'Property', maxRiskScore: 10, riskPremium: 0.25, weight: 1 },
    { name: 'Fitout', maxRiskScore: 10, riskPremium: 0.2, weight: 1 },
    { name: 'Profitability of Building Concept', maxRiskScore: 10, riskPremium: 0.3, weight: 1 },
    { name: 'Quality of Property Cashflow', maxRiskScore: 10, riskPremium: 0.4, weight: 1 },
    { name: 'Tenant and Occupier Situation', maxRiskScore: 10, riskPremium: 0.3, weight: 1 },
    { name: 'Rental Growth Potential', maxRiskScore: 10, riskPremium: 0.35, weight: 1 },
    { name: 'Letting Prospects', maxRiskScore: 10, riskPremium: 0.25, weight: 1 },
    { name: 'Vacancy/Letting Situation', maxRiskScore: 10, riskPremium: 0.3, weight: 1 },
  ];

  const [factors, setFactors] = useState<ESGFactor[]>(initialFactors);

  const handleWeightChange = (index: number, newWeight: number[]) => {
    const updatedFactors = [...factors];
    updatedFactors[index].weight = newWeight[0];
    setFactors(updatedFactors);
  };

  const calculateESGRiskScore = (): number => {
    // ESG Risk Score = sum of (Risk Premium * Weight) for all factors
    return factors.reduce((total, factor) => total + (factor.riskPremium * factor.weight), 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            ESG Factors Adjustment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {factors.map((factor, index) => (
              <div key={factor.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium min-w-0 flex-1">
                    {factor.name}
                  </Label>
                  <div className="text-sm text-muted-foreground ml-4">
                    Risk Premium: {factor.riskPremium}%
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider
                      value={[factor.weight]}
                      onValueChange={(value) => handleWeightChange(index, value)}
                      max={factor.maxRiskScore}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm font-medium text-right min-w-[100px]">
                    Weight: {factor.weight.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">
                Calculated ESG Risk Score
              </h4>
              <div className="text-2xl font-bold text-primary">
                {calculateESGRiskScore().toFixed(3)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Real-time calculation based on weighted risk premiums
              </p>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Adjust the weights for each ESG factor to see how they impact the overall risk score.
              This calculation can be integrated with backend valuation logic for comprehensive property assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};