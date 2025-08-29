import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface ESGFactor {
  name: string;
  weight: number;
  active: boolean;
}

export function ESGVariableControlPanel() {
  // Main input states
  const [capRate, setCapRate] = useState(5.5); // default cap rate
  const [netIncome, setNetIncome] = useState(50000);
  const [marketValue, setMarketValue] = useState(0);
  const [marketValueRounded, setMarketValueRounded] = useState(0);

  // ESG factors influencing thresholds or adjustment weights
  const [esgFactors, setESGFactors] = useState<ESGFactor[]>([
    { name: 'Ecological Sustainability', weight: 0.02, active: true },
    { name: 'Structural Condition', weight: 0.03, active: true },
    { name: 'Energy Efficiency', weight: 0.025, active: false },
    { name: 'Water Management', weight: 0.015, active: false },
    { name: 'Waste Reduction', weight: 0.02, active: false },
    { name: 'Community Impact', weight: 0.018, active: false },
    { name: 'Tenant Health & Safety', weight: 0.035, active: false },
  ]);

  // Toggle ESG factor active status
  const toggleESGFactor = (index: number) => {
    const updated = [...esgFactors];
    updated[index].active = !updated[index].active;
    setESGFactors(updated);
  };

  // Handle ESG weight adjustments
  const handleESGChange = (index: number, value: string) => {
    const updated = [...esgFactors];
    updated[index].weight = parseFloat(value) || 0;
    setESGFactors(updated);
  };

  // Calculate adjusted cap rate based on ESG factors
  const calculateAdjustedValues = () => {
    let totalImpact = 0;
    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalImpact += factor.weight;
      }
    });
    const adjustedCapRate = capRate + totalImpact * 0.5; // Example impact multiplier
    const marketVal = netIncome / (adjustedCapRate / 100);
    setMarketValue(marketVal);
    setMarketValueRounded(Math.round(marketVal));
  };

  // Real-time calculation when inputs change
  useEffect(() => {
    calculateAdjustedValues();
  }, [capRate, netIncome, esgFactors]);

  // Get current adjusted cap rate for display
  const getAdjustedCapRate = () => {
    let totalImpact = 0;
    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalImpact += factor.weight;
      }
    });
    return capRate + totalImpact * 0.5;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Capitalisation Rate Adjustment
          </CardTitle>
          <CardDescription>
            Adjust capitalisation rate and observe real-time impacts from ESG factors on property valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Main Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="capRate">Capitalisation Rate (%)</Label>
              <Input
                id="capRate"
                type="number"
                value={capRate}
                onChange={(e) => setCapRate(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="netIncome">Net Income ($)</Label>
              <Input
                id="netIncome"
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* ESG Factors Impact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">ESG Factors Influence on Cap Rate</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {esgFactors.map((factor, index) => (
                <div key={factor.name} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={factor.active}
                        onChange={() => toggleESGFactor(index)}
                        className="rounded"
                      />
                      <span className="font-medium">{factor.name}</span>
                    </label>
                    <div className={`px-2 py-1 rounded text-xs ${
                      factor.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {factor.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  {factor.active && (
                    <div>
                      <Label className="text-sm">Impact Weight</Label>
                      <Input
                        type="number"
                        step="0.005"
                        value={factor.weight}
                        onChange={(e) => handleESGChange(index, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="mt-6">
            <Button onClick={calculateAdjustedValues} className="w-full md:w-auto">
              Calculate Market Value
            </Button>
          </div>

          {/* Results Display */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Valuation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Cap Rate:</span>
                  <span className="font-mono">{capRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Adjusted Cap Rate:</span>
                  <span className="font-mono text-primary font-semibold">
                    {getAdjustedCapRate().toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Market Value:</span>
                  <span className="font-mono">${marketValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounded Market Value:</span>
                  <span className="font-mono text-lg font-semibold text-primary">
                    ${marketValueRounded.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Active factors summary */}
            <div className="mt-4 pt-4 border-t">
              <h5 className="font-medium mb-2">Active ESG Factors:</h5>
              <div className="text-sm text-muted-foreground">
                {esgFactors.filter(f => f.active).length > 0 ? (
                  esgFactors
                    .filter(f => f.active)
                    .map(f => f.name)
                    .join(', ')
                ) : (
                  'No active factors'
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}