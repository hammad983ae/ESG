import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Leaf, Settings, TrendingUp, AlertTriangle } from "lucide-react";

interface ESGFactor {
  name: string;
  riskPremiumImpact: number;
  capRateImpact: number;
  active: boolean;
  maxImpact: number;
}

export function ESGVariableControlPanel() {
  // State for main inputs
  const [riskPremium, setRiskPremium] = useState(67.7);
  const [capRate, setCapRate] = useState(5.5);
  const [netIncome, setNetIncome] = useState(50000);
  const [marketValue, setMarketValue] = useState(0);
  const [marketValueRounded, setMarketValueRounded] = useState(0);

  // ESG factors impacting risk premium and cap rate
  const [esgFactors, setESGFactors] = useState<ESGFactor[]>([
    { 
      name: 'Ecological Sustainability', 
      riskPremiumImpact: 0.02, 
      capRateImpact: 0.01, 
      active: true,
      maxImpact: 0.05
    },
    { 
      name: 'Structural Condition', 
      riskPremiumImpact: 0.03, 
      capRateImpact: 0.015, 
      active: true,
      maxImpact: 0.06
    },
    { 
      name: 'Architecture/Type of Construction', 
      riskPremiumImpact: 0.025, 
      capRateImpact: 0.012, 
      active: false,
      maxImpact: 0.04
    },
    { 
      name: 'Plot Situation', 
      riskPremiumImpact: 0.015, 
      capRateImpact: 0.008, 
      active: false,
      maxImpact: 0.03
    },
    { 
      name: 'Property Quality', 
      riskPremiumImpact: 0.02, 
      capRateImpact: 0.01, 
      active: false,
      maxImpact: 0.04
    }
  ]);

  // Function to handle ESG factor adjustments
  const handleESGChange = (index: number, type: 'riskPremium' | 'capRate', value: number) => {
    const updated = [...esgFactors];
    if (type === 'riskPremium') {
      updated[index].riskPremiumImpact = value;
    } else if (type === 'capRate') {
      updated[index].capRateImpact = value;
    }
    setESGFactors(updated);
  };

  // Function to toggle active flags
  const toggleESGFactor = (index: number) => {
    const updated = [...esgFactors];
    updated[index].active = !updated[index].active;
    setESGFactors(updated);
  };

  // Calculate adjusted values and market value
  useEffect(() => {
    let totalRiskPremiumImpact = 0;
    let totalCapRateImpact = 0;

    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalRiskPremiumImpact += factor.riskPremiumImpact;
        totalCapRateImpact += factor.capRateImpact;
      }
    });

    const adjustedCapRate = capRate + totalCapRateImpact;
    
    if (netIncome && adjustedCapRate > 0) {
      const marketVal = netIncome / (adjustedCapRate / 100);
      setMarketValue(marketVal);
      setMarketValueRounded(Math.round(marketVal));
    }
  }, [esgFactors, capRate, netIncome, riskPremium]);

  const getTotalImpact = () => {
    return esgFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.riskPremiumImpact + factor.capRateImpact, 0);
  };

  const getAdjustedCapRate = () => {
    const totalCapRateImpact = esgFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.capRateImpact, 0);
    return capRate + totalCapRateImpact;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ESG Variable Control & Risk Premium Adjustment
          </CardTitle>
          <CardDescription>
            Adjust capitalisation rate and risk premium based on ESG factors with real-time impact visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="riskPremium">Risk Premium (%)</Label>
              <Input
                id="riskPremium"
                type="number"
                value={riskPremium}
                onChange={(e) => setRiskPremium(parseFloat(e.target.value) || 0)}
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="capRate">Base Capitalisation Rate (%)</Label>
              <Input
                id="capRate"
                type="number"
                value={capRate}
                onChange={(e) => setCapRate(parseFloat(e.target.value) || 0)}
                step="0.01"
              />
            </div>
            
            <div>
              <Label htmlFor="netIncome">Net Income ($)</Label>
              <Input
                id="netIncome"
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESG Factors Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            ESG Factors Impact on Risk & Rate
          </CardTitle>
          <CardDescription>
            Toggle and adjust individual ESG factors to see their impact on valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {esgFactors.map((factor, index) => (
              <div key={factor.name} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={factor.active}
                      onCheckedChange={() => toggleESGFactor(index)}
                    />
                    <span className="font-medium">{factor.name}</span>
                    {factor.active && <Badge variant="secondary">Active</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Impact: ±{(factor.riskPremiumImpact + factor.capRateImpact).toFixed(3)}
                  </div>
                </div>
                
                {factor.active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Risk Premium Impact</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[factor.riskPremiumImpact]}
                          onValueChange={(values) => handleESGChange(index, 'riskPremium', values[0])}
                          max={factor.maxImpact}
                          min={-factor.maxImpact}
                          step={0.001}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-16">
                          {factor.riskPremiumImpact.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Cap Rate Impact</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[factor.capRateImpact]}
                          onValueChange={(values) => handleESGChange(index, 'capRate', values[0])}
                          max={factor.maxImpact}
                          min={-factor.maxImpact}
                          step={0.001}
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-16">
                          {factor.capRateImpact.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Real-time Valuation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Base Cap Rate</span>
                <span>{capRate.toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Adjusted Cap Rate</span>
                <span className="font-bold">{getAdjustedCapRate().toFixed(3)}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg">
                <span className="font-bold">Market Value</span>
                <span className="font-bold text-lg">${marketValue.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Rounded Value</span>
                <span>${marketValueRounded.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ESG Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Active ESG Factors</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {esgFactors.filter(f => f.active).map(factor => (
                    <Badge key={factor.name} variant="secondary" className="text-xs">
                      {factor.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Total ESG Impact</Label>
                <div className="text-2xl font-bold text-primary">
                  ±{getTotalImpact().toFixed(3)}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Higher ESG scores typically reduce risk premium</div>
                <div>• Environmental factors affect long-term value</div>
                <div>• Social factors influence tenant demand</div>
                <div>• Governance affects operational efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}