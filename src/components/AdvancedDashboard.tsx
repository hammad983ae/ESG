import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AdvancedCalculationResults } from "@/utils/advancedCalculations";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calculator, BarChart3, Target, Shield } from "lucide-react";

interface AdvancedDashboardProps {
  results: AdvancedCalculationResults;
}

export function AdvancedDashboard({ results }: AdvancedDashboardProps) {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'Low': return 'default';
      case 'Moderate': case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskColor = (rating: number) => {
    if (rating <= 2) return 'text-success';
    if (rating <= 3) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Advanced Risk Assessment Report</h1>
        <p className="text-lg text-muted-foreground">Comprehensive sustainability and risk analysis with automated calculations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-card to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Sustainability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {results.overallSustainabilityScore.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">/ 10.0</span>
            </div>
            <Progress 
              value={(results.overallSustainabilityScore / 10) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-success/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4 text-success" />
              Energy Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(results.energyEfficiencyScore)}`}>
              {results.energyEfficiencyScore.toFixed(1)}
            </div>
            <Progress 
              value={(results.energyEfficiencyScore / 10) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-info/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-info" />
              Financial Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(10 - results.financialRiskScore)}`}>
              {results.financialRiskScore.toFixed(1)}
            </div>
            <Progress 
              value={(results.financialRiskScore / 10) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" />
              Climate Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={getRiskBadgeVariant(results.climateRiskLevel)}>
                {results.climateRiskLevel}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {results.climateRiskDetails.overallScore.toFixed(0)}/100
              </span>
            </div>
            <Progress 
              value={results.climateRiskDetails.overallScore} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Overall Risk Rating */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Overall Risk Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold flex items-center gap-3">
                <span className={getRiskColor(results.overallRiskRating)}>
                  {results.overallRiskRating}
                </span>
                <Badge variant={getRiskBadgeVariant(results.riskLevel)} className="text-lg px-3 py-1">
                  {results.riskLevel} Risk
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive Property and Financial Risk Rating (1-5 scale)
              </p>
            </div>
            <div className="text-right">
              {results.riskLevel === 'Low' && <CheckCircle className="h-12 w-12 text-success" />}
              {results.riskLevel === 'Moderate' && <TrendingUp className="h-12 w-12 text-warning" />}
              {results.riskLevel === 'High' && <TrendingDown className="h-12 w-12 text-destructive" />}
            </div>
          </div>
          <Progress 
            value={(results.overallRiskRating / 5) * 100} 
            className="h-4"
          />
        </CardContent>
      </Card>

      {/* Detailed Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sustainability Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              Sustainability Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Rating</span>
                <span className={`font-semibold ${getScoreColor(results.detailedBreakdown.sustainabilityComponents.energy)}`}>
                  {results.detailedBreakdown.sustainabilityComponents.energy.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.detailedBreakdown.sustainabilityComponents.energy / 10) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">NABERS (normalized)</span>
                <span className={`font-semibold ${getScoreColor(results.detailedBreakdown.sustainabilityComponents.nabers)}`}>
                  {results.detailedBreakdown.sustainabilityComponents.nabers.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.detailedBreakdown.sustainabilityComponents.nabers / 10) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Green Star (normalized)</span>
                <span className={`font-semibold ${getScoreColor(results.detailedBreakdown.sustainabilityComponents.greenStar)}`}>
                  {results.detailedBreakdown.sustainabilityComponents.greenStar.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.detailedBreakdown.sustainabilityComponents.greenStar / 10) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Water Conservation</span>
                <span className={`font-semibold ${getScoreColor(results.waterConservationScore)}`}>
                  {results.waterConservationScore.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.waterConservationScore / 10) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Waste Management</span>
                <span className={`font-semibold ${getScoreColor(results.wasteReductionScore)}`}>
                  {results.wasteReductionScore.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.wasteReductionScore / 10) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Sustainable Materials</span>
                <span className={`font-semibold ${getScoreColor(results.materialsScore)}`}>
                  {results.materialsScore.toFixed(1)}
                </span>
              </div>
              <Progress value={(results.materialsScore / 10) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Climate Risk Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Climate Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(results.climateRiskDetails).filter(([key]) => key !== 'overallScore').map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')} Risk</span>
                  <Badge variant={getRiskBadgeVariant(value as string)} className="text-xs">
                    {value}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Overall Climate Risk Score</span>
                <span className="font-bold">{results.climateRiskDetails.overallScore.toFixed(1)}/100</span>
              </div>
              <Progress value={results.climateRiskDetails.overallScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEIFA and Risk Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Socioeconomic Index (SEIFA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {results.seifaScore}
              </div>
              <p className="text-sm text-muted-foreground">
                SEIFA Score (500-1500 range)
              </p>
              <div className="mt-3">
                <Progress 
                  value={((results.seifaScore - 500) / 1000) * 100} 
                  className="h-3"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {results.seifaScore >= 1100 ? 'High socioeconomic area' : 
                 results.seifaScore >= 900 ? 'Medium socioeconomic area' : 
                 'Lower socioeconomic area'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Component Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Climate Risk Component</span>
                <span className="font-semibold">
                  {(results.detailedBreakdown.riskComponents.climate * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={results.detailedBreakdown.riskComponents.climate * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Financial Risk Component</span>
                <span className="font-semibold">
                  {(results.detailedBreakdown.riskComponents.financial * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={results.detailedBreakdown.riskComponents.financial * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">ESG Risk Component</span>
                <span className="font-semibold">
                  {(results.detailedBreakdown.riskComponents.esg * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={results.detailedBreakdown.riskComponents.esg * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Calculation Formulas */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Formulas Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded">
                <strong>Overall Sustainability Score:</strong><br />
                (Energy_Weight × Energy_Rating + NABERS_Weight × NABERS_Normalized + Green_Star_Weight × GreenStar_Normalized) / Total_Weights
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <strong>Energy Efficiency Score:</strong><br />
                AVERAGE(Solar_Panels, Insulation, LED_Lighting, HVAC_Efficiency, Smart_Systems, Energy_Management)
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <strong>Water Conservation Score:</strong><br />
                AVERAGE(All_Water_Strategy_Scores)
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded">
                <strong>Materials Score:</strong><br />
                MIN(10, (Eco_Friendly_Materials / Total_Materials) × 10)
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <strong>Climate Risk Level:</strong><br />
                IF(Risk &gt; Threshold×1.5, "High", IF(Risk &gt; Threshold, "Medium", "Low"))
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <strong>Overall Risk Rating:</strong><br />
                ROUND((Climate_Weight × Climate_Risk + Financial_Weight × Financial_Risk + ESG_Weight × ESG_Risk) × 4 + 1)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}