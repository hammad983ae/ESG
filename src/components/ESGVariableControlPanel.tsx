import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Settings, TrendingUp } from "lucide-react";

interface ESGFactor {
  name: string;
  riskImpact: number;
  rateImpact: number;
  active: boolean;
}

export function ESGVariableControlPanel() {
  // Base values for risk premium and cap rate
  const [baseRiskPremium, setBaseRiskPremium] = useState(67.7);
  const [baseCapRate, setBaseCapRate] = useState(5.5);

  // User-adjustable values
  const [riskPremium, setRiskPremium] = useState(baseRiskPremium);
  const [capRate, setCapRate] = useState(baseCapRate);
  const [netIncome, setNetIncome] = useState(50000);

  // Market value states
  const [marketValue, setMarketValue] = useState(0);
  const [marketValueRounded, setMarketValueRounded] = useState(0);

  // ESG factors with influence toggles and impact values
  const [esgFactors, setESGFactors] = useState<ESGFactor[]>([
    { name: 'Ecological Sustainability', riskImpact: 0.02, rateImpact: 0.01, active: true },
    { name: 'Structural Condition', riskImpact: 0.03, rateImpact: 0.015, active: true },
    { name: 'Energy Efficiency', riskImpact: 0.025, rateImpact: 0.012, active: false },
    { name: 'Water Management', riskImpact: 0.015, rateImpact: 0.008, active: false },
    { name: 'Waste Reduction', riskImpact: 0.02, rateImpact: 0.01, active: false },
    { name: 'Community Impact', riskImpact: 0.018, rateImpact: 0.009, active: false },
    { name: 'Tenant Health & Safety', riskImpact: 0.035, rateImpact: 0.018, active: false },
  ]);

  // Toggle ESG influence activation
  const toggleESGInfluence = (index: number) => {
    const updatedFactors = [...esgFactors];
    updatedFactors[index].active = !updatedFactors[index].active;
    setESGFactors(updatedFactors);
  };

  // Update impact values for each ESG factor
  const updateImpactValues = (index: number, type: 'risk' | 'rate', value: string) => {
    const updatedFactors = [...esgFactors];
    const numValue = parseFloat(value) || 0;
    if (type === 'risk') {
      updatedFactors[index].riskImpact = numValue;
    } else if (type === 'rate') {
      updatedFactors[index].rateImpact = numValue;
    }
    setESGFactors(updatedFactors);
  };

  // Recalculate Risk Premium & Cap Rate based on active ESG factors
  useEffect(() => {
    let totalRiskImpact = 0;
    let totalRateImpact = 0;
    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalRiskImpact += factor.riskImpact;
        totalRateImpact += factor.rateImpact;
      }
    });
    
    const adjustedRiskPremium = baseRiskPremium * (1 + totalRiskImpact);
    const adjustedCapRate = baseCapRate + totalRateImpact;
    
    setRiskPremium(parseFloat(adjustedRiskPremium.toFixed(2)));
    setCapRate(parseFloat(adjustedCapRate.toFixed(2)));
  }, [esgFactors, baseRiskPremium, baseCapRate]);

  // Calculate Market Value
  const calculateMarketValue = () => {
    if (capRate > 0 && netIncome) {
      const value = netIncome / (capRate / 100);
      setMarketValue(value);
      setMarketValueRounded(Math.round(value));
    }
  };

  // Run calculation whenever risk/cap rate or income change
  useEffect(() => {
    calculateMarketValue();
  }, [riskPremium, capRate, netIncome]);

  // Get total impact indicators
  const getTotalImpacts = () => {
    let totalRiskImpact = 0;
    let totalRateImpact = 0;
    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalRiskImpact += factor.riskImpact;
        totalRateImpact += factor.rateImpact;
      }
    });
    return { totalRiskImpact, totalRateImpact };
  };

  const { totalRiskImpact, totalRateImpact } = getTotalImpacts();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Risk Premium & Cap Rate Adjustment with ESG Influence
          </CardTitle>
          <CardDescription>
            Adjust risk premium and capitalisation rate values with real-time ESG factor influence and dynamic market valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Manual Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <Label htmlFor="baseRiskPremium">Base Risk Premium (%)</Label>
              <Input
                id="baseRiskPremium"
                type="number"
                value={baseRiskPremium}
                onChange={(e) => setBaseRiskPremium(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="baseCapRate">Base Capitalisation Rate (%)</Label>
              <Input
                id="baseCapRate"
                type="number"
                value={baseCapRate}
                onChange={(e) => setBaseCapRate(parseFloat(e.target.value) || 0)}
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

          {/* Current Adjusted Values Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">Adjusted Risk Premium</h4>
              </div>
              <div className="text-2xl font-bold text-primary">{riskPremium.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">
                Impact: {totalRiskImpact > 0 ? '+' : ''}{(totalRiskImpact * 100).toFixed(2)}%
              </div>
            </Card>
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">Adjusted Cap Rate</h4>
              </div>
              <div className="text-2xl font-bold text-primary">{capRate.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">
                Impact: {totalRateImpact > 0 ? '+' : ''}{(totalRateImpact * 100).toFixed(2)}%
              </div>
            </Card>
          </div>

          {/* ESG Factors Influence Controls */}
          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-semibold">ESG Factors Influence</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {esgFactors.map((factor, index) => (
                <Card key={factor.name} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={factor.active}
                        onChange={() => toggleESGInfluence(index)}
                        className="rounded"
                      />
                      <span className="font-medium">{factor.name}</span>
                    </label>
                    <Badge variant={factor.active ? "default" : "secondary"}>
                      {factor.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {factor.active && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Risk Impact</Label>
                        <Input
                          type="number"
                          step="0.005"
                          value={factor.riskImpact}
                          onChange={(e) => updateImpactValues(index, 'risk', e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate Impact</Label>
                        <Input
                          type="number"
                          step="0.005"
                          value={factor.rateImpact}
                          onChange={(e) => updateImpactValues(index, 'rate', e.target.value)}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Results Display */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Valuation Results
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Base Risk Premium</div>
                <div className="font-mono text-lg">{baseRiskPremium.toFixed(2)}%</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Base Cap Rate</div>
                <div className="font-mono text-lg">{baseCapRate.toFixed(2)}%</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Market Value</div>
                <div className="font-mono text-lg">${marketValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Final Market Value</div>
                <div className="font-mono text-xl font-bold text-primary">
                  ${marketValueRounded.toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Active factors summary */}
            <div className="mt-6 pt-4 border-t border-primary/20">
              <h5 className="font-medium mb-2">Active ESG Factors:</h5>
              <div className="flex flex-wrap gap-2">
                {esgFactors.filter(f => f.active).length > 0 ? (
                  esgFactors
                    .filter(f => f.active)
                    .map(f => (
                      <Badge key={f.name} variant="secondary" className="text-xs">
                        {f.name}
                      </Badge>
                    ))
                ) : (
                  <span className="text-sm text-muted-foreground">No active factors</span>
                )}
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}