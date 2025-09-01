import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface AdvancedPropertyData {
  // Overall Sustainability Inputs
  energyRating: number;
  nabersRating: number;
  greenStarRating: number;
  otherRatings: number[];
  sustainabilityWeights: {
    energy: number;
    nabers: number;
    greenStar: number;
    other: number;
  };

  // Energy Efficiency Features
  energyFeatures: {
    solarPanels: number;
    insulation: number;
    ledLighting: number;
    hvacEfficiency: number;
    smartSystems: number;
    energyManagement: number;
  };

  // Water Conservation Strategies
  waterStrategies: {
    rainwaterHarvesting: number;
    greyWaterRecycling: number;
    lowFlowFixtures: number;
    droughtResistantLandscaping: number;
    waterMonitoring: number;
    irrigationEfficiency: number;
  };

  // Waste Management Strategies
  wasteStrategies: {
    recyclingPrograms: number;
    composting: number;
    wasteReduction: number;
    constructionWasteManagement: number;
    hazardousWasteHandling: number;
  };

  // Sustainable Materials
  sustainableMaterials: {
    ecoFriendlyMaterialsUsed: number;
    totalMaterials: number;
  };

  // Climate Risk Assessment
  climateRisk: {
    floodRisk: number;
    bushfireRisk: number;
    cycloneRisk: number;
    heatwaveRisk: number;
    droughtRisk: number;
    thresholds: {
      flood: number;
      bushfire: number;
      cyclone: number;
      heatwave: number;
      drought: number;
    };
  };

  // SEIFA Score
  seifaScore: number;

  // Financial Risk Factors
  financialRisk: {
    propertyAge: number;
    vacancyRate: number;
    debtToValueRatio: number;
    maintenanceBacklog: number;
    marketVolatility: number;
  };

  // Risk Weights
  riskWeights: {
    climate: number;
    financial: number;
    esg: number;
  };

  // DCF Analysis (optional)
  dcfAnalysis?: {
    enabled: boolean;
    initialInvestment: number;
    cashFlows: number[];
    discountRate: number;
    terminalValue?: number;
    growthRate?: number;
  };
}

interface AdvancedCalculationsFormProps {
  onSubmit: (data: AdvancedPropertyData) => void;
}

export function AdvancedCalculationsForm({ onSubmit }: AdvancedCalculationsFormProps) {
  const [formData, setFormData] = useState<AdvancedPropertyData>({
    energyRating: 0,
    nabersRating: 0,
    greenStarRating: 0,
    otherRatings: [0],
    sustainabilityWeights: {
      energy: 0.3,
      nabers: 0.3,
      greenStar: 0.25,
      other: 0.15,
    },
    energyFeatures: {
      solarPanels: 0,
      insulation: 0,
      ledLighting: 0,
      hvacEfficiency: 0,
      smartSystems: 0,
      energyManagement: 0,
    },
    waterStrategies: {
      rainwaterHarvesting: 0,
      greyWaterRecycling: 0,
      lowFlowFixtures: 0,
      droughtResistantLandscaping: 0,
      waterMonitoring: 0,
      irrigationEfficiency: 0,
    },
    wasteStrategies: {
      recyclingPrograms: 0,
      composting: 0,
      wasteReduction: 0,
      constructionWasteManagement: 0,
      hazardousWasteHandling: 0,
    },
    sustainableMaterials: {
      ecoFriendlyMaterialsUsed: 0,
      totalMaterials: 100,
    },
    climateRisk: {
      floodRisk: 0,
      bushfireRisk: 0,
      cycloneRisk: 0,
      heatwaveRisk: 0,
      droughtRisk: 0,
      thresholds: {
        flood: 30,
        bushfire: 25,
        cyclone: 20,
        heatwave: 35,
        drought: 40,
      },
    },
    seifaScore: 1000,
    financialRisk: {
      propertyAge: 0,
      vacancyRate: 0,
      debtToValueRatio: 0,
      maintenanceBacklog: 0,
      marketVolatility: 5,
    },
    riskWeights: {
      climate: 0.4,
      financial: 0.3,
      esg: 0.3,
    },
    dcfAnalysis: {
      enabled: false,
      initialInvestment: 0,
      cashFlows: [0, 0, 0, 0, 0],
      discountRate: 0.08,
      terminalValue: 0,
      growthRate: 0.02,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Advanced Property Risk Calculations</CardTitle>
        <p className="text-muted-foreground">
          Comprehensive risk assessment with automated calculations for sustainability, climate, and financial risk factors.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Sustainability Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Sustainability Ratings & Weights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="energyRating">Energy Rating (0-10)</Label>
                  <Input
                    id="energyRating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.energyRating}
                    onChange={(e) => updateField("energyRating", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="nabersRating">NABERS Rating (0-6)</Label>
                  <Input
                    id="nabersRating"
                    type="number"
                    min="0"
                    max="6"
                    step="0.5"
                    value={formData.nabersRating}
                    onChange={(e) => updateField("nabersRating", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="greenStarRating">Green Star Rating (0-6)</Label>
                  <Input
                    id="greenStarRating"
                    type="number"
                    min="0"
                    max="6"
                    step="0.5"
                    value={formData.greenStarRating}
                    onChange={(e) => updateField("greenStarRating", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Weights (should sum to 1.0)</h4>
                <div>
                  <Label htmlFor="energyWeight">Energy Weight</Label>
                  <Input
                    id="energyWeight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.sustainabilityWeights.energy}
                    onChange={(e) => updateField("sustainabilityWeights.energy", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="nabersWeight">NABERS Weight</Label>
                  <Input
                    id="nabersWeight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.sustainabilityWeights.nabers}
                    onChange={(e) => updateField("sustainabilityWeights.nabers", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="greenStarWeight">Green Star Weight</Label>
                  <Input
                    id="greenStarWeight"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.sustainabilityWeights.greenStar}
                    onChange={(e) => updateField("sustainabilityWeights.greenStar", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Energy Efficiency Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Energy Efficiency Features (Score 0-10 each)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(formData.energyFeatures).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={value}
                    onChange={(e) => updateField(`energyFeatures.${key}`, parseFloat(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Water Conservation Strategies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Water Conservation Strategies (Score 0-10 each)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(formData.waterStrategies).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={value}
                    onChange={(e) => updateField(`waterStrategies.${key}`, parseFloat(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Waste Management Strategies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Waste Management Strategies (Score 0-10 each)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(formData.wasteStrategies).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={value}
                    onChange={(e) => updateField(`wasteStrategies.${key}`, parseFloat(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sustainable Materials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Sustainable Materials & Construction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ecoMaterials">Eco-Friendly Materials Used (%)</Label>
                <Input
                  id="ecoMaterials"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sustainableMaterials.ecoFriendlyMaterialsUsed}
                  onChange={(e) => updateField("sustainableMaterials.ecoFriendlyMaterialsUsed", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="totalMaterials">Total Materials Assessed (%)</Label>
                <Input
                  id="totalMaterials"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.sustainableMaterials.totalMaterials}
                  onChange={(e) => updateField("sustainableMaterials.totalMaterials", parseFloat(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>

          {/* Climate Risk Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Climate Risk Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Risk Levels (0-100)</h4>
                {Object.entries(formData.climateRisk).filter(([key]) => key !== 'thresholds').map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Risk
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      min="0"
                      max="100"
                      value={value as number}
                      onChange={(e) => updateField(`climateRisk.${key}`, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Risk Thresholds</h4>
                {Object.entries(formData.climateRisk.thresholds).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`threshold_${key}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Threshold
                    </Label>
                    <Input
                      id={`threshold_${key}`}
                      type="number"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => updateField(`climateRisk.thresholds.${key}`, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEIFA Score */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Socioeconomic Index (SEIFA)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seifaScore">SEIFA Score (500-1500)</Label>
                <Input
                  id="seifaScore"
                  type="number"
                  min="500"
                  max="1500"
                  value={formData.seifaScore}
                  onChange={(e) => updateField("seifaScore", parseFloat(e.target.value) || 1000)}
                />
              </div>
            </div>
          </div>

          {/* Financial Risk Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Financial Risk Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="propertyAge">Property Age (years)</Label>
                <Input
                  id="propertyAge"
                  type="number"
                  min="0"
                  value={formData.financialRisk.propertyAge}
                  onChange={(e) => updateField("financialRisk.propertyAge", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                <Input
                  id="vacancyRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.financialRisk.vacancyRate}
                  onChange={(e) => updateField("financialRisk.vacancyRate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="debtToValue">Debt to Value Ratio (%)</Label>
                <Input
                  id="debtToValue"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.financialRisk.debtToValueRatio}
                  onChange={(e) => updateField("financialRisk.debtToValueRatio", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="maintenanceBacklog">Maintenance Backlog ($000s)</Label>
                <Input
                  id="maintenanceBacklog"
                  type="number"
                  min="0"
                  value={formData.financialRisk.maintenanceBacklog}
                  onChange={(e) => updateField("financialRisk.maintenanceBacklog", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="marketVolatility">Market Volatility (1-10)</Label>
                <Input
                  id="marketVolatility"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={formData.financialRisk.marketVolatility}
                  onChange={(e) => updateField("financialRisk.marketVolatility", parseFloat(e.target.value) || 5)}
                />
              </div>
            </div>
          </div>

          {/* Risk Weights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Overall Risk Weights (should sum to 1.0)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="climateWeight">Climate Risk Weight</Label>
                <Input
                  id="climateWeight"
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.riskWeights.climate}
                  onChange={(e) => updateField("riskWeights.climate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="financialWeight">Financial Risk Weight</Label>
                <Input
                  id="financialWeight"
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.riskWeights.financial}
                  onChange={(e) => updateField("riskWeights.financial", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="esgWeight">ESG Risk Weight</Label>
                <Input
                  id="esgWeight"
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.riskWeights.esg}
                  onChange={(e) => updateField("riskWeights.esg", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* DCF Analysis (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-primary">DCF Analysis (Optional)</h3>
              <Checkbox
                id="dcfEnabled"
                checked={formData.dcfAnalysis?.enabled || false}
                onCheckedChange={(checked) => updateField("dcfAnalysis.enabled", checked)}
              />
              <Label htmlFor="dcfEnabled">Enable DCF Analysis</Label>
            </div>
            
            {formData.dcfAnalysis?.enabled && (
              <div className="space-y-6 p-4 bg-muted/30 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dcfInitialInvestment">Initial Investment ($)</Label>
                    <Input
                      id="dcfInitialInvestment"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.dcfAnalysis.initialInvestment}
                      onChange={(e) => updateField("dcfAnalysis.initialInvestment", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dcfDiscountRate">Discount Rate</Label>
                    <Input
                      id="dcfDiscountRate"
                      type="number"
                      min="0"
                      max="1"
                      step="0.001"
                      value={formData.dcfAnalysis.discountRate}
                      onChange={(e) => updateField("dcfAnalysis.discountRate", parseFloat(e.target.value) || 0.08)}
                      placeholder="e.g., 0.08 for 8%"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dcfGrowthRate">Growth Rate</Label>
                    <Input
                      id="dcfGrowthRate"
                      type="number"
                      min="0"
                      max="0.1"
                      step="0.001"
                      value={formData.dcfAnalysis.growthRate || 0.02}
                      onChange={(e) => updateField("dcfAnalysis.growthRate", parseFloat(e.target.value) || 0.02)}
                      placeholder="e.g., 0.02 for 2%"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Projected Cash Flows (5 Years)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
                    {formData.dcfAnalysis.cashFlows.map((cashFlow, index) => (
                      <div key={index}>
                        <Label htmlFor={`dcfCashFlow${index}`} className="text-xs">Year {index + 1}</Label>
                        <Input
                          id={`dcfCashFlow${index}`}
                          type="number"
                          step="1000"
                          value={cashFlow}
                          onChange={(e) => {
                            const newCashFlows = [...(formData.dcfAnalysis?.cashFlows || [])];
                            newCashFlows[index] = parseFloat(e.target.value) || 0;
                            updateField("dcfAnalysis.cashFlows", newCashFlows);
                          }}
                          placeholder={`Year ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dcfTerminalValue">Terminal Value ($) - Optional</Label>
                  <Input
                    id="dcfTerminalValue"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.dcfAnalysis.terminalValue || 0}
                    onChange={(e) => updateField("dcfAnalysis.terminalValue", parseFloat(e.target.value) || 0)}
                    placeholder="Optional terminal value"
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Calculate Advanced Risk Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}