/**
 * Suggested Weight Portfolio Section
 * Provides portfolio weighting recommendations and optimization tools
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Target, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AssetAllocation {
  id: string;
  name: string;
  type: string;
  currentWeight: number;
  suggestedWeight: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  volatility: number;
}

interface PortfolioMetrics {
  totalValue: number;
  expectedReturn: number;
  totalRisk: number;
  sharpeRatio: number;
  diversificationScore: number;
}

interface WeightPortfolioSectionProps {
  onOptimizationComplete: (allocations: AssetAllocation[], metrics: PortfolioMetrics) => void;
}

const ASSET_TYPES = [
  { value: 'commercial-office', label: 'Commercial Office', expectedReturn: 7.5, volatility: 12, riskLevel: 'medium' as const },
  { value: 'retail', label: 'Retail', expectedReturn: 8.2, volatility: 15, riskLevel: 'medium' as const },
  { value: 'industrial', label: 'Industrial', expectedReturn: 9.1, volatility: 10, riskLevel: 'low' as const },
  { value: 'residential', label: 'Residential', expectedReturn: 6.8, volatility: 8, riskLevel: 'low' as const },
  { value: 'hospitality', label: 'Hospitality', expectedReturn: 10.5, volatility: 20, riskLevel: 'high' as const },
  { value: 'retail-big-box', label: 'Big Box Retail', expectedReturn: 8.8, volatility: 14, riskLevel: 'medium' as const },
  { value: 'healthcare', label: 'Healthcare', expectedReturn: 7.2, volatility: 9, riskLevel: 'low' as const },
  { value: 'childcare', label: 'Childcare', expectedReturn: 8.5, volatility: 11, riskLevel: 'low' as const }
];

const PORTFOLIO_STRATEGIES = [
  { 
    value: 'conservative', 
    label: 'Conservative', 
    description: 'Focus on stable income and capital preservation',
    targetReturn: 6.5,
    maxRisk: 10
  },
  { 
    value: 'balanced', 
    label: 'Balanced', 
    description: 'Balanced approach between growth and stability',
    targetReturn: 8.0,
    maxRisk: 12
  },
  { 
    value: 'growth', 
    label: 'Growth', 
    description: 'Focus on capital appreciation and higher returns',
    targetReturn: 10.0,
    maxRisk: 16
  },
  { 
    value: 'aggressive', 
    label: 'Aggressive', 
    description: 'Maximum growth potential with higher risk tolerance',
    targetReturn: 12.0,
    maxRisk: 20
  }
];

export function WeightPortfolioSection({ onOptimizationComplete }: WeightPortfolioSectionProps) {
  const [strategy, setStrategy] = useState<string>('balanced');
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(10000000);
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [customAllocation, setCustomAllocation] = useState<Partial<AssetAllocation>>({
    name: '',
    type: '',
    currentWeight: 0
  });

  const addAssetAllocation = () => {
    if (!customAllocation.name || !customAllocation.type) {
      toast.error("Please fill in asset name and type");
      return;
    }

    const assetType = ASSET_TYPES.find(t => t.value === customAllocation.type);
    if (!assetType) return;

    const newAllocation: AssetAllocation = {
      id: Date.now().toString(),
      name: customAllocation.name,
      type: customAllocation.type,
      currentWeight: customAllocation.currentWeight || 0,
      suggestedWeight: 0,
      riskLevel: assetType.riskLevel,
      expectedReturn: assetType.expectedReturn,
      volatility: assetType.volatility
    };

    setAllocations(prev => [...prev, newAllocation]);
    setCustomAllocation({ name: '', type: '', currentWeight: 0 });
    toast.success("Asset allocation added successfully");
  };

  const removeAllocation = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  const updateAllocationWeight = (id: string, weight: number) => {
    setAllocations(prev => prev.map(a => 
      a.id === id ? { ...a, currentWeight: weight } : a
    ));
  };

  const optimizePortfolio = () => {
    if (allocations.length === 0) {
      toast.error("Please add at least one asset allocation");
      return;
    }

    const selectedStrategy = PORTFOLIO_STRATEGIES.find(s => s.value === strategy);
    if (!selectedStrategy) return;

    // Simple optimization algorithm based on modern portfolio theory concepts
    const optimizedAllocations = allocations.map(allocation => {
      let suggestedWeight = 0;

      // Base allocation on risk-return profile
      const riskAdjustedReturn = allocation.expectedReturn / (allocation.volatility / 10);
      
      // Strategy-based adjustments
      switch (strategy) {
        case 'conservative':
          suggestedWeight = allocation.riskLevel === 'low' ? riskAdjustedReturn * 2 : riskAdjustedReturn * 0.5;
          break;
        case 'balanced':
          suggestedWeight = riskAdjustedReturn;
          break;
        case 'growth':
          suggestedWeight = allocation.expectedReturn > 8 ? riskAdjustedReturn * 1.5 : riskAdjustedReturn * 0.8;
          break;
        case 'aggressive':
          suggestedWeight = allocation.riskLevel === 'high' ? riskAdjustedReturn * 2 : riskAdjustedReturn;
          break;
        default:
          suggestedWeight = riskAdjustedReturn;
      }

      return { ...allocation, suggestedWeight };
    });

    // Normalize weights to sum to 100%
    const totalWeight = optimizedAllocations.reduce((sum, a) => sum + a.suggestedWeight, 0);
    optimizedAllocations.forEach(allocation => {
      allocation.suggestedWeight = (allocation.suggestedWeight / totalWeight) * 100;
    });

    setAllocations(optimizedAllocations);

    // Calculate portfolio metrics
    const expectedReturn = optimizedAllocations.reduce((sum, a) => 
      sum + (a.suggestedWeight / 100) * a.expectedReturn, 0
    );
    
    const totalRisk = Math.sqrt(
      optimizedAllocations.reduce((sum, a) => 
        sum + Math.pow((a.suggestedWeight / 100) * a.volatility, 2), 0
      )
    );

    const sharpeRatio = expectedReturn / totalRisk;
    const diversificationScore = Math.min(100, (optimizedAllocations.length * 20));

    const metrics: PortfolioMetrics = {
      totalValue: totalPortfolioValue,
      expectedReturn,
      totalRisk,
      sharpeRatio,
      diversificationScore
    };

    onOptimizationComplete(optimizedAllocations, metrics);
    toast.success("Portfolio optimization completed!");
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Portfolio Weight Optimization
          </CardTitle>
          <CardDescription>
            Optimize your property portfolio allocation based on risk-return profiles and investment strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strategy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-value">Total Portfolio Value ($)</Label>
                  <Input
                    id="portfolio-value"
                    type="number"
                    value={totalPortfolioValue}
                    onChange={(e) => setTotalPortfolioValue(Number(e.target.value))}
                    placeholder="10000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Investment Strategy</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTFOLIO_STRATEGIES.map(strat => (
                        <SelectItem key={strat.value} value={strat.value}>
                          {strat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Strategy Description */}
              {strategy && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {PORTFOLIO_STRATEGIES.find(s => s.value === strategy)?.label} Strategy
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {PORTFOLIO_STRATEGIES.find(s => s.value === strategy)?.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Target Return: </span>
                      <span className="text-green-600 dark:text-green-400">
                        {PORTFOLIO_STRATEGIES.find(s => s.value === strategy)?.targetReturn}%
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Max Risk: </span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {PORTFOLIO_STRATEGIES.find(s => s.value === strategy)?.maxRisk}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="allocations" className="space-y-4">
              {/* Add New Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Name</Label>
                      <Input
                        value={customAllocation.name || ''}
                        onChange={(e) => setCustomAllocation(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Property name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select 
                        value={customAllocation.type || ''} 
                        onValueChange={(value) => setCustomAllocation(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSET_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Weight (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={customAllocation.currentWeight || ''}
                        onChange={(e) => setCustomAllocation(prev => ({ ...prev, currentWeight: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={addAssetAllocation} className="w-full">
                        Add Asset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Allocations */}
              {allocations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Allocations</h3>
                  {allocations.map(allocation => (
                    <Card key={allocation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{allocation.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {ASSET_TYPES.find(t => t.value === allocation.type)?.label}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getRiskColor(allocation.riskLevel)}>
                              {getRiskIcon(allocation.riskLevel)}
                              {allocation.riskLevel}
                            </Badge>
                            <Button
                              onClick={() => removeAllocation(allocation.id)}
                              variant="ghost"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-xs">Current Weight</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={allocation.currentWeight}
                                onChange={(e) => updateAllocationWeight(allocation.id, Number(e.target.value))}
                                className="h-8"
                              />
                              <span>%</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Expected Return</Label>
                            <div className="h-8 flex items-center text-green-600 dark:text-green-400">
                              {allocation.expectedReturn}%
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Volatility</Label>
                            <div className="h-8 flex items-center text-orange-600 dark:text-orange-400">
                              {allocation.volatility}%
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Suggested Weight</Label>
                            <div className="h-8 flex items-center">
                              {allocation.suggestedWeight > 0 ? (
                                <div className="flex items-center gap-2 w-full">
                                  <Progress value={allocation.suggestedWeight} className="flex-1" />
                                  <span className="text-xs font-medium">
                                    {allocation.suggestedWeight.toFixed(1)}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Run optimization</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <Button onClick={optimizePortfolio} size="lg" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Optimize Portfolio Weights
              </Button>

              {allocations.some(a => a.suggestedWeight > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allocations.map(allocation => (
                        <div key={allocation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{allocation.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {ASSET_TYPES.find(t => t.value === allocation.type)?.label}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {allocation.suggestedWeight.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${((allocation.suggestedWeight / 100) * totalPortfolioValue).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}