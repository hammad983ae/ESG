import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Leaf, TrendingUp, TrendingDown, Award } from "lucide-react";
import { ESGResults, ESGInputs, getESGRatingColor } from "@/utils/esgCalculations";

interface ESGResultsDisplayProps {
  results: ESGResults;
  inputs: ESGInputs;
}

export const ESGResultsDisplay = ({ results, inputs }: ESGResultsDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* Header with ESG Rating */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              ESG Analysis Results
            </div>
            <Badge variant="outline" className={`text-lg px-4 py-2 ${getESGRatingColor(results.esgRating)}`}>
              ESG Rating: {results.esgRating}
            </Badge>
          </CardTitle>
          <CardDescription>
            {inputs.propertyType} property with {results.overallESGScore.toFixed(1)}/100 ESG score
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Base ARY</CardTitle>
            <CardDescription>Standard risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {results.baseARY.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              ESG Adjustment
              {results.esgAdjustment > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>Risk premium adjustment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${results.esgAdjustment > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {results.esgAdjustment > 0 ? '+' : ''}{results.esgAdjustment.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">ESG-Adjusted ARY</CardTitle>
            <CardDescription>Final risk-adjusted yield</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {results.esgAdjustedARY.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Overall ESG Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall ESG Score</span>
            <span className="font-bold text-lg">{results.overallESGScore.toFixed(1)}/100</span>
          </div>
          <Progress value={results.overallESGScore} className="w-full" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Energy Rating</div>
              <div className="font-semibold">{inputs.energyRating}/10</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Water Efficiency</div>
              <div className="font-semibold">{inputs.waterEfficiency}/10</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Waste Reduction</div>
              <div className="font-semibold">{inputs.wasteReduction}/10</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Carbon Score</div>
              <div className="font-semibold">{inputs.carbonFootprint}/10</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factor Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Factor Analysis</CardTitle>
          <CardDescription>Detailed breakdown of ESG-adjusted risk premiums</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.esgRiskBreakdown.map((factor, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{factor.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {factor.riskPremium.toFixed(2)}% premium
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Max Score: </span>
                    {factor.maximumRiskScore}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned: </span>
                    {factor.assignedRiskScore}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Premium: </span>
                    {factor.maximumRiskPremium}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight: </span>
                    {factor.calculationPercentage}%
                  </div>
                </div>
                {index < results.esgRiskBreakdown.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Market Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Estimated Cap Rate Range:</span>
            <span>{(results.esgAdjustedARY - 0.5).toFixed(2)}% - {(results.esgAdjustedARY + 0.5).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">ESG Premium/Discount:</span>
            <span className={results.esgAdjustment < 0 ? 'text-green-600' : 'text-red-600'}>
              {results.esgAdjustment < 0 ? 'Premium for ESG performance' : 'Discount for ESG risks'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Building Certification Level:</span>
            <span>
              {results.esgRating === 'A+' || results.esgRating === 'A' ? 'Green Star/NABERS Certified' : 
               results.esgRating === 'B+' || results.esgRating === 'B' ? 'Above Average Performance' : 
               'Below Market Standards'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};