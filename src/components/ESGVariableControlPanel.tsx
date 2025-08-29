import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Leaf, Settings, TrendingUp, AlertTriangle, Plus, X } from "lucide-react";

// Utility helpers
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const safeNumber = (v, fallback = 0) => isNaN(v) || !isFinite(v) ? fallback : v;

interface ESGFactor {
  id: string;
  name: string;
  active: boolean;
  weight: number;
  score: number;
  direction: number; // -1 reduces cap rate, +1 increases cap rate
  sensitivity: number;
}

/**
 * ESG + Fitout Cap Rate Adjustment Component
 * Features:
 * - Direct cap rate input
 * - Net income input  
 * - Initial ESG + Fitout + Compliance + Staff Productivity factors
 * - Per-factor: active, weight, score(0-100), direction (-1 reduce cap rate, +1 increase), sensitivity
 * - Real-time adjusted cap rate and market value calculation
 * - Visual indicators and per-factor contribution breakdown
 * - Add / remove custom factors
 */
export function ESGVariableControlPanel() {
  // Main input states
  const [capRate, setCapRate] = useState(5.5);
  const [netIncome, setNetIncome] = useState(50000);
  const [newFactorName, setNewFactorName] = useState('');

  // ESG factors with extended properties
  const [esgFactors, setESGFactors] = useState<ESGFactor[]>([
    {
      id: 'ecological',
      name: 'Ecological Sustainability',
      active: true,
      weight: 0.25,
      score: 75,
      direction: -1, // Good sustainability reduces cap rate (risk)
      sensitivity: 0.8
    },
    {
      id: 'structural',
      name: 'Structural Condition',
      active: true,
      weight: 0.30,
      score: 80,
      direction: -1, // Good condition reduces cap rate
      sensitivity: 0.9
    },
    {
      id: 'fitout',
      name: 'Fitout Quality',
      active: true,
      weight: 0.20,
      score: 70,
      direction: -1, // Good fitout reduces cap rate
      sensitivity: 0.7
    },
    {
      id: 'compliance',
      name: 'Regulations & Compliance',
      active: true,
      weight: 0.15,
      score: 85,
      direction: -1, // Good compliance reduces cap rate
      sensitivity: 0.6
    },
    {
      id: 'productivity',
      name: 'Staff Productivity',
      active: false,
      weight: 0.10,
      score: 65,
      direction: -1, // Higher productivity reduces cap rate
      sensitivity: 0.5
    }
  ]);

  // Calculate individual factor contributions and adjusted cap rate
  const calculations = useMemo(() => {
    let totalAdjustment = 0;
    const contributions = [];

    esgFactors.forEach((factor) => {
      if (factor.active) {
        // Calculate contribution: weight × (score/100) × direction × sensitivity × base_impact
        const normalizedScore = clamp(factor.score, 0, 100) / 100;
        const contribution = factor.weight * normalizedScore * factor.direction * factor.sensitivity * 0.02; // 2% max impact
        totalAdjustment += contribution;
        contributions.push({
          name: factor.name,
          value: contribution,
          percentage: Math.abs(contribution / 0.02) * 100 // Show as percentage of max impact
        });
      }
    });

    const adjustedCapRate = safeNumber(capRate + totalAdjustment, capRate);
    const marketValue = adjustedCapRate > 0 ? safeNumber(netIncome / (adjustedCapRate / 100), 0) : 0;

    return {
      totalAdjustment,
      adjustedCapRate,
      marketValue,
      contributions,
      isHealthy: adjustedCapRate > 0 && adjustedCapRate < 20 // Reasonable cap rate range
    };
  }, [esgFactors, capRate, netIncome]);

  // Update factor property
  const updateFactor = (id: string, property: keyof ESGFactor, value: any) => {
    setESGFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, [property]: value } : factor
    ));
  };

  // Add custom factor
  const addCustomFactor = () => {
    if (!newFactorName.trim()) return;
    
    const newFactor: ESGFactor = {
      id: `custom_${Date.now()}`,
      name: newFactorName.trim(),
      active: false,
      weight: 0.10,
      score: 50,
      direction: -1,
      sensitivity: 0.5
    };
    
    setESGFactors(prev => [...prev, newFactor]);
    setNewFactorName('');
  };

  // Remove factor
  const removeFactor = (id: string) => {
    setESGFactors(prev => prev.filter(factor => factor.id !== id));
  };

  // Get color based on cap rate health
  const getCapRateColor = () => {
    if (!calculations.isHealthy) return "text-destructive";
    if (calculations.adjustedCapRate < capRate) return "text-green-600";
    return "text-orange-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ESG Cap Rate Adjustment with Extended Factors
          </CardTitle>
          <CardDescription>
            Direct cap rate input with ESG factors including Fitout, Compliance, and Staff Productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="capRate">Base Capitalisation Rate (%)</Label>
              <Input
                id="capRate"
                type="number"
                value={capRate}
                onChange={(e) => setCapRate(safeNumber(parseFloat(e.target.value), 5.5))}
                step="0.01"
                min="0.1"
                max="20"
              />
            </div>
            
            <div>
              <Label htmlFor="netIncome">Net Income ($)</Label>
              <Input
                id="netIncome"
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(safeNumber(parseFloat(e.target.value), 0))}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESG Factors Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            ESG Factor Controls
          </CardTitle>
          <CardDescription>
            Adjust individual factors with weight, score, direction, and sensitivity controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {esgFactors.map((factor) => (
            <div key={factor.id} className={`p-4 border rounded-lg space-y-4 ${factor.active ? 'bg-muted/30' : 'bg-muted/10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={factor.active}
                    onCheckedChange={(checked) => updateFactor(factor.id, 'active', checked)}
                  />
                  <span className="font-medium">{factor.name}</span>
                  {factor.active && <Badge variant="secondary">Active</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Impact: {factor.active ? 
                      `${calculations.contributions.find(c => c.name === factor.name)?.value.toFixed(3) || '0.000'}%` : 
                      'Inactive'
                    }
                  </span>
                  {factor.id.startsWith('custom_') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFactor(factor.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {factor.active && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm">Weight</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[factor.weight]}
                        onValueChange={(values) => updateFactor(factor.id, 'weight', values[0])}
                        max={1}
                        min={0}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12">
                        {factor.weight.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Score (0-100)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[factor.score]}
                        onValueChange={(values) => updateFactor(factor.id, 'score', values[0])}
                        max={100}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-8">
                        {factor.score}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Direction</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        checked={factor.direction === -1}
                        onCheckedChange={(checked) => updateFactor(factor.id, 'direction', checked ? -1 : 1)}
                      />
                      <span className="text-sm">
                        {factor.direction === -1 ? 'Reduces Rate' : 'Increases Rate'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Sensitivity</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[factor.sensitivity]}
                        onValueChange={(values) => updateFactor(factor.id, 'sensitivity', values[0])}
                        max={1}
                        min={0}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-8">
                        {factor.sensitivity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Add Custom Factor */}
          <div className="p-4 border border-dashed rounded-lg">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter custom factor name"
                value={newFactorName}
                onChange={(e) => setNewFactorName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomFactor()}
              />
              <Button onClick={addCustomFactor} disabled={!newFactorName.trim()}>
                <Plus className="w-4 h-4" />
                Add Factor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Real-time Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Base Cap Rate</span>
                <span>{capRate.toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Total ESG Adjustment</span>
                <span className={`font-bold ${calculations.totalAdjustment < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {calculations.totalAdjustment >= 0 ? '+' : ''}{calculations.totalAdjustment.toFixed(3)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/20 rounded-lg">
                <span className="font-bold">Adjusted Cap Rate</span>
                <span className={`font-bold text-lg ${getCapRateColor()}`}>
                  {calculations.adjustedCapRate.toFixed(3)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span className="font-bold">Market Value</span>
                <span className="font-bold text-lg">
                  ${calculations.marketValue.toLocaleString()}
                </span>
              </div>
              
              {!calculations.isHealthy && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Warning: Cap rate outside healthy range
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Factor Contribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {calculations.contributions.map((contribution, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{contribution.name}</span>
                    <span className={contribution.value < 0 ? 'text-green-600' : 'text-orange-600'}>
                      {contribution.value >= 0 ? '+' : ''}{contribution.value.toFixed(3)}%
                    </span>
                  </div>
                  <Progress 
                    value={contribution.percentage} 
                    className="h-2"
                  />
                </div>
              ))}
              
              {calculations.contributions.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No active factors affecting cap rate
                </div>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <div>• Green values reduce cap rate (lower risk)</div>
                <div>• Orange values increase cap rate (higher risk)</div>
                <div>• Progress bars show relative impact magnitude</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}