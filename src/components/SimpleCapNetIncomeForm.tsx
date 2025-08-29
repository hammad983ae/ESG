import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export interface SimpleCapNetIncomeInputs {
  netRent: number;
  nrogs: number;
  noi: number;
  capitalizationRate: number;
  riskPremium: number;
}

export interface SimpleCapNetIncomeResults {
  marketValue: number;
  marketValueRounded: number;
  adjustedRiskPremium: number;
  adjustedCapRate: number;
}

interface SimpleCapNetIncomeFormProps {
  onSubmit: (inputs: SimpleCapNetIncomeInputs) => void;
}

export function SimpleCapNetIncomeForm({ onSubmit }: SimpleCapNetIncomeFormProps) {
  const [formData, setFormData] = useState<SimpleCapNetIncomeInputs>({
    netRent: 0,
    nrogs: 0,
    noi: 0,
    capitalizationRate: 5.5,
    riskPremium: 67.7,
  });

  const handleInputChange = (field: keyof SimpleCapNetIncomeInputs, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateNOI = () => {
    const calculatedNOI = formData.netRent + formData.nrogs;
    setFormData(prev => ({ ...prev, noi: calculatedNOI }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Capitalisation of Net Income Approach
        </CardTitle>
        <CardDescription>
          Calculate market value by dividing net income (NOI) by the Capitalisation Rate with risk premium adjustments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="netRent">Net Rent ($)</Label>
                <Input
                  id="netRent"
                  type="number"
                  value={formData.netRent}
                  onChange={(e) => handleInputChange('netRent', e.target.value)}
                  placeholder="Enter net rent"
                />
              </div>

              <div>
                <Label htmlFor="nrogs">NROG's ($)</Label>
                <Input
                  id="nrogs"
                  type="number"
                  value={formData.nrogs}
                  onChange={(e) => handleInputChange('nrogs', e.target.value)}
                  placeholder="Enter NROG's"
                />
              </div>

              <div>
                <Label htmlFor="noi">Net Operating Income (NOI) ($)</Label>
                <div className="flex gap-2">
                  <Input
                    id="noi"
                    type="number"
                    value={formData.noi}
                    onChange={(e) => handleInputChange('noi', e.target.value)}
                    placeholder="Enter NOI or calculate"
                  />
                  <Button type="button" onClick={calculateNOI} variant="outline">
                    Calculate NOI
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="capitalizationRate">Capitalisation Rate (%)</Label>
                <Input
                  id="capitalizationRate"
                  type="number"
                  step="0.01"
                  value={formData.capitalizationRate}
                  onChange={(e) => handleInputChange('capitalizationRate', e.target.value)}
                  placeholder="5.5"
                />
              </div>

              <div>
                <Label htmlFor="riskPremium">Risk Premium (%)</Label>
                <Input
                  id="riskPremium"
                  type="number"
                  step="0.1"
                  value={formData.riskPremium}
                  onChange={(e) => handleInputChange('riskPremium', e.target.value)}
                  placeholder="67.7"
                />
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Quick Preview</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>NOI: ${formData.noi.toLocaleString()}</div>
                  <div>Cap Rate: {formData.capitalizationRate}%</div>
                  <div>Estimated Value: ${formData.noi && formData.capitalizationRate ? 
                    (formData.noi / (formData.capitalizationRate / 100)).toLocaleString() : '0'}</div>
                </div>
              </Card>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Calculate Market Value
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}