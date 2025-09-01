import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Calculator, FileText, Calendar, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { DCFData, DCFResults } from "@/utils/dcfCalculations";

interface DCFCalculationResultsProps {
  data: DCFData;
  results: DCFResults;
}

export function DCFCalculationResults({ data, results }: DCFCalculationResultsProps) {
  const isProfitable = results.netPresentValue > 0;
  const irrVsDiscount = results.irr - data.discountRate;
  const isPositiveIRR = results.irr > data.discountRate;
  
  const getInvestmentDecision = () => {
    if (results.netPresentValue > 0 && results.irr > data.discountRate && results.profitabilityIndex > 1) {
      return { decision: "ACCEPT", color: "bg-green-500", icon: CheckCircle };
    } else if (results.netPresentValue < 0 || results.irr < data.discountRate || results.profitabilityIndex < 1) {
      return { decision: "REJECT", color: "bg-red-500", icon: AlertTriangle };
    } else {
      return { decision: "REVIEW", color: "bg-yellow-500", icon: AlertTriangle };
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
            <Calculator className="h-6 w-6" />
            DCF Analysis Results
          </CardTitle>
          <p className="text-muted-foreground">
            Investment: {data.propertyName} | Analysis Date: {new Date(data.analysisDate).toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <Card className={`border-l-4 ${isPositiveIRR ? 'border-l-success' : 'border-l-destructive'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Internal Rate of Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${isPositiveIRR ? 'text-success' : 'text-destructive'}`}>
              {(results.irr * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              vs {(data.discountRate * 100).toFixed(2)}% required return
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Profitability Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {results.profitabilityIndex.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {results.profitabilityIndex > 1 ? 'Profitable' : 'Unprofitable'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              Payback Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">
              {results.paybackPeriod.toFixed(1)} yrs
            </p>
            <p className="text-sm text-muted-foreground">
              Discounted: {results.discountedPaybackPeriod.toFixed(1)} yrs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Decision */}
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
                value={Math.max(0, Math.min(100, ((results.irr - 0.05) / 0.15) * 100))} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                IRR Performance: {results.irr > 0.15 ? 'Excellent' : results.irr > 0.1 ? 'Good' : results.irr > 0.05 ? 'Fair' : 'Poor'}
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
              <p className="font-medium">IRR vs Required Return:</p>
              <p className={isPositiveIRR ? 'text-success' : 'text-destructive'}>
                {isPositiveIRR ? `✓ IRR exceeds hurdle rate by ${(irrVsDiscount * 100).toFixed(2)}%` : `✗ IRR below required return by ${Math.abs(irrVsDiscount * 100).toFixed(2)}%`}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded">
              <p className="font-medium">Profitability Index:</p>
              <p className={results.profitabilityIndex > 1 ? 'text-success' : 'text-destructive'}>
                {results.profitabilityIndex > 1 ? `✓ PI > 1.0 (${results.profitabilityIndex.toFixed(2)})` : `✗ PI < 1.0 (${results.profitabilityIndex.toFixed(2)})`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <th className="text-left p-2">Period</th>
                  <th className="text-right p-2">Cash Flow</th>
                  <th className="text-right p-2">Discount Factor</th>
                  <th className="text-right p-2">Present Value</th>
                  <th className="text-right p-2">Cumulative PV</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-muted/20">
                  <td className="p-2 font-medium">0 (Initial)</td>
                  <td className="p-2 text-right text-destructive">-${data.initialInvestment.toLocaleString()}</td>
                  <td className="p-2 text-right">1.0000</td>
                  <td className="p-2 text-right text-destructive">-${data.initialInvestment.toLocaleString()}</td>
                  <td className="p-2 text-right text-destructive">-${data.initialInvestment.toLocaleString()}</td>
                </tr>
                {results.cashFlowBreakdown.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/10">
                    <td className="p-2 font-medium">{item.period}</td>
                    <td className="p-2 text-right">${item.cashFlow.toLocaleString()}</td>
                    <td className="p-2 text-right">{item.discountFactor.toFixed(4)}</td>
                    <td className="p-2 text-right">${item.presentValue.toLocaleString()}</td>
                    <td className="p-2 text-right">${(item.cumulativePV - data.initialInvestment).toLocaleString()}</td>
                  </tr>
                ))}
                {results.terminalValuePV && (
                  <tr className="border-b bg-info/10">
                    <td className="p-2 font-medium">Terminal</td>
                    <td className="p-2 text-right">${data.terminalValue?.toLocaleString()}</td>
                    <td className="p-2 text-right">{(1 / Math.pow(1 + data.discountRate, data.cashFlows.length)).toFixed(4)}</td>
                    <td className="p-2 text-right">${results.terminalValuePV.toLocaleString()}</td>
                    <td className="p-2 text-right">-</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold bg-primary/10">
                  <td className="p-2">Total</td>
                  <td className="p-2 text-right">${(data.cashFlows.reduce((sum, cf) => sum + cf, 0) + (data.terminalValue || 0)).toLocaleString()}</td>
                  <td className="p-2 text-right">-</td>
                  <td className="p-2 text-right">${results.presentValue.toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <span className={results.netPresentValue >= 0 ? 'text-success' : 'text-destructive'}>
                      ${results.netPresentValue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Assumptions & Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analysis Summary & Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Assumptions:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Discount Rate:</span>
                  <span className="font-medium">{(data.discountRate * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Period:</span>
                  <span className="font-medium">{data.cashFlows.length} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Rate:</span>
                  <span className="font-medium">{((data.growthRate || 0) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial Investment:</span>
                  <span className="font-medium">${data.initialInvestment.toLocaleString()}</span>
                </div>
                {data.terminalValue && (
                  <div className="flex justify-between">
                    <span>Terminal Value:</span>
                    <span className="font-medium">${data.terminalValue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Performance Metrics:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Net Present Value:</span>
                  <span className={`font-medium ${isProfitable ? 'text-success' : 'text-destructive'}`}>
                    ${results.netPresentValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Internal Rate of Return:</span>
                  <span className={`font-medium ${isPositiveIRR ? 'text-success' : 'text-destructive'}`}>
                    {(results.irr * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profitability Index:</span>
                  <span className={`font-medium ${results.profitabilityIndex > 1 ? 'text-success' : 'text-destructive'}`}>
                    {results.profitabilityIndex.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Simple Payback:</span>
                  <span className="font-medium">{results.paybackPeriod.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounted Payback:</span>
                  <span className="font-medium">{results.discountedPaybackPeriod.toFixed(1)} years</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}