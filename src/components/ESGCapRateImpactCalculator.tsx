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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, TrendingUp, AlertTriangle, BarChart3, Settings2 } from "lucide-react";

interface RiskFactor {
  name: string;
  maxRiskScore: number;
  maxRiskPremium: number;
  assignedRiskScore: number;
  riskPremium: number;
  calculationPercentage: number;
  active: boolean;
  category: 'environmental' | 'social' | 'governance';
}

export function ESGCapRateImpactCalculator() {
  // Main input states
  const [capRate, setCapRate] = useState(5.5);
  const [netIncome, setNetIncome] = useState(50000);
  const [marketValue, setMarketValue] = useState(0);
  const [marketValueRounded, setMarketValueRounded] = useState(0);

  // Risk factors matching the All Risks Yield table structure
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    { 
      name: 'Architecture/Type of Construction', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.25, 
      assignedRiskScore: 5.2, 
      riskPremium: 0.13, 
      calculationPercentage: 0.13, 
      active: true, 
      category: 'governance' 
    },
    { 
      name: 'Fitout', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.2, 
      assignedRiskScore: 4.5, 
      riskPremium: 0.09, 
      calculationPercentage: 0.09, 
      active: true, 
      category: 'governance' 
    },
    { 
      name: 'Structural Condition', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.35, 
      assignedRiskScore: 5.5, 
      riskPremium: 0.19, 
      calculationPercentage: 0.19, 
      active: true, 
      category: 'governance' 
    },
    { 
      name: 'Plot Situation', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.25, 
      assignedRiskScore: 5, 
      riskPremium: 0.13, 
      calculationPercentage: 0.13, 
      active: true, 
      category: 'social' 
    },
    { 
      name: 'Ecological Sustainability', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.5, 
      assignedRiskScore: 7.1, 
      riskPremium: 0.35, 
      calculationPercentage: 0.35, 
      active: true, 
      category: 'environmental' 
    },
    { 
      name: 'Profitability of building concept', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.25, 
      assignedRiskScore: 4.9, 
      riskPremium: 0.12, 
      calculationPercentage: 0.12, 
      active: false, 
      category: 'governance' 
    },
    { 
      name: 'Quality of property cashflow', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.5, 
      assignedRiskScore: 5.5, 
      riskPremium: 0.28, 
      calculationPercentage: 0.28, 
      active: false, 
      category: 'governance' 
    },
    { 
      name: 'Tenant and Occupier Situation', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.5, 
      assignedRiskScore: 5.5, 
      riskPremium: 0.28, 
      calculationPercentage: 0.28, 
      active: false, 
      category: 'social' 
    },
    { 
      name: 'Rental Growth Potential/Value Growth Potential', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.3, 
      assignedRiskScore: 3.5, 
      riskPremium: 0.11, 
      calculationPercentage: 0.11, 
      active: false, 
      category: 'governance' 
    },
    { 
      name: 'Letting Prospects', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.25, 
      assignedRiskScore: 5, 
      riskPremium: 0.13, 
      calculationPercentage: 0.13, 
      active: false, 
      category: 'social' 
    },
    { 
      name: 'Vacancy/Letting Situation', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.25, 
      assignedRiskScore: 1, 
      riskPremium: 0.03, 
      calculationPercentage: 0.03, 
      active: false, 
      category: 'social' 
    },
    { 
      name: 'Recoverable and Non-Recoverable Operating Expenses', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.2, 
      assignedRiskScore: 3, 
      riskPremium: 0.06, 
      calculationPercentage: 0.06, 
      active: false, 
      category: 'governance' 
    },
    { 
      name: 'Usability by third parties and/or Alternative Use', 
      maxRiskScore: 10, 
      maxRiskPremium: 0.2, 
      assignedRiskScore: 2, 
      riskPremium: 0.04, 
      calculationPercentage: 0.04, 
      active: false, 
      category: 'governance' 
    },
    { 
      name: 'Exceptional Circumstances', 
      maxRiskScore: 10, 
      maxRiskPremium: 1, 
      assignedRiskScore: 0, 
      riskPremium: 0, 
      calculationPercentage: 0, 
      active: false, 
      category: 'governance' 
    }
  ]);

  // Toggle risk factor active status
  const toggleRiskFactor = (index: number) => {
    const updated = [...riskFactors];
    updated[index].active = !updated[index].active;
    setRiskFactors(updated);
  };

  // Handle assigned risk score adjustments
  const handleAssignedScoreChange = (index: number, value: number) => {
    const updated = [...riskFactors];
    updated[index].assignedRiskScore = value;
    // Calculate risk premium as percentage of max premium based on assigned score
    updated[index].riskPremium = (value / updated[index].maxRiskScore) * updated[index].maxRiskPremium;
    updated[index].calculationPercentage = updated[index].riskPremium;
    setRiskFactors(updated);
  };

  // Calculate adjusted cap rate and market values in real-time
  useEffect(() => {
    const totalRiskPremium = getTotalRiskPremium();
    const adjustedCapRate = capRate + totalRiskPremium;
    
    if (netIncome && adjustedCapRate > 0) {
      const marketVal = netIncome / (adjustedCapRate / 100);
      setMarketValue(marketVal);
      setMarketValueRounded(Math.round(marketVal));
    }
  }, [riskFactors, capRate, netIncome]);

  const getTotalRiskPremium = () => {
    return riskFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.calculationPercentage, 0);
  };

  const getAdjustedCapRate = () => {
    return capRate + getTotalRiskPremium();
  };

  const getTotalMaxRiskScore = () => {
    return riskFactors.reduce((total, factor) => total + factor.maxRiskScore, 0);
  };

  const getTotalMaxRiskPremium = () => {
    return riskFactors.reduce((total, factor) => total + factor.maxRiskPremium, 0);
  };

  const getTotalAssignedRiskScore = () => {
    return riskFactors.reduce((total, factor) => total + (factor.active ? factor.assignedRiskScore : 0), 0);
  };

  const getTotalCalculationPercentage = () => {
    return riskFactors
      .filter(factor => factor.active)
      .reduce((total, factor) => total + factor.calculationPercentage, 0);
  };

  const getCategoryFactors = (category: string) => {
    return riskFactors.filter(factor => factor.category === category && factor.active);
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
            All Risks Yield Composition and Calculation
          </CardTitle>
          <CardDescription>
            Interactive risk assessment tool for property valuation using weighted ESG and operational factors to calculate adjusted capitalization rates
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
                <span className="font-medium">Total Risk Premium</span>
                <span className="font-bold text-primary">{getTotalRiskPremium().toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg">
                <span className="font-medium">All Risks Yield</span>
                <span className="font-bold text-primary">{getAdjustedCapRate().toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
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

        {/* Risk Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Risk Assessment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Max Risk Score:</span>
                  <span className="font-medium">{getTotalMaxRiskScore()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Max Risk Premium:</span>
                  <span className="font-medium">{getTotalMaxRiskPremium().toFixed(2)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Assigned Score:</span>
                  <span className="font-medium">{getTotalAssignedRiskScore().toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Risk Premium:</span>
                  <span className="font-bold text-primary">{getTotalCalculationPercentage().toFixed(2)}%</span>
                </div>
              </div>
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

      {/* All Risks Yield Composition Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Composition and Calculation of the All Risks Yield
          </CardTitle>
          <CardDescription>
            Adjust individual risk scores to see their real-time impact on risk premiums and the final All Risks Yield calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Property</TableHead>
                  <TableHead className="text-center">Max Risk Score</TableHead>
                  <TableHead className="text-center">Max Risk Premium %</TableHead>
                  <TableHead className="text-center">Assigned Risk Score</TableHead>
                  <TableHead className="text-center">Risk Premium %</TableHead>
                  <TableHead className="text-center">Calculation %</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskFactors.map((factor, index) => (
                  <TableRow key={factor.name} className={factor.active ? "bg-primary/5" : "bg-muted/30"}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{factor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {factor.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{factor.maxRiskScore}</TableCell>
                    <TableCell className="text-center">{factor.maxRiskPremium.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Slider
                          value={[factor.assignedRiskScore]}
                          onValueChange={(values) => handleAssignedScoreChange(index, values[0])}
                          max={factor.maxRiskScore}
                          min={0}
                          step={0.1}
                          className="w-20"
                          disabled={!factor.active}
                        />
                        <span className="text-xs font-mono w-8">
                          {factor.assignedRiskScore.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {factor.active ? factor.riskPremium.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {factor.active ? factor.calculationPercentage.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={factor.active}
                        onCheckedChange={() => toggleRiskFactor(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-primary/20 font-bold">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-center">{getTotalMaxRiskScore()}</TableCell>
                  <TableCell className="text-center">{getTotalMaxRiskPremium().toFixed(1)}</TableCell>
                  <TableCell className="text-center">{getTotalAssignedRiskScore().toFixed(1)}</TableCell>
                  <TableCell className="text-center">{getTotalRiskPremium().toFixed(2)}</TableCell>
                  <TableCell className="text-center">{getTotalCalculationPercentage().toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Impact Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Impact Analysis</CardTitle>
          <CardDescription>
            Real-time visualization of how risk adjustments affect your All Risks Yield and property valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">All Risks Yield Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span>Base Cap Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded"></div>
                    <span className="text-sm">{capRate.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                  <span>Risk Premium</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-destructive rounded"
                      style={{ width: `${Math.min(100, (getTotalRiskPremium() / capRate) * 96)}px` }}
                    ></div>
                    <span className="text-sm font-bold">+{getTotalRiskPremium().toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                  <span>All Risks Yield</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 bg-primary rounded"
                      style={{ width: `${Math.min(100, (getAdjustedCapRate() / capRate) * 96)}px` }}
                    ></div>
                    <span className="text-sm font-bold">{getAdjustedCapRate().toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Property Valuation</h4>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">
                  ${marketValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Final Market Value
                </div>
                <div className="text-xs text-muted-foreground">
                  (NOI: ${netIncome.toLocaleString()} ÷ ARY: {getAdjustedCapRate().toFixed(2)}%)
                </div>
                {getTotalRiskPremium() > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Risk premium increases yield by {getTotalRiskPremium().toFixed(2)}%
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