import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calculator, DollarSign, Leaf } from "lucide-react";
import { ESGAdjustedCapitalizationInputs } from "@/utils/advancedCalculations";

interface ESGAdjustedCapitalizationFormProps {
  onSubmit: (inputs: ESGAdjustedCapitalizationInputs) => void;
}

export function ESGAdjustedCapitalizationForm({ onSubmit }: ESGAdjustedCapitalizationFormProps) {
  const [netRent, setNetRent] = useState<string>("");
  const [nrogs, setNrogs] = useState<string>("");
  const [capitalizationRateOptimistic, setCapitalizationRateOptimistic] = useState<string>("");
  const [capitalizationRateRealistic, setCapitalizationRateRealistic] = useState<string>("");
  const [capitalizationRatePessimistic, setCapitalizationRatePessimistic] = useState<string>("");
  const [lettingUpAllowance, setLettingUpAllowance] = useState<string>("");
  const [otherCapitalAdjustments, setOtherCapitalAdjustments] = useState<string>("");
  const [relettingCosts, setRelettingCosts] = useState<string>("");
  const [useEsgAdjustment, setUseEsgAdjustment] = useState<boolean>(false);
  const [esgAdjustmentFactor, setEsgAdjustmentFactor] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: ESGAdjustedCapitalizationInputs = {
      netRent: parseFloat(netRent) || 0,
      nrogs: nrogs ? parseFloat(nrogs) : undefined,
      capitalizationRateOptimistic: (parseFloat(capitalizationRateOptimistic) || 0) / 100,
      capitalizationRateRealistic: capitalizationRateRealistic ? (parseFloat(capitalizationRateRealistic) / 100) : undefined,
      capitalizationRatePessimistic: (parseFloat(capitalizationRatePessimistic) || 0) / 100,
      lettingUpAllowance: lettingUpAllowance ? parseFloat(lettingUpAllowance) : undefined,
      otherCapitalAdjustments: otherCapitalAdjustments ? parseFloat(otherCapitalAdjustments) : undefined,
      relettingCosts: relettingCosts ? parseFloat(relettingCosts) : undefined,
      useEsgAdjustment,
      esgAdjustmentFactor: useEsgAdjustment && esgAdjustmentFactor ? (parseFloat(esgAdjustmentFactor) / 100) : undefined,
    };

    onSubmit(inputs);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          ESG-Adjusted Capitalization Analysis
        </CardTitle>
        <CardDescription>
          Perform sensitivity analysis with optional ESG factor adjustments to capitalization rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Property Income</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="netRent">Net Rent (Annual) *</Label>
                <Input
                  id="netRent"
                  type="number"
                  placeholder="100000"
                  value={netRent}
                  onChange={(e) => setNetRent(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nrogs">NROGS (Non-Recoverable Outgoings)</Label>
                <Input
                  id="nrogs"
                  type="number"
                  placeholder="10000"
                  value={nrogs}
                  onChange={(e) => setNrogs(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Capitalization Rates Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Base Capitalization Rates (%)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capRateOptimistic">Optimistic Rate *</Label>
                <Input
                  id="capRateOptimistic"
                  type="number"
                  step="0.01"
                  placeholder="5.5"
                  value={capitalizationRateOptimistic}
                  onChange={(e) => setCapitalizationRateOptimistic(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capRateRealistic">Realistic Rate</Label>
                <Input
                  id="capRateRealistic"
                  type="number"
                  step="0.01"
                  placeholder="6.0"
                  value={capitalizationRateRealistic}
                  onChange={(e) => setCapitalizationRateRealistic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capRatePessimistic">Pessimistic Rate *</Label>
                <Input
                  id="capRatePessimistic"
                  type="number"
                  step="0.01"
                  placeholder="6.5"
                  value={capitalizationRatePessimistic}
                  onChange={(e) => setCapitalizationRatePessimistic(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* ESG Adjustment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">ESG Risk Adjustment</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="esgToggle">Apply ESG Adjustment</Label>
                <Switch
                  id="esgToggle"
                  checked={useEsgAdjustment}
                  onCheckedChange={setUseEsgAdjustment}
                />
              </div>
            </div>
            
            {useEsgAdjustment && (
              <div className="space-y-2">
                <Label htmlFor="esgAdjustmentFactor">
                  ESG Adjustment Factor (%)
                  <span className="text-sm text-muted-foreground ml-2">
                    (Added to base cap rates - positive increases risk)
                  </span>
                </Label>
                <Input
                  id="esgAdjustmentFactor"
                  type="number"
                  step="0.001"
                  placeholder="0.5"
                  value={esgAdjustmentFactor}
                  onChange={(e) => setEsgAdjustmentFactor(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Example: 0.5% adjustment will add 0.5% to each capitalization rate
                </p>
              </div>
            )}
          </div>

          {/* Capital Adjustments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Capital Adjustments (Optional)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lettingUpAllowance">Letting Up Allowance</Label>
                <Input
                  id="lettingUpAllowance"
                  type="number"
                  placeholder="2000"
                  value={lettingUpAllowance}
                  onChange={(e) => setLettingUpAllowance(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherCapitalAdjustments">Other Capital Adjustments</Label>
                <Input
                  id="otherCapitalAdjustments"
                  type="number"
                  placeholder="1000"
                  value={otherCapitalAdjustments}
                  onChange={(e) => setOtherCapitalAdjustments(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relettingCosts">Reletting Costs</Label>
                <Input
                  id="relettingCosts"
                  type="number"
                  placeholder="500"
                  value={relettingCosts}
                  onChange={(e) => setRelettingCosts(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate ESG-Adjusted Valuation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}