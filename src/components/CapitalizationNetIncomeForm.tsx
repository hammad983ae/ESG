import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign } from "lucide-react";
import { CapitalizationNetIncomeInputs } from "@/utils/advancedCalculations";

interface CapitalizationNetIncomeFormProps {
  onSubmit: (inputs: CapitalizationNetIncomeInputs) => void;
}

export function CapitalizationNetIncomeForm({ onSubmit }: CapitalizationNetIncomeFormProps) {
  const [netRent, setNetRent] = useState<string>("");
  const [nrogs, setNrogs] = useState<string>("");
  const [capitalizationRateOptimistic, setCapitalizationRateOptimistic] = useState<string>("");
  const [capitalizationRateRealistic, setCapitalizationRateRealistic] = useState<string>("");
  const [capitalizationRatePessimistic, setCapitalizationRatePessimistic] = useState<string>("");
  const [lettingUpAllowance, setLettingUpAllowance] = useState<string>("");
  const [otherCapitalAdjustments, setOtherCapitalAdjustments] = useState<string>("");
  const [relettingCosts, setRelettingCosts] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: CapitalizationNetIncomeInputs = {
      netRent: parseFloat(netRent) || 0,
      nrogs: nrogs ? parseFloat(nrogs) : undefined,
      capitalizationRateOptimistic: (parseFloat(capitalizationRateOptimistic) || 0) / 100,
      capitalizationRateRealistic: capitalizationRateRealistic ? (parseFloat(capitalizationRateRealistic) / 100) : undefined,
      capitalizationRatePessimistic: (parseFloat(capitalizationRatePessimistic) || 0) / 100,
      lettingUpAllowance: lettingUpAllowance ? parseFloat(lettingUpAllowance) : undefined,
      otherCapitalAdjustments: otherCapitalAdjustments ? parseFloat(otherCapitalAdjustments) : undefined,
      relettingCosts: relettingCosts ? parseFloat(relettingCosts) : undefined,
    };

    onSubmit(inputs);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Capitalization of Net Income Analysis
        </CardTitle>
        <CardDescription>
          Analyze property valuation using the capitalization of net income approach with sensitivity analysis
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
              <h3 className="text-lg font-semibold">Capitalization Rates (%)</h3>
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
            Calculate Market Value
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}