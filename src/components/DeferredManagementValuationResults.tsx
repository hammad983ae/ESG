import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  Calculator, 
  FileText, 
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { DeferredManagementInputs, DeferredManagementResults } from "@/utils/deferredManagementCalculations";

interface DeferredManagementValuationResultsProps {
  inputs: DeferredManagementInputs;
  results: DeferredManagementResults;
}

export function DeferredManagementValuationResults({ inputs, results }: DeferredManagementValuationResultsProps) {
  const isProfitable = results.netPresentValue > 0;
  const isPositiveYield = results.managementYield > (inputs.discountRate * 100);
  
  const getInvestmentDecision = () => {
    if (results.netPresentValue > 0 && results.internalRateOfReturn > inputs.discountRate && results.managementYield > 8) {
      return { decision: "STRONG BUY", color: "bg-green-600", icon: CheckCircle };
    } else if (results.netPresentValue > 0 && results.internalRateOfReturn > inputs.discountRate) {
      return { decision: "BUY", color: "bg-green-500", icon: CheckCircle };
    } else if (results.netPresentValue < -50000 || results.managementYield < 5) {
      return { decision: "AVOID", color: "bg-red-500", icon: AlertTriangle };
    } else {
      return { decision: "HOLD/REVIEW", color: "bg-yellow-500", icon: AlertTriangle };
    }
  };

  const investmentDecision = getInvestmentDecision();
  const DecisionIcon = investmentDecision.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-success/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Deferred Management Valuation Results
          </CardTitle>
          <p className="text-muted-foreground">
            {inputs.propertyName} | Analysis Date: {new Date(inputs.analysisDate).toLocaleDateString()} | {inputs.villageUnits} Units
          </p>
        </CardHeader>
      </Card>

      {/* Key Valuation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Total Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              ${results.totalValuation.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              ${results.valuationPerUnit.toLocaleString()}/unit
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${isProfitable ? 'border-l-success' : 'border-l-destructive'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {isProfitable ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
              Net Present Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${isProfitable ? 'text-success' : 'text-destructive'}`}>
              ${results.netPresentValue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {isProfitable ? 'Value Creating' : 'Value Destroying'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              Management Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">
              {results.managementYield.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              vs {(inputs.discountRate * 100).toFixed(2)}% required return
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-info" />
              IRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-info">
              {(results.internalRateOfReturn * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Payback: {results.paybackPeriod.toFixed(1)} years
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Recommendation */}
      <Card className={`border-2 ${investmentDecision.color.replace('bg-', 'border-')}/30`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DecisionIcon className="h-6 w-6" />
            Investment Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge className={`text-white text-lg px-4 py-2 ${investmentDecision.color}`}>
              {investmentDecision.decision}
            </Badge>
            <div className="flex-1">
              <Progress 
                value={Math.max(0, Math.min(100, (results.managementYield / 15) * 100))} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Yield Performance: {results.managementYield > 12 ? 'Excellent' : results.managementYield > 8 ? 'Good' : results.managementYield > 5 ? 'Fair' : 'Poor'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/30 rounded">
              <p className="font-medium">NPV Analysis:</p>
              <p className={isProfitable ? 'text-success' : 'text-destructive'}>
                {isProfitable ? '✓ Positive NPV - Creates Value' : '✗ Negative NPV - Destroys Value'}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded">
              <p className="font-medium">Yield vs Required Return:</p>
              <p className={isPositiveYield ? 'text-success' : 'text-destructive'}>
                {isPositiveYield ? '✓ Exceeds required return' : '✗ Below required return'}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded">
              <p className="font-medium">Payback Period:</p>
              <p className={results.paybackPeriod < 10 ? 'text-success' : results.paybackPeriod < 15 ? 'text-warning' : 'text-destructive'}>
                {results.paybackPeriod.toFixed(1)} years
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Valuation Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span>Current Asset Value (PV):</span>
              <span className="font-semibold">${results.presentValueCurrentAssets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span>Future Cash Flows (PV):</span>
              <span className="font-semibold">${results.presentValueFutureCashFlows.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span>Deferred Management Value:</span>
              <span className="font-semibold">${results.deferredManagementValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/20 rounded border-t-2 border-primary">
              <span className="font-bold">Total Valuation:</span>
              <span className="font-bold text-primary">${results.totalValuation.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Village Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Units:</p>
                <p className="font-semibold">{inputs.villageUnits}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Occupancy Rate:</p>
                <p className="font-semibold">{inputs.occupancyRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Annual Turnover:</p>
                <p className="font-semibold">{inputs.turnoverRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deferred Fee Rate:</p>
                <p className="font-semibold">{inputs.deferredManagementFeeRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Unit Value:</p>
                <p className="font-semibold">${inputs.averageUnitValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining Term:</p>
                <p className="font-semibold">{inputs.remainingTerm} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Cash Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Year</th>
                  <th className="text-right p-2">Expected Cash Flow</th>
                  <th className="text-right p-2">Turnover Units</th>
                  <th className="text-right p-2">Deferred Fee Income</th>
                  <th className="text-right p-2">Present Value</th>
                  <th className="text-right p-2">Cumulative PV</th>
                </tr>
              </thead>
              <tbody>
                {results.cashFlowBreakdown.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/10">
                    <td className="p-2 font-medium">{item.year + inputs.deferralPeriod}</td>
                    <td className="p-2 text-right">${item.expectedCashFlow.toLocaleString()}</td>
                    <td className="p-2 text-right">{Math.round(item.turnoverUnits)}</td>
                    <td className="p-2 text-right">${item.deferredFeeIncome.toLocaleString()}</td>
                    <td className="p-2 text-right">${item.discountedValue.toLocaleString()}</td>
                    <td className="p-2 text-right">${item.cumulativeValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold bg-primary/10">
                  <td className="p-2">Total</td>
                  <td className="p-2 text-right">
                    ${results.cashFlowBreakdown.reduce((sum, item) => sum + item.expectedCashFlow, 0).toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    {Math.round(results.cashFlowBreakdown.reduce((sum, item) => sum + item.turnoverUnits, 0))}
                  </td>
                  <td className="p-2 text-right">
                    ${results.cashFlowBreakdown.reduce((sum, item) => sum + item.deferredFeeIncome, 0).toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    <span className="text-primary font-bold">
                      ${results.presentValueFutureCashFlows.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-2 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sensitivity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Turnover Rate Sensitivity</h4>
              <div className="space-y-2 text-sm">
                {results.sensitivityAnalysis.turnoverRateVariation.map((item, index) => (
                  <div key={index} className="flex justify-between p-2 bg-muted/20 rounded">
                    <span>{item.rate.toFixed(1)}%:</span>
                    <span className="font-medium">${(item.valuation / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Discount Rate Sensitivity</h4>
              <div className="space-y-2 text-sm">
                {results.sensitivityAnalysis.discountRateVariation.map((item, index) => (
                  <div key={index} className="flex justify-between p-2 bg-muted/20 rounded">
                    <span>{item.rate.toFixed(1)}%:</span>
                    <span className="font-medium">${(item.valuation / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Occupancy Rate Sensitivity</h4>
              <div className="space-y-2 text-sm">
                {results.sensitivityAnalysis.occupancyVariation.map((item, index) => (
                  <div key={index} className="flex justify-between p-2 bg-muted/20 rounded">
                    <span>{item.occupancy.toFixed(0)}%:</span>
                    <span className="font-medium">${(item.valuation / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excel Formulas Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Excel Formulas Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono bg-muted/20 p-4 rounded">
            <div>
              <p className="font-sans font-medium mb-2">Deferred Present Value:</p>
              <p className="text-xs break-all">{results.excelFormulas.deferredPV}</p>
            </div>
            <div>
              <p className="font-sans font-medium mb-2">Total Valuation:</p>
              <p className="text-xs break-all">{results.excelFormulas.totalValuation}</p>
            </div>
            <div>
              <p className="font-sans font-medium mb-2">Management Yield:</p>
              <p className="text-xs break-all">{results.excelFormulas.managementYield}</p>
            </div>
            <div>
              <p className="font-sans font-medium mb-2">Sensitivity Formula:</p>
              <p className="text-xs break-all">{results.excelFormulas.sensitivityFormula}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}