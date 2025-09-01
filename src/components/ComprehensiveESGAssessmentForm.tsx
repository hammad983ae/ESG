import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Users, Building, Download, RotateCcw } from "lucide-react";
import { ComprehensiveESGInputs, ESGFactor, defaultComprehensiveESGInputs } from "@/utils/comprehensiveESGCalculations";

interface ComprehensiveESGAssessmentFormProps {
  onSubmit: (inputs: ComprehensiveESGInputs) => void;
}

export const ComprehensiveESGAssessmentForm: React.FC<ComprehensiveESGAssessmentFormProps> = ({ onSubmit }) => {
  const [inputs, setInputs] = useState<ComprehensiveESGInputs>(defaultComprehensiveESGInputs);

  const handleInputChange = <K extends keyof ComprehensiveESGInputs>(field: K, value: ComprehensiveESGInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleFactorChange = (factorId: string, field: keyof ESGFactor, value: number) => {
    const updatedFactors = inputs.factors.map(factor =>
      factor.id === factorId ? { ...factor, [field]: value } : factor
    );
    setInputs(prev => ({ ...prev, factors: updatedFactors }));
  };

  const resetToDefaults = () => {
    setInputs(defaultComprehensiveESGInputs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeVariant = (score: number) => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

  const environmentalFactors = inputs.factors.filter(f => f.category === 'environmental');
  const socialFactors = inputs.factors.filter(f => f.category === 'social');
  const governanceFactors = inputs.factors.filter(f => f.category === 'governance');

  const renderFactorCard = (factor: ESGFactor) => (
    <Card key={factor.id} className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium">{factor.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
          </div>
          <Badge variant={getBadgeVariant(factor.score)}>
            {formatPercentage(factor.score)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm">Performance Score</Label>
              <span className={`text-sm font-medium ${getScoreColor(factor.score)}`}>
                {formatPercentage(factor.score)}
              </span>
            </div>
            <Slider
              value={[factor.score]}
              onValueChange={([value]) => handleFactorChange(factor.id, 'score', value)}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor (0%)</span>
              <span>Average (50%)</span>
              <span>Excellent (100%)</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm">Weight/Importance</Label>
              <span className="text-sm font-medium">{formatPercentage(factor.weight)}</span>
            </div>
            <Slider
              value={[factor.weight]}
              onValueChange={([value]) => handleFactorChange(factor.id, 'weight', value)}
              max={0.3}
              min={0.05}
              step={0.05}
              className="w-full"
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            Max Impact: ±{formatPercentage(factor.impact_range)}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property & Assessment Configuration
          </CardTitle>
          <CardDescription>
            Configure property details and assessment methodology for comprehensive ESG analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={inputs.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="Childcare">Childcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={inputs.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Brisbane, QLD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="building-age">Building Age (years)</Label>
              <Input
                id="building-age"
                type="number"
                value={inputs.building_age}
                onChange={(e) => handleInputChange('building_age', parseInt(e.target.value) || 0)}
                placeholder="10"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="weighted-scoring"
                checked={inputs.use_weighted_scoring}
                onCheckedChange={(checked) => handleInputChange('use_weighted_scoring', checked)}
              />
              <Label htmlFor="weighted-scoring">Use Weighted Scoring</Label>
            </div>
            
            <Button type="button" variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ESG Factors Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive ESG Factors Assessment</CardTitle>
          <CardDescription>
            Rate each factor from 0% (poor) to 100% (excellent) based on current property performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="environmental" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="environmental" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Environmental ({environmentalFactors.length})
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Social ({socialFactors.length})
              </TabsTrigger>
              <TabsTrigger value="governance" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Governance ({governanceFactors.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="environmental" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-700">Environmental Factors</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Assess energy efficiency, renewable energy, water conservation, certifications, and waste management practices.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {environmentalFactors.map(renderFactorCard)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700">Social Factors</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Evaluate community engagement, tenant wellbeing, accessibility, and workforce conditions.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {socialFactors.map(renderFactorCard)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="governance" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-700">Governance Factors</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review ownership transparency, management practices, regulatory compliance, and data security.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {governanceFactors.map(renderFactorCard)}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1">
          <Building className="h-4 w-4 mr-2" />
          Generate Comprehensive ESG Assessment
        </Button>
      </div>
    </form>
  );
};