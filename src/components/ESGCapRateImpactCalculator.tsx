import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, AlertTriangle, BarChart3, Settings2 } from "lucide-react";

interface ESGFactor {
  name: string;
  weight: number;
  active: boolean;
  maxWeight: number;
  category: 'environmental' | 'social' | 'governance';
  description: string;
}

export function ESGCapRateImpactCalculator() {
  // Main input states
  const [capRate, setCapRate] = useState(5.5);
  const [netIncome, setNetIncome] = useState(50000);
  const [marketValue, setMarketValue] = useState(0);
  const [marketValueRounded, setMarketValueRounded] = useState(0);

  // ESG factors influencing cap rate adjustments
  const [esgFactors, setESGFactors] = useState<ESGFactor[]>([
    { 
      name: 'Ecological Sustainability', 
      weight: 0.02, 
      active: true, 
      maxWeight: 0.05,
      category: 'environmental',
      description: 'Energy efficiency, carbon footprint, green certifications'
    },
    { 
      name: 'Structural Condition', 
      weight: 0.03, 
      active: true, 
      maxWeight: 0.06,
      category: 'governance',
      description: 'Building maintenance, structural integrity, compliance'
    },
    { 
      name: 'Architecture/Construction Type', 
      weight: 0.025, 
      active: false, 
      maxWeight: 0.04,
      category: 'governance',
      description: 'Design quality, construction materials, functionality'
    },
    { 
      name: 'Plot Situation', 
      weight: 0.015, 
      active: false, 
      maxWeight: 0.03,
      category: 'social',
      description: 'Location amenities, accessibility, neighborhood quality'
    },
    { 
      name: 'Property Quality', 
      weight: 0.02, 
      active: false, 
      maxWeight: 0.04,
      category: 'governance',
      description: 'Overall property condition, tenant satisfaction, management'
    }
  ]);

  // Toggle ESG factor active status
  const toggleESGFactor = (index: number) => {
    const updated = [...esgFactors];
    updated[index].active = !updated[index].active;
    setESGFactors(updated);
  };

  // Handle ESG weight adjustments
  const handleESGChange = (index: number, value: number) => {
    const updated = [...esgFactors];
    updated[index].weight = value;
    setESGFactors(updated);
  };

  // Calculate adjusted cap rate and market values in real-time
  useEffect(() => {
    let totalImpact = 0;
    esgFactors.forEach((factor) => {
      if (factor.active) {
        totalImpact += factor.weight;
      }
    });
    
    // Impact multiplier - can be positive or negative based on ESG performance
    const adjustedCapRate = capRate + (totalImpact * 0.5);
    
    if (netIncome && adjustedCapRate > 0) {
      const marketVal = netIncome / (adjustedCapRate / 100);
      setMarketValue(marketVal);
      setMarketValueRounded(Math.round(marketVal));
    }
  }, [esgFactors, capRate, netIncome]);

  const getAdjustedCapRate = () => {
    const totalImpact = esgFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.weight, 0);
    return capRate + (totalImpact * 0.5);
  };

  const getTotalESGImpact = () => {
    return esgFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.weight, 0);
  };

  const getCategoryFactors = (category: string) => {
    return esgFactors.filter(factor => factor.category === category && factor.active);
  };

  const getImpactLevel = (impact: number) => {
    if (Math.abs(impact) < 0.01) return { level: 'Low', color: 'bg-green-500' };
    if (Math.abs(impact) < 0.05) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'High', color: 'bg-red-500' };
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            ESG Cap Rate Impact Calculator
          </CardTitle>
          <CardDescription>
            Analyze how Environmental, Social, and Governance factors influence capitalization rates and property valuation with real-time adjustments and visual feedback
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Base Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="capRate">Base Capitalisation Rate (%)</Label>
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
          </CardContent>
        </Card>

        {/* Real-time Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Real-time Results
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
                <span className="font-bold text-primary">{getAdjustedCapRate().toFixed(3)}%</span>
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

        {/* ESG Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              ESG Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Total ESG Impact</span>
                <Badge variant={getTotalESGImpact() > 0 ? "destructive" : "secondary"}>
                  {getTotalESGImpact() > 0 ? '+' : ''}{getTotalESGImpact().toFixed(3)}
                </Badge>
              </div>
              <Progress 
                value={Math.abs(getTotalESGImpact()) * 1000} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Active Factors by Category:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Environmental:</span>
                  <span>{getCategoryFactors('environmental').length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Social:</span>
                  <span>{getCategoryFactors('social').length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Governance:</span>
                  <span>{getCategoryFactors('governance').length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Factors Adjustment Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            ESG Factors Influence on Cap Rate
          </CardTitle>
          <CardDescription>
            Adjust individual ESG factor weights to see their real-time impact on capitalization rates. 
            Positive weights increase cap rate (higher risk), negative weights decrease cap rate (lower risk).
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
                    <div>
                      <span className="font-medium">{factor.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {factor.category}
                      </Badge>
                    </div>
                    {factor.active && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Impact: {factor.active ? factor.weight.toFixed(3) : '0.000'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getImpactLevel(factor.weight).level} Risk
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {factor.description}
                </p>
                
                {factor.active && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Weight Adjustment</Label>
                      <span className="text-sm font-mono">
                        {factor.weight.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">-{factor.maxWeight}</span>
                      <Slider
                        value={[factor.weight]}
                        onValueChange={(values) => handleESGChange(index, values[0])}
                        max={factor.maxWeight}
                        min={-factor.maxWeight}
                        step={0.001}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground">+{factor.maxWeight}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Reduces Cap Rate (Lower Risk)</span>
                      <span>Increases Cap Rate (Higher Risk)</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Impact Analysis</CardTitle>
          <CardDescription>
            Real-time visualization of how ESG adjustments affect your property valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Cap Rate Comparison</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span>Base Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded"></div>
                    <span className="text-sm">{capRate.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                  <span>ESG Adjusted</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-primary rounded"
                      style={{ width: `${Math.min(100, (getAdjustedCapRate() / capRate) * 96)}px` }}
                    ></div>
                    <span className="text-sm font-bold">{getAdjustedCapRate().toFixed(3)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Value Impact</h4>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">
                  ${marketValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Final Market Value
                </div>
                {getTotalESGImpact() !== 0 && (
                  <Badge 
                    variant={getTotalESGImpact() > 0 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {getTotalESGImpact() > 0 ? 'Increased' : 'Decreased'} by ESG factors
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}