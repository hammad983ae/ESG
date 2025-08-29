import { useState } from "react";
import { PropertyAssessmentForm, PropertyData } from "@/components/PropertyAssessmentForm";
import { ESGDashboard } from "@/components/ESGDashboard";
import { ExportTools } from "@/components/ExportTools"; 
import { AdvancedCalculationsForm, AdvancedPropertyData } from "@/components/AdvancedCalculationsForm";
import { AdvancedDashboard } from "@/components/AdvancedDashboard";
import { calculateESGScores, ESGScores } from "@/utils/esgCalculations";
import { calculateAdvancedRiskAssessment, AdvancedCalculationResults } from "@/utils/advancedCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Calculator, BarChart3, ArrowLeft, Target } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  
  // Basic ESG Assessment State
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [esgScores, setESGScores] = useState<ESGScores | null>(null);
  
  // Advanced Assessment State
  const [advancedPropertyData, setAdvancedPropertyData] = useState<AdvancedPropertyData | null>(null);
  const [advancedResults, setAdvancedResults] = useState<AdvancedCalculationResults | null>(null);

  const handleBasicFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    const scores = calculateESGScores(data);
    setESGScores(scores);
    setCurrentStep('results');
  };

  const handleAdvancedFormSubmit = (data: AdvancedPropertyData) => {
    setAdvancedPropertyData(data);
    const results = calculateAdvancedRiskAssessment(data);
    setAdvancedResults(results);
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
                  ESG Property Assessment Platform
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Professional sustainability and risk evaluation platform for real estate properties. 
                Choose between basic ESG assessment or advanced automated calculations with comprehensive risk analysis.
              </p>
            </div>

            {/* Assessment Type Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'advanced')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Basic Assessment
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Advanced Calculations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Basic Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <Calculator className="h-5 w-5" />
                        ESG Scoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive Environmental, Social, and Governance assessment 
                        with industry-standard scoring methodology.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-info/10 border-info/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-info">
                        <BarChart3 className="h-5 w-5" />
                        Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Property risk rating incorporating sustainability factors, 
                        property age, and certification status.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Building className="h-5 w-5" />
                        Export Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Export results to CSV, JSON, and Excel templates 
                        for integration with valuation workflows.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <PropertyAssessmentForm onSubmit={handleBasicFormSubmit} />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Advanced Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Target className="h-5 w-5" />
                        Automated Formulas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Advanced calculations using weighted averages, climate risk thresholds, 
                        and normalized scoring systems with Excel-compatible formulas.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-warning/10 border-warning/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Calculator className="h-5 w-5" />
                        Climate Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive climate risk evaluation including flood, bushfire, 
                        cyclone, heatwave, and drought risk with customizable thresholds.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <BarChart3 className="h-5 w-5" />
                        Financial Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        SEIFA socioeconomic scoring, financial risk factors, 
                        and overall 1-5 risk rating for insurance and lending decisions.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <AdvancedCalculationsForm onSubmit={handleAdvancedFormSubmit} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
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

            {/* Results Display */}
            {activeTab === 'basic' && propertyData && esgScores && (
              <>
                <ESGDashboard scores={esgScores} propertyName={propertyData.propertyName} />
                <ExportTools scores={esgScores} propertyData={propertyData} />
              </>
            )}

            {activeTab === 'advanced' && advancedResults && (
              <AdvancedDashboard results={advancedResults} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
