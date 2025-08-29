import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ESGScores } from "@/utils/esgCalculations";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Building, Leaf, Users, Shield } from "lucide-react";

interface ESGDashboardProps {
  scores: ESGScores;
  propertyName: string;
}

export function ESGDashboard({ scores, propertyName }: ESGDashboardProps) {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'Low': return 'default';
      case 'Moderate': return 'secondary';
      case 'High': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskColor = (rating: number) => {
    if (rating <= 2) return 'text-success';
    if (rating <= 3) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 4) return 'bg-success';
    if (score >= 3) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">ESG Assessment Report</h1>
        <h2 className="text-xl text-muted-foreground">{propertyName}</h2>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-card to-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Overall ESG Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {scores.overallESGScore.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">/ 5.0</span>
            </div>
            <Progress 
              value={(scores.overallESGScore / 5) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-success/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-success" />
              Environmental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.environmental.overall)}`}>
              {scores.environmental.overall.toFixed(1)}
            </div>
            <Progress 
              value={(scores.environmental.overall / 5) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-info/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-info" />
              Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.social.overall)}`}>
              {scores.social.overall.toFixed(1)}
            </div>
            <Progress 
              value={(scores.social.overall / 5) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" />
              Governance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scores.governance.overall)}`}>
              {scores.governance.overall.toFixed(1)}
            </div>
            <Progress 
              value={(scores.governance.overall / 5) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold flex items-center gap-2">
                <span className={getRiskColor(scores.riskRating)}>
                  {scores.riskRating}
                </span>
                <Badge variant={getRiskBadgeVariant(scores.riskLevel)}>
                  {scores.riskLevel} Risk
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Property and Financial Risk Rating (1-5 scale)
              </p>
            </div>
            <div className="text-right">
              {scores.riskLevel === 'Low' && <CheckCircle className="h-8 w-8 text-success" />}
              {scores.riskLevel === 'Moderate' && <TrendingUp className="h-8 w-8 text-warning" />}
              {scores.riskLevel === 'High' && <TrendingDown className="h-8 w-8 text-destructive" />}
            </div>
          </div>
          <Progress 
            value={(scores.riskRating / 5) * 100} 
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Leaf className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Efficiency</span>
                <span className={`font-semibold ${getScoreColor(scores.environmental.energyEfficiency)}`}>
                  {scores.environmental.energyEfficiency.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.environmental.energyEfficiency / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Water Conservation</span>
                <span className={`font-semibold ${getScoreColor(scores.environmental.waterConservation)}`}>
                  {scores.environmental.waterConservation.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.environmental.waterConservation / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Waste Management</span>
                <span className={`font-semibold ${getScoreColor(scores.environmental.wasteManagement)}`}>
                  {scores.environmental.wasteManagement.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.environmental.wasteManagement / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Sustainable Materials</span>
                <span className={`font-semibold ${getScoreColor(scores.environmental.materialSustainability)}`}>
                  {scores.environmental.materialSustainability.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.environmental.materialSustainability / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Social Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-info">
              <Users className="h-5 w-5" />
              Social Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Accessibility</span>
                <span className={`font-semibold ${getScoreColor(scores.social.accessibility)}`}>
                  {scores.social.accessibility.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.social.accessibility / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Health & Wellbeing</span>
                <span className={`font-semibold ${getScoreColor(scores.social.healthWellbeing)}`}>
                  {scores.social.healthWellbeing.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.social.healthWellbeing / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Community Engagement</span>
                <span className={`font-semibold ${getScoreColor(scores.social.communityEngagement)}`}>
                  {scores.social.communityEngagement.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.social.communityEngagement / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Governance Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Shield className="h-5 w-5" />
              Governance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Certifications</span>
                <span className={`font-semibold ${getScoreColor(scores.governance.certifications)}`}>
                  {scores.governance.certifications.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.governance.certifications / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Transparency</span>
                <span className={`font-semibold ${getScoreColor(scores.governance.transparency)}`}>
                  {scores.governance.transparency.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.governance.transparency / 5) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Management</span>
                <span className={`font-semibold ${getScoreColor(scores.governance.riskManagement)}`}>
                  {scores.governance.riskManagement.toFixed(1)}
                </span>
              </div>
              <Progress value={(scores.governance.riskManagement / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scores.environmental.overall < 3 && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Environmental Improvement Needed</p>
                  <p className="text-sm text-muted-foreground">
                    Consider improving energy efficiency, water conservation, and waste management systems.
                  </p>
                </div>
              </div>
            )}
            
            {scores.social.overall < 3 && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-warning">Social Impact Enhancement</p>
                  <p className="text-sm text-muted-foreground">
                    Focus on accessibility improvements, health and wellbeing features, and community engagement.
                  </p>
                </div>
              </div>
            )}
            
            {scores.governance.overall < 3 && (
              <div className="flex items-start gap-2 p-3 bg-info/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-info">Governance Strengthening</p>
                  <p className="text-sm text-muted-foreground">
                    Pursue relevant certifications and improve transparency in ESG reporting.
                  </p>
                </div>
              </div>
            )}
            
            {scores.overallESGScore >= 4 && (
              <div className="flex items-start gap-2 p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-success">Excellent ESG Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Your property demonstrates strong sustainability practices. Continue monitoring and maintain current standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}