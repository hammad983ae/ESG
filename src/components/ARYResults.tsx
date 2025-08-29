import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Download, 
  Calculator, 
  Info, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { ARYResults, ARYInputs, formatPercentage, exportARYExcelFormulas } from "@/utils/aryCalculations";

interface ARYResultsProps {
  results: ARYResults;
  inputs: ARYInputs;
}

export const ARYResultsDisplay = ({ results, inputs }: ARYResultsProps) => {
  const { riskFreeRate, totalRiskPremia, allRisksYield, yieldBasedARY, riskBreakdown } = results;

  const exportResults = (format: 'csv' | 'json' | 'excel') => {
    const data = {
      inputs,
      results,
      timestamp: new Date().toISOString(),
      formulas: exportARYExcelFormulas(),
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'csv':
        const csvRows = [
          ['Property Type', inputs.propertyType],
          ['Cash Rate (%)', (inputs.cashRate * 100).toFixed(4)],
          ['Risk-Free Rate (%)', riskFreeRate.toFixed(2)],
          ['Total Risk Premia (%)', totalRiskPremia.toFixed(2)],
          ['All Risks Yield (%)', allRisksYield.toFixed(2)],
          ...(yieldBasedARY ? [['Yield-Based ARY (%)', yieldBasedARY.toFixed(2)]] : []),
          [''],
          ['Risk Factor Breakdown', ''],
          ['Factor', 'Assigned Score', 'Max Premium (%)', 'Calculated Premium (%)'],
          ...riskBreakdown.map(risk => [
            risk.factor,
            risk.assignedScore.toString(),
            risk.maxPremium.toFixed(2),
            risk.calculatedPremium.toFixed(2)
          ])
        ];
        content = csvRows.map(row => row.join(',')).join('\n');
        filename = `ary-calculation-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;

      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `ary-calculation-${Date.now()}.json`;
        mimeType = 'application/json';
        break;

      case 'excel':
        const excelData = {
          ...data,
          instructions: 'Import this data into Excel and use the provided formulas for dynamic calculations'
        };
        content = JSON.stringify(excelData, null, 2);
        filename = `ary-calculation-template-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskLevel = (aryValue: number): { level: string; color: string; icon: React.ReactNode } => {
    if (aryValue < 6) return { level: 'Low Risk', color: 'text-success', icon: <CheckCircle className="w-4 h-4" /> };
    if (aryValue < 10) return { level: 'Moderate Risk', color: 'text-warning', icon: <Info className="w-4 h-4" /> };
    return { level: 'High Risk', color: 'text-destructive', icon: <AlertTriangle className="w-4 h-4" /> };
  };

  const riskAssessment = getRiskLevel(allRisksYield);

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            All Risks Yield Results
          </CardTitle>
          <CardDescription>
            ARY calculated using {inputs.propertyType.toLowerCase()} property risk factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary ARY Result */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPercentage(allRisksYield)}
              </div>
              <p className="text-sm text-muted-foreground mb-2">All Risks Yield</p>
              <Badge variant="outline" className={`${riskAssessment.color} flex items-center gap-1`}>
                {riskAssessment.icon}
                {riskAssessment.level}
              </Badge>
            </div>

            {/* Risk Components */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Risk-Free Rate</span>
                <span className="font-medium">{formatPercentage(riskFreeRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Risk Premia</span>
                <span className="font-medium">{formatPercentage(totalRiskPremia)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>ARY Total</span>
                  <span>{formatPercentage(allRisksYield)}</span>
                </div>
              </div>
            </div>

            {/* Yield Comparison (if available) */}
            {yieldBasedARY && (
              <div className="text-center">
                <div className="text-2xl font-bold text-info mb-2">
                  {formatPercentage(yieldBasedARY)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Yield-Based ARY</p>
                <div className="text-xs">
                  <span className={`${yieldBasedARY > allRisksYield ? 'text-success' : 'text-warning'}`}>
                    {yieldBasedARY > allRisksYield ? 'Above' : 'Below'} risk-adjusted rate
                  </span>
                </div>
              </div>
            )}
          </div>

          {yieldBasedARY && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Comparison:</strong> The yield-based ARY ({formatPercentage(yieldBasedARY)}) 
                {yieldBasedARY > allRisksYield ? ' exceeds' : ' is below'} the risk-adjusted ARY 
                ({formatPercentage(allRisksYield)}), indicating the property is 
                {yieldBasedARY > allRisksYield ? ' potentially undervalued' : ' potentially overvalued'} 
                relative to its risk profile.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">Risk Breakdown</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="export">Export & Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Risk Factor Analysis
              </CardTitle>
              <CardDescription>
                Individual risk premiums contributing to total ARY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskBreakdown.map((risk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{risk.factor}</span>
                      <div className="text-right">
                        <span className="font-semibold">{formatPercentage(risk.calculatedPremium)}</span>
                        <p className="text-xs text-muted-foreground">
                          Score: {risk.assignedScore}/10 × Max: {formatPercentage(risk.maxPremium)}
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={(risk.calculatedPremium / Math.max(...riskBreakdown.map(r => r.calculatedPremium))) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Investment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Risk Assessment</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Total risk premia: {formatPercentage(totalRiskPremia)}</li>
                      <li>• Highest risk factor: {riskBreakdown.reduce((max, risk) => 
                        risk.calculatedPremium > max.calculatedPremium ? risk : max
                      ).factor}</li>
                      <li>• Risk level: {riskAssessment.level}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Market Context</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Property type: {inputs.propertyType}</li>
                      <li>• Current cash rate: {formatPercentage(inputs.cashRate * 100)}</li>
                      <li>• Risk premium above cash rate: {formatPercentage(totalRiskPremia)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Results
              </CardTitle>
              <CardDescription>
                Download calculation results and Excel formulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button onClick={() => exportResults('csv')} variant="outline">
                  Export CSV
                </Button>
                <Button onClick={() => exportResults('json')} variant="outline">
                  Export JSON
                </Button>
                <Button onClick={() => exportResults('excel')} variant="outline">
                  Excel Template
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Excel Formulas
                </h4>
                <div className="bg-muted p-3 rounded text-sm font-mono space-y-1">
                  <div><strong>Risk Premium:</strong> =(Assigned_Risk_Score/10)*Maximum_Risk_Premium</div>
                  <div><strong>Total Risk Premia:</strong> =SUM(All_Risk_Premiums)</div>
                  <div><strong>ARY (Risk-Based):</strong> =Risk_Free_Rate + Total_Risk_Premia</div>
                  <div><strong>ARY (Yield-Based):</strong> =(Annual_Rental_Income/Property_Value)*100</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};