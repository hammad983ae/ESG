import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, DollarSign, Leaf, TrendingUp, BarChart3, Target } from "lucide-react";
import { ESGWeightedSalesResults, ESGWeightedSalesInputs } from "@/utils/comparableSalesCalculations";

interface ESGComparableSalesResultsProps {
  results: ESGWeightedSalesResults;
  inputs: ESGWeightedSalesInputs;
}

export function ESGComparableSalesResultsDisplay({ 
  results, 
  inputs 
}: ESGComparableSalesResultsProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getESGScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getWeightFactorColor = (weight: number) => {
    if (weight >= 0.7) return "text-green-600 bg-green-100";
    if (weight >= 0.5) return "text-blue-600 bg-blue-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="w-6 h-6" />
            ESG-Weighted Valuation Summary
          </CardTitle>
          <CardDescription>
            Property valuation incorporating ESG sustainability factors and comparable sales analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Recommended Value</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.recommendedValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average Market Value</p>
              <p className="text-2xl font-semibold">{formatCurrency(results.averageAdjustedPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ESG Premium/Discount</p>
              <p className={`text-2xl font-semibold ${results.esgImpactAnalysis.averageESGPremium >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.esgImpactAnalysis.averageESGPremium >= 0 ? '+' : ''}{formatPercent(results.esgImpactAnalysis.averageESGPremium)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Comparable Sales</p>
              <p className="text-2xl font-semibold">{results.comparableResults.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Property */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Subject Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{results.subjectProperty.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <Badge variant="outline">{results.subjectProperty.propertyType}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Floor Area</p>
              <p className="font-medium">{results.subjectProperty.floorArea.toLocaleString()} sqm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Range Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Valuation Range Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Minimum Value</p>
              <p className="text-xl font-semibold text-red-600">{formatCurrency(results.priceRange.minimum)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Median Value</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(results.priceRange.median)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Maximum Value</p>
              <p className="text-xl font-semibold text-green-600">{formatCurrency(results.priceRange.maximum)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Value Range</span>
              <span>{formatCurrency(results.priceRange.maximum - results.priceRange.minimum)} spread</span>
            </div>
            <div className="relative">
              <div className="w-full h-4 bg-gradient-to-r from-red-200 via-blue-200 to-green-200 rounded-lg"></div>
              <div 
                className="absolute top-0 w-2 h-4 bg-primary rounded-sm transform -translate-x-1"
                style={{
                  left: `${((results.recommendedValue - results.priceRange.minimum) / 
                           (results.priceRange.maximum - results.priceRange.minimum)) * 100}%`
                }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <Badge variant="secondary">Recommended Value Position</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Comparable Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Comparable Sales Analysis
          </CardTitle>
          <CardDescription>
            Detailed breakdown of each comparable sale with ESG adjustments applied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.comparableResults.map((comparable, index) => (
              <Card key={comparable.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Comparable Sale #{index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getESGScoreColor(comparable.esgScore)}>
                        ESG Score: {comparable.esgScore.toFixed(1)}
                      </Badge>
                      <Badge className={getWeightFactorColor(comparable.weightFactor)}>
                        Weight: {(comparable.weightFactor * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{comparable.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Sale Information */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Original Sale Price</p>
                      <p className="text-lg font-semibold">{formatCurrency(comparable.originalSalePrice)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">ESG Value Impact</p>
                      <p className={`text-lg font-semibold ${comparable.esgValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {comparable.esgValue >= 0 ? '+' : ''}{formatCurrency(comparable.esgValue)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Weighted Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(comparable.weightedValue)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Final Adjusted Price</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(comparable.finalAdjustedPrice)}</p>
                    </div>
                  </div>

                  {/* ESG Score Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ESG Performance Score</span>
                      <span className="text-sm">{comparable.esgScore.toFixed(1)}/100</span>
                    </div>
                    <Progress value={comparable.esgScore} className="h-2" />
                  </div>

                  {/* Adjustment Factors */}
                  {Object.keys(comparable.adjustedFactorValues).length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium">Applied Adjustments</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(comparable.adjustedFactorValues).map(([factor, value]) => (
                          <div key={factor} className="flex justify-between items-center py-1 px-2 bg-muted rounded text-sm">
                            <span className="truncate mr-2" title={factor}>
                              {factor.length > 25 ? `${factor.substring(0, 25)}...` : factor}
                            </span>
                            <Badge variant="outline" className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {value >= 0 ? '+' : ''}{value.toFixed(0)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ESG Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            ESG Impact Analysis
          </CardTitle>
          <CardDescription>
            Quantified impact of environmental, social, and governance factors on property values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-4">
              <h4 className="font-medium">ESG Score Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Minimum ESG Score:</span>
                  <Badge className={getESGScoreColor(results.esgImpactAnalysis.esgScoreRange.min)}>
                    {results.esgImpactAnalysis.esgScoreRange.min.toFixed(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maximum ESG Score:</span>
                  <Badge className={getESGScoreColor(results.esgImpactAnalysis.esgScoreRange.max)}>
                    {results.esgImpactAnalysis.esgScoreRange.max.toFixed(1)}
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(results.esgImpactAnalysis.esgScoreRange.max - results.esgImpactAnalysis.esgScoreRange.min)} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Score Range: {(results.esgImpactAnalysis.esgScoreRange.max - results.esgImpactAnalysis.esgScoreRange.min).toFixed(1)} points
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Weight Factor Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Minimum Weight:</span>
                  <Badge variant="outline">
                    {(results.esgImpactAnalysis.weightFactorRange.min * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maximum Weight:</span>
                  <Badge variant="outline">
                    {(results.esgImpactAnalysis.weightFactorRange.max * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(results.esgImpactAnalysis.weightFactorRange.max - results.esgImpactAnalysis.weightFactorRange.min) * 100} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Weight Spread: {((results.esgImpactAnalysis.weightFactorRange.max - results.esgImpactAnalysis.weightFactorRange.min) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Market Premium Analysis</h4>
              <div className="text-center">
                <div className={`text-3xl font-bold ${results.esgImpactAnalysis.averageESGPremium >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.esgImpactAnalysis.averageESGPremium >= 0 ? '+' : ''}
                  {formatPercent(results.esgImpactAnalysis.averageESGPremium)}
                </div>
                <p className="text-sm text-muted-foreground">Average ESG Impact</p>
                <Badge 
                  className={`mt-2 ${results.esgImpactAnalysis.averageESGPremium >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {results.esgImpactAnalysis.averageESGPremium >= 0 ? 'ESG Premium' : 'ESG Discount'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Valuation Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-sm">
            <p className="mb-4">
              This ESG-weighted comparable sales analysis incorporates sustainability factors into traditional 
              sales comparison methodology through the following process:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>ESG Factor Weighting:</strong> Each property adjustment factor is weighted based on its ESG significance (0.0-1.0 scale)</li>
              <li><strong>ESG Score Calculation:</strong> Comparable properties receive ESG scores (0-100) based on weighted adjustment factors</li>
              <li><strong>Weight Factor Assignment:</strong> Properties with higher ESG scores receive higher weighting factors (0.2-0.8 range)</li>
              <li><strong>Value Adjustment:</strong> Sale prices are adjusted using ESG-weighted factors and normalized across comparables</li>
              <li><strong>Final Valuation:</strong> Recommended value is calculated as a weighted average, giving more influence to ESG-compliant properties</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}