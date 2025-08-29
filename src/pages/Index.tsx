import { useState } from "react";
import { PropertyAssessmentForm, PropertyData } from "@/components/PropertyAssessmentForm";
import { ESGDashboard } from "@/components/ESGDashboard";
import { ExportTools } from "@/components/ExportTools"; 
import { calculateESGScores, ESGScores } from "@/utils/esgCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calculator, BarChart3, ArrowLeft } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [esgScores, setESGScores] = useState<ESGScores | null>(null);

  const handleFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    const scores = calculateESGScores(data);
    setESGScores(scores);
    setCurrentStep('results');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'form' ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Building className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  ESG Property Assessment
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive sustainability and risk evaluation platform for real estate properties. 
                Assess Environmental, Social, and Governance factors to determine property risk ratings and financial implications.
              </p>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Calculator className="h-5 w-5" />
                    Comprehensive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced ESG scoring using industry-standard formulas for energy efficiency, 
                    water conservation, waste management, and sustainable materials.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-info/10 border-info/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-info">
                    <BarChart3 className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    1-5 scale risk rating incorporating climate risk, property age, 
                    certifications, and ESG performance for insurance and finance decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <Building className="h-5 w-5" />
                    Excel Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Export results and formulas to Excel for further analysis, 
                    customization, and integration with existing valuation workflows.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Form */}
            <PropertyAssessmentForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          propertyData && esgScores && (
            <div className="space-y-6">
              {/* Back Button */}
              <Button 
                onClick={handleBackToForm}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment Form
              </Button>

              {/* Results Dashboard */}
              <ESGDashboard scores={esgScores} propertyName={propertyData.propertyName} />
              
              {/* Export Tools */}
              <ExportTools scores={esgScores} propertyData={propertyData} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Index;
