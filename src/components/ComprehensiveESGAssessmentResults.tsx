import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Leaf, Users, Building, TrendingUp, TrendingDown, Download, AlertCircle, CheckCircle2, Target } from "lucide-react";
import { ComprehensiveESGResults } from "@/utils/comprehensiveESGCalculations";
import { exportESGChecklist } from "@/utils/comprehensiveESGCalculations";

interface ComprehensiveESGAssessmentResultsProps {
  results: ComprehensiveESGResults;
}

export const ComprehensiveESGAssessmentResults: React.FC<ComprehensiveESGAssessmentResultsProps> = ({ results }) => {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatAdjustment = (value: number) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.8) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 0.6) return { variant: 'secondary' as const, label: 'Good' };
    if (score >= 0.4) return { variant: 'outline' as const, label: 'Fair' };
    return { variant: 'destructive' as const, label: 'Poor' };
  };

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'high': return { variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' };
      case 'medium': return { variant: 'secondary' as const, icon: Target, color: 'text-yellow-600' };
      default: return { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' };
    }
  };

  const handleExportChecklist = () => {
    const checklist = exportESGChecklist(results);
    const blob = new Blob([checklist], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ESG_Assessment_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categoryData = [
    {
      name: 'Environmental',
      icon: Leaf,
      score: results.environmental_score,
      adjustment: results.category_adjustments.environmental,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      factors: results.factor_details.filter(f => f.category === 'environmental')
    },
    {
      name: 'Social',
      icon: Users,
      score: results.social_score,
      adjustment: results.category_adjustments.social,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      factors: results.factor_details.filter(f => f.category === 'social')
    },
    {
      name: 'Governance',
      icon: Building,
      score: results.governance_score,
      adjustment: results.category_adjustments.governance,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      factors: results.factor_details.filter(f => f.category === 'governance')
    }
  ];

  const confidenceBadge = getConfidenceBadge(results.confidence_level);
  const ConfidenceIcon = confidenceBadge.icon;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall ESG Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-primary">
                {formatPercentage(results.overall_esg_score)}
              </div>
              <Badge {...getScoreBadge(results.overall_esg_score)}>
                {getScoreBadge(results.overall_esg_score).label}
              </Badge>
              <Progress value={results.overall_esg_score * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Valuation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className={`text-2xl font-bold ${results.valuation_adjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatAdjustment(results.valuation_adjustment)}
              </div>
              <div className="flex items-center justify-center gap-1">
                {results.valuation_adjustment >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {results.valuation_adjustment >= 0 ? 'Premium' : 'Discount'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Assessment Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <ConfidenceIcon className={`h-5 w-5 ${confidenceBadge.color}`} />
                <Badge variant={confidenceBadge.variant}>
                  {results.confidence_level.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Confidence Level
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Category Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of Environmental, Social, and Governance performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryData.map((category, index) => {
            const Icon = category.icon;
            const scoreBadge = getScoreBadge(category.score);
            
            return (
              <div key={category.name} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <Icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.factors.length} factors assessed
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${getScoreColor(category.score)}`}>
                        {formatPercentage(category.score)}
                      </span>
                      <Badge variant={scoreBadge.variant}>{scoreBadge.label}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Impact: {formatAdjustment(category.adjustment)}
                    </div>
                  </div>
                </div>
                
                <Progress value={category.score * 100} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {category.factors.map(factor => (
                    <div key={factor.id} className="text-center p-2 bg-muted/30 rounded">
                      <div className="text-xs font-medium truncate" title={factor.name}>
                        {factor.name}
                      </div>
                      <div className={`text-sm font-semibold ${getScoreColor(factor.score)}`}>
                        {formatPercentage(factor.score)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {index < categoryData.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Detailed Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Factor Analysis</CardTitle>
          <CardDescription>
            Individual factor scores, weights, and potential impact on property valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.factor_details.map(factor => {
              const categoryInfo = categoryData.find(cat => cat.name.toLowerCase() === factor.category);
              const Icon = categoryInfo?.icon || Building;
              
              return (
                <div key={factor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`h-4 w-4 ${categoryInfo?.color || 'text-gray-600'}`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{factor.name}</h4>
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className={`font-semibold ${getScoreColor(factor.score)}`}>
                        {formatPercentage(factor.score)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Weight</div>
                      <div className="font-semibold">{formatPercentage(factor.weight)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Max Impact</div>
                      <div className="font-semibold">±{formatPercentage(factor.impact_range)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations for Improvement</CardTitle>
          <CardDescription>
            Actionable suggestions to enhance ESG performance and property valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Documentation</CardTitle>
          <CardDescription>
            Generate comprehensive reports and documentation for stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleExportChecklist} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Assessment Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};