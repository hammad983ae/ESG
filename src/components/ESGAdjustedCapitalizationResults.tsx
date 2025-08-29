import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { CapitalizationNetIncomeResults, ESGAdjustedCapitalizationInputs } from "@/utils/advancedCalculations";

interface ESGAdjustedCapitalizationResultsProps {
  results: CapitalizationNetIncomeResults;
  inputs: ESGAdjustedCapitalizationInputs;
}

export function ESGAdjustedCapitalizationResultsDisplay({ 
  results, 
  inputs 
}: ESGAdjustedCapitalizationResultsProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const getAdjustedRate = (originalRate: number) => {
    if (!inputs.useEsgAdjustment || !inputs.esgAdjustmentFactor) {
      return originalRate;
    }
    return originalRate + inputs.esgAdjustmentFactor;
  };

  const scenarios = [
    {
      name: "Optimistic",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      originalRate: inputs.capitalizationRateOptimistic,
      adjustedRate: getAdjustedRate(inputs.capitalizationRateOptimistic),
      marketValue: results.calculations.optimistic.beforeAdjustments,
      adjustedValue: results.optimisticMarketValueRounded,
    },
    {
      name: "Realistic",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      originalRate: inputs.capitalizationRateRealistic,
      adjustedRate: inputs.capitalizationRateRealistic ? getAdjustedRate(inputs.capitalizationRateRealistic) : null,
      marketValue: results.calculations.realistic.beforeAdjustments,
      adjustedValue: results.realisticMarketValueRounded,
    },
    {
      name: "Pessimistic",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      originalRate: inputs.capitalizationRatePessimistic,
      adjustedRate: getAdjustedRate(inputs.capitalizationRatePessimistic),
      marketValue: results.calculations.pessimistic.beforeAdjustments,
      adjustedValue: results.pessimisticMarketValueRounded,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ESG Adjustment Summary */}
      {inputs.useEsgAdjustment && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Leaf className="w-5 h-5" />
              ESG Adjustment Applied
            </CardTitle>
            <CardDescription>
              {inputs.esgAdjustmentFactor && inputs.esgAdjustmentFactor !== 0 ? (
                <>
                  ESG factor of <strong>{formatRate(inputs.esgAdjustmentFactor)}</strong> has been 
                  {inputs.esgAdjustmentFactor > 0 ? ' added to' : ' subtracted from'} all capitalization rates
                </>
              ) : (
                "ESG adjustment enabled with zero factor - no rate changes applied"
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Net Operating Income */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Net Operating Income Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Net Rent</p>
              <p className="text-xl font-semibold">{formatCurrency(inputs.netRent)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">NROGS</p>
              <p className="text-xl font-semibold">{formatCurrency(inputs.nrogs || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Net Operating Income</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(results.noi)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => {
          const IconComponent = scenario.icon;
          
          if (scenario.originalRate === undefined || scenario.originalRate === null) {
            return (
              <Card key={index} className="opacity-50">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${scenario.color}`}>
                    <IconComponent className="w-5 h-5" />
                    {scenario.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">No data provided</p>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={index} className={`${scenario.borderColor} ${scenario.bgColor}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scenario.color}`}>
                  <IconComponent className="w-5 h-5" />
                  {scenario.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capitalization Rates */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Original Cap Rate:</span>
                    <span className="font-medium">{formatRate(scenario.originalRate)}</span>
                  </div>
                  {inputs.useEsgAdjustment && inputs.esgAdjustmentFactor && inputs.esgAdjustmentFactor !== 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ESG-Adjusted Rate:</span>
                      <Badge variant="outline" className="text-green-700 bg-green-100">
                        {formatRate(scenario.adjustedRate || 0)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Market Values */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market Value:</span>
                    <span className="font-medium">{formatCurrency(scenario.marketValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capital Adjustments:</span>
                    <span className="font-medium">-{formatCurrency(results.capitalAdjustments)}</span>
                  </div>
                </div>

                {/* Final Value */}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Final Value:</span>
                    <span className={`text-xl font-bold ${scenario.color}`}>
                      {formatCurrency(scenario.adjustedValue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Range Summary</CardTitle>
          <CardDescription>
            {inputs.useEsgAdjustment 
              ? "Range of property values with ESG risk adjustments applied"
              : "Range of property values based on different market scenarios"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.optimisticMarketValueRounded && results.pessimisticMarketValueRounded && (
              <>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valuation Range</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(results.pessimisticMarketValueRounded)} - {formatCurrency(results.optimisticMarketValueRounded)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Range Spread</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(results.optimisticMarketValueRounded - results.pessimisticMarketValueRounded)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Mid-Point</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency((results.optimisticMarketValueRounded + results.pessimisticMarketValueRounded) / 2)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}