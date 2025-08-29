import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign } from "lucide-react";
import { CapitalizationSensitivityInputs } from "@/utils/esgCalculations";

interface CapitalizationSensitivityFormProps {
  onSubmit: (inputs: CapitalizationSensitivityInputs) => void;
}

export const CapitalizationSensitivityForm = ({ onSubmit }: CapitalizationSensitivityFormProps) => {
  const [netRent, setNetRent] = useState<string>("100000");
  const [nrogs, setNrogs] = useState<string>("10000");
  const [lettingUpAllowance, setLettingUpAllowance] = useState<string>("2000");
  const [otherCapitalAdjustments, setOtherCapitalAdjustments] = useState<string>("1000");
  const [relettingCosts, setRelettingCosts] = useState<string>("500");
  const [useESGAdjustedARY, setUseESGAdjustedARY] = useState<boolean>(false);
  const [esgAdjustedARY, setEsgAdjustedARY] = useState<string>("5.25");
  const [capitalizationRateOptimistic, setCapitalizationRateOptimistic] = useState<string>("5.5");
  const [capitalizationRateRealistic, setCapitalizationRateRealistic] = useState<string>("6.0");
  const [capitalizationRatePessimistic, setCapitalizationRatePessimistic] = useState<string>("6.5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: CapitalizationSensitivityInputs = {
      netRent: parseFloat(netRent),
      nrogs: parseFloat(nrogs),
      lettingUpAllowance: parseFloat(lettingUpAllowance),
      otherCapitalAdjustments: parseFloat(otherCapitalAdjustments),
      relettingCosts: parseFloat(relettingCosts),
      useESGAdjustedARY,
      esgAdjustedARY: useESGAdjustedARY ? parseFloat(esgAdjustedARY) : undefined,
      capitalizationRateOptimistic: !useESGAdjustedARY ? parseFloat(capitalizationRateOptimistic) / 100 : undefined,
      capitalizationRateRealistic: !useESGAdjustedARY ? parseFloat(capitalizationRateRealistic) / 100 : undefined,
      capitalizationRatePessimistic: !useESGAdjustedARY ? parseFloat(capitalizationRatePessimistic) / 100 : undefined,
    };

    onSubmit(inputs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Capitalization Rate Sensitivity Analysis
        </CardTitle>
        <CardDescription>
          Calculate property valuation with optional ESG-adjusted capitalization rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Income & Costs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Property Financials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="netRent">Net Rent (AUD)</Label>
                <Input
                  id="netRent"
                  type="number"
                  min="0"
                  value={netRent}
                  onChange={(e) => setNetRent(e.target.value)}
                  placeholder="100000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nrogs">NROGS (AUD)</Label>
                <Input
                  id="nrogs"
                  type="number"
                  min="0"
                  value={nrogs}
                  onChange={(e) => setNrogs(e.target.value)}
                  placeholder="10000"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Net Rental and Other Government Services
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lettingUpAllowance">Letting Up Allowance (AUD)</Label>
                <Input
                  id="lettingUpAllowance"
                  type="number"
                  min="0"
                  value={lettingUpAllowance}
                  onChange={(e) => setLettingUpAllowance(e.target.value)}
                  placeholder="2000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherCapitalAdjustments">Other Capital Adjustments (AUD)</Label>
                <Input
                  id="otherCapitalAdjustments"
                  type="number"
                  min="0"
                  value={otherCapitalAdjustments}
                  onChange={(e) => setOtherCapitalAdjustments(e.target.value)}
                  placeholder="1000"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="relettingCosts">Reletting Costs (AUD)</Label>
                <Input
                  id="relettingCosts"
                  type="number"
                  min="0"
                  value={relettingCosts}
                  onChange={(e) => setRelettingCosts(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Capitalization Rate Method */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="useESG"
                checked={useESGAdjustedARY}
                onCheckedChange={setUseESGAdjustedARY}
              />
              <Label htmlFor="useESG" className="font-medium">
                Use ESG-Adjusted ARY
              </Label>
            </div>

            {useESGAdjustedARY ? (
              <div className="space-y-2">
                <Label htmlFor="esgAdjustedARY">ESG-Adjusted ARY (%)</Label>
                <Input
                  id="esgAdjustedARY"
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={esgAdjustedARY}
                  onChange={(e) => setEsgAdjustedARY(e.target.value)}
                  placeholder="5.25"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use the ESG-adjusted ARY from the ESG calculation above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-medium">Traditional Capitalization Rates (%)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optimistic">Optimistic Rate</Label>
                    <Input
                      id="optimistic"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={capitalizationRateOptimistic}
                      onChange={(e) => setCapitalizationRateOptimistic(e.target.value)}
                      placeholder="5.5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="realistic">Realistic Rate</Label>
                    <Input
                      id="realistic"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={capitalizationRateRealistic}
                      onChange={(e) => setCapitalizationRateRealistic(e.target.value)}
                      placeholder="6.0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pessimistic">Pessimistic Rate</Label>
                    <Input
                      id="pessimistic"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={capitalizationRatePessimistic}
                      onChange={(e) => setCapitalizationRatePessimistic(e.target.value)}
                      placeholder="6.5"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Valuation Sensitivity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};