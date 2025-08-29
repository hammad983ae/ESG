import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, DollarSign, Calculator } from "lucide-react";
import { CapitalizationSensitivityResults, CapitalizationSensitivityInputs, formatCurrency } from "@/utils/esgCalculations";

interface CapitalizationSensitivityResultsDisplayProps {
  results: CapitalizationSensitivityResults;
  inputs: CapitalizationSensitivityInputs;
}

export const CapitalizationSensitivityResultsDisplay = ({ 
  results, 
  inputs 
}: CapitalizationSensitivityResultsDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Capitalization Rate Sensitivity Analysis
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {results.useESGMode ? 'ESG Mode' : 'Traditional Mode'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Net Operating Income: {formatCurrency(results.noi)}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Results Display */}
      {results.useESGMode ? (
        // ESG Mode Results
        <Card className="border border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              ESG-Adjusted Valuation
            </CardTitle>
            <CardDescription>
              Using ESG-adjusted ARY of {results.esgAdjustedARY}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            {'esg' in results.scenarios && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Capitalization Rate</div>
                    <div className="text-2xl font-bold text-green-700">
                      {results.scenarios.esg.capRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Market Value</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(results.scenarios.esg.marketValue)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Adjusted Value</div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(results.scenarios.esg.adjustedValue)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">ESG Benefits</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Incorporates sustainability risk premiums</li>
                    <li>• Reflects market preference for ESG-compliant properties</li>
                    <li>• Single optimized capitalization rate based on ESG performance</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Traditional Mode Results
        <div className="space-y-4">
          {'optimistic' in results.scenarios && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Sensitivity Analysis Results
                  </CardTitle>
                  <CardDescription>
                    Three-scenario valuation based on market capitalization rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Optimistic Scenario */}
                    <Card className="border border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-700">Optimistic</CardTitle>
                        <CardDescription>Best case scenario</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Cap Rate:</span>
                            <span className="font-semibold">{results.scenarios.optimistic.capRate.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Market Value:</span>
                            <span className="font-semibold">{formatCurrency(results.scenarios.optimistic.marketValue)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Adjusted Value:</span>
                            <span className="font-bold text-green-700">
                              {formatCurrency(results.scenarios.optimistic.adjustedValue)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Realistic Scenario */}
                    <Card className="border border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-700">Realistic</CardTitle>
                        <CardDescription>Most likely scenario</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Cap Rate:</span>
                            <span className="font-semibold">{results.scenarios.realistic.capRate.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Market Value:</span>
                            <span className="font-semibold">{formatCurrency(results.scenarios.realistic.marketValue)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Adjusted Value:</span>
                            <span className="font-bold text-blue-700">
                              {formatCurrency(results.scenarios.realistic.adjustedValue)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pessimistic Scenario */}
                    <Card className="border border-red-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-red-700">Pessimistic</CardTitle>
                        <CardDescription>Worst case scenario</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Cap Rate:</span>
                            <span className="font-semibold">{results.scenarios.pessimistic.capRate.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Market Value:</span>
                            <span className="font-semibold">{formatCurrency(results.scenarios.pessimistic.marketValue)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Adjusted Value:</span>
                            <span className="font-bold text-red-700">
                              {formatCurrency(results.scenarios.pessimistic.adjustedValue)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Valuation Range Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Highest Value</div>
                      <div className="font-bold text-green-600">
                        {formatCurrency(results.scenarios.optimistic.adjustedValue)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Lowest Value</div>
                      <div className="font-bold text-red-600">
                        {formatCurrency(results.scenarios.pessimistic.adjustedValue)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Value Range</div>
                      <div className="font-bold">
                        {formatCurrency(results.scenarios.optimistic.adjustedValue - results.scenarios.pessimistic.adjustedValue)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Range %</div>
                      <div className="font-bold">
                        {(((results.scenarios.optimistic.adjustedValue - results.scenarios.pessimistic.adjustedValue) / results.scenarios.realistic.adjustedValue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Calculation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Net Rent: </span>
              <span className="font-medium">{formatCurrency(inputs.netRent)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">NROGS: </span>
              <span className="font-medium">{formatCurrency(inputs.nrogs)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">NOI: </span>
              <span className="font-medium">{formatCurrency(results.noi)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Letting Up: </span>
              <span className="font-medium">{formatCurrency(inputs.lettingUpAllowance)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Capital Adj: </span>
              <span className="font-medium">{formatCurrency(inputs.otherCapitalAdjustments)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Reletting: </span>
              <span className="font-medium">{formatCurrency(inputs.relettingCosts)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};