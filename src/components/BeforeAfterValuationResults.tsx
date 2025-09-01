import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Calculator, FileText, Calendar, ArrowRight } from "lucide-react";
import { BeforeAfterValuationData } from "./BeforeAfterValuationForm";

interface BeforeAfterValuationResultsProps {
  data: BeforeAfterValuationData;
}

export function BeforeAfterValuationResults({ data }: BeforeAfterValuationResultsProps) {
  const isPositiveChange = data.changeImpact >= 0;
  const absPercentageChange = Math.abs(data.percentageChange);
  
  const getChangeCategory = () => {
    if (absPercentageChange < 5) return "Minor";
    if (absPercentageChange < 15) return "Moderate";
    if (absPercentageChange < 30) return "Significant";
    return "Major";
  };

  const getImpactLevel = () => {
    const category = getChangeCategory();
    if (category === "Minor") return { level: "Low", color: "bg-blue-500" };
    if (category === "Moderate") return { level: "Medium", color: "bg-yellow-500" };
    if (category === "Significant") return { level: "High", color: "bg-orange-500" };
    return { level: "Very High", color: "bg-red-500" };
  };

  const impact = getImpactLevel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-success/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Before & After Valuation Analysis
          </CardTitle>
          <p className="text-muted-foreground">
            Property: {data.propertyName} | Analysis Date: {new Date(data.valuationDate).toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Before Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">${data.beforeValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Original Property Value</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${isPositiveChange ? 'border-l-success' : 'border-l-destructive'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {isPositiveChange ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
              Value Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${isPositiveChange ? 'text-success' : 'text-destructive'}`}>
              {isPositiveChange ? '+' : ''}${data.changeImpact.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.percentageChange.toFixed(2)}% change
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              After Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">${data.afterValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Adjusted Property Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Change Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Change Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label>Change Type</Label>
                <Badge variant="outline" className="ml-2 capitalize">
                  {data.changeType.replace('-', ' ')}
                </Badge>
              </div>
              
              <div>
                <Label>Impact Category</Label>
                <Badge className={`ml-2 text-white ${impact.color}`}>
                  {getChangeCategory()} ({impact.level} Impact)
                </Badge>
              </div>
              
              <div>
                <Label>Change Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{data.changeDescription}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Percentage Change Distribution</Label>
                <div className="mt-2">
                  <Progress 
                    value={absPercentageChange} 
                    className="h-3" 
                    max={50}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {absPercentageChange.toFixed(1)}% of 50% scale
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calculation Formula</p>
                <p className="text-sm font-mono">
                  After Value = Before Value + Change Impact
                </p>
                <p className="text-sm font-mono">
                  ${data.afterValue.toLocaleString()} = ${data.beforeValue.toLocaleString()} {data.changeImpact >= 0 ? '+' : ''} ${data.changeImpact.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Analysis & Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Reason for Valuation Change:</Label>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {data.reasonForChange}
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Valuation Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Analysis Date:</p>
                  <p className="font-medium">{new Date(data.valuationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Net Change:</p>
                  <p className={`font-medium ${isPositiveChange ? 'text-success' : 'text-destructive'}`}>
                    {isPositiveChange ? '+' : ''}${data.changeImpact.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Impact Level:</p>
                  <p className="font-medium">{getChangeCategory()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}