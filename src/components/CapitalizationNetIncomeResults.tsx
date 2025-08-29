import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus, Calculator, DollarSign, Target } from "lucide-react";
import { CapitalizationNetIncomeInputs, CapitalizationNetIncomeResults } from "@/utils/advancedCalculations";

interface CapitalizationNetIncomeResultsDisplayProps {
  results: CapitalizationNetIncomeResults;
  inputs: CapitalizationNetIncomeInputs;
}

const formatCurrency = (amount: number | null): string => {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export function CapitalizationNetIncomeResultsDisplay({ 
  results, 
  inputs 
}: CapitalizationNetIncomeResultsDisplayProps) {
  
  const scenarios = [
    {
      name: "Optimistic",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      rate: inputs.capitalizationRateOptimistic,
      beforeAdjustments: results.calculations.optimistic.beforeAdjustments,
      afterAdjustments: results.optimisticMarketValueRounded,
      calculations: results.calculations.optimistic
    },
    {
      name: "Realistic", 
      icon: Minus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      rate: inputs.capitalizationRateRealistic,
      beforeAdjustments: results.calculations.realistic.beforeAdjustments,
      afterAdjustments: results.realisticMarketValueRounded,
      calculations: results.calculations.realistic
    },
    {
      name: "Pessimistic",
      icon: TrendingDown,
      color: "text-red-600", 
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      rate: inputs.capitalizationRatePessimistic,
      beforeAdjustments: results.calculations.pessimistic.beforeAdjustments,
      afterAdjustments: results.pessimisticMarketValueRounded,
      calculations: results.calculations.pessimistic
    }
  ];

  const validScenarios = scenarios.filter(s => s.rate !== undefined && s.afterAdjustments !== null);
  const marketValues = validScenarios.map(s => s.afterAdjustments).filter(v => v !== null) as number[];
  const minValue = Math.min(...marketValues);
  const maxValue = Math.max(...marketValues);
  const range = maxValue - minValue;
  const rangePercentage = range > 0 ? ((range / minValue) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Capitalization of Net Income Analysis Results
          </CardTitle>
          <CardDescription>
            Property valuation sensitivity analysis using the income capitalization approach
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Operating Income</p>
                <p className="text-2xl font-bold">{formatCurrency(results.noi)}</p>
              </div>
              <Calculator className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capital Adjustments</p>
                <p className="text-2xl font-bold">{formatCurrency(results.capitalAdjustments)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valuation Range</p>
                <p className="text-2xl font-bold">{formatCurrency(maxValue - minValue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Range %</p>
                <p className="text-2xl font-bold">{rangePercentage}%</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          if (scenario.rate === undefined) return null;
          
          const Icon = scenario.icon;
          const isAvailable = scenario.afterAdjustments !== null;
          
          return (
            <Card key={scenario.name} className={`${scenario.borderColor} border-2`}>
              <CardHeader className={scenario.bgColor}>
                <CardTitle className={`flex items-center gap-2 ${scenario.color}`}>
                  <Icon className="w-5 h-5" />
                  {scenario.name} Scenario
                </CardTitle>
                <CardDescription>
                  Cap Rate: {formatPercentage(scenario.rate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isAvailable ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Market Value (Before Adjustments)</span>
                        <span className="font-medium">{formatCurrency(scenario.beforeAdjustments)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Less: Capital Adjustments</span>
                        <span className="font-medium text-red-600">-{formatCurrency(results.capitalAdjustments)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Final Market Value</span>
                        <Badge variant="outline" className={`${scenario.color} text-lg px-3 py-1`}>
                          {formatCurrency(scenario.afterAdjustments)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Badge variant="secondary">No rate provided</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calculation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Income Components</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Net Rent (Annual)</span>
                  <span>{formatCurrency(inputs.netRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less: NROGS</span>
                  <span className="text-red-600">-{formatCurrency(inputs.nrogs || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Net Operating Income</span>
                  <span>{formatCurrency(results.noi)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Capital Adjustments</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Letting Up Allowance</span>
                  <span>{formatCurrency(inputs.lettingUpAllowance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Capital Adjustments</span>
                  <span>{formatCurrency(inputs.otherCapitalAdjustments || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reletting Costs</span>
                  <span>{formatCurrency(inputs.relettingCosts || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Adjustments</span>
                  <span>{formatCurrency(results.capitalAdjustments)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}