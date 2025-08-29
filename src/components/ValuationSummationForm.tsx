import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator, Building } from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  type: string;
  name: string;
  baseValue: number;
  sustainabilityScore: number;
  adjustmentFactor: number;
  adjustedValue: number;
}

interface SustainabilityFactors {
  energyEfficiency: number;
  carbonFootprint: number;
  physicalRisk: number;
  fitoutQuality: number;
  regulationsCompliance: number;
  staffProductivity: number;
}

interface ValuationSummationFormProps {
  onSubmit: (data: any) => void;
}

const ASSET_TYPES = [
  'Office',
  'Retail', 
  'Motel',
  'Childcare',
  'Industrial',
  'Residential',
  'Custom'
];

export function ValuationSummationForm({ onSubmit }: ValuationSummationFormProps) {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      type: 'Office',
      name: 'Main Office Building',
      baseValue: 1000000,
      sustainabilityScore: 75,
      adjustmentFactor: 1.05,
      adjustedValue: 1050000
    }
  ]);
  
  const [sustainabilityFactors, setSustainabilityFactors] = useState<SustainabilityFactors>({
    energyEfficiency: 70,
    carbonFootprint: 65,
    physicalRisk: 80,
    fitoutQuality: 75,
    regulationsCompliance: 85,
    staffProductivity: 70
  });

  const [customAssetTypes, setCustomAssetTypes] = useState<string[]>([]);
  const [newCustomType, setNewCustomType] = useState('');

  // Calculate sustainability adjustment factor based on scores
  const calculateAdjustmentFactor = (sustainabilityScore: number): number => {
    // Base adjustment: 80+ score = 1.1x, 60-79 = 1.0x, <60 = 0.9x
    if (sustainabilityScore >= 80) return 1.1;
    if (sustainabilityScore >= 60) return 1.0;
    return 0.9;
  };

  // Calculate overall sustainability score
  const calculateSustainabilityScore = (): number => {
    const weights = {
      energyEfficiency: 0.2,
      carbonFootprint: 0.2,
      physicalRisk: 0.15,
      fitoutQuality: 0.15,
      regulationsCompliance: 0.15,
      staffProductivity: 0.15
    };
    
    return Math.round(
      sustainabilityFactors.energyEfficiency * weights.energyEfficiency +
      sustainabilityFactors.carbonFootprint * weights.carbonFootprint +
      sustainabilityFactors.physicalRisk * weights.physicalRisk +
      sustainabilityFactors.fitoutQuality * weights.fitoutQuality +
      sustainabilityFactors.regulationsCompliance * weights.regulationsCompliance +
      sustainabilityFactors.staffProductivity * weights.staffProductivity
    );
  };

  const addAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      type: 'Office',
      name: '',
      baseValue: 0,
      sustainabilityScore: calculateSustainabilityScore(),
      adjustmentFactor: 1.0,
      adjustedValue: 0
    };
    setAssets([...assets, newAsset]);
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(assets.map(asset => {
      if (asset.id === id) {
        const updated = { ...asset, [field]: value };
        
        // Recalculate adjusted values when base value or adjustment factor changes
        if (field === 'baseValue' || field === 'adjustmentFactor') {
          updated.adjustedValue = updated.baseValue * updated.adjustmentFactor;
        }
        
        // Update adjustment factor when sustainability score changes
        if (field === 'sustainabilityScore') {
          updated.adjustmentFactor = calculateAdjustmentFactor(value);
          updated.adjustedValue = updated.baseValue * updated.adjustmentFactor;
        }
        
        return updated;
      }
      return asset;
    }));
  };

  const addCustomAssetType = () => {
    if (newCustomType.trim() && !customAssetTypes.includes(newCustomType.trim())) {
      setCustomAssetTypes([...customAssetTypes, newCustomType.trim()]);
      setNewCustomType('');
      toast.success(`Added custom asset type: ${newCustomType.trim()}`);
    }
  };

  const updateSustainabilityFactor = (factor: keyof SustainabilityFactors, value: number) => {
    setSustainabilityFactors(prev => ({ ...prev, [factor]: value }));
    
    // Update sustainability scores for all assets
    const newScore = calculateSustainabilityScore();
    setAssets(assets.map(asset => ({
      ...asset,
      sustainabilityScore: newScore,
      adjustmentFactor: calculateAdjustmentFactor(newScore),
      adjustedValue: asset.baseValue * calculateAdjustmentFactor(newScore)
    })));
  };

  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => total + asset.adjustedValue, 0);
  };

  const handleSubmit = async () => {
    try {
      const totalValue = calculateTotalValue();
      const results = {
        assets,
        sustainabilityFactors,
        totalBaseValue: assets.reduce((total, asset) => total + asset.baseValue, 0),
        totalAdjustedValue: totalValue,
        overallSustainabilityScore: calculateSustainabilityScore(),
        averageAdjustmentFactor: assets.length > 0 ? assets.reduce((sum, asset) => sum + asset.adjustmentFactor, 0) / assets.length : 1
      };
      
      onSubmit(results);
      toast.success("Valuation summation calculation completed!");
    } catch (error) {
      toast.error("Error calculating summation valuation");
    }
  };

  const allAssetTypes = [...ASSET_TYPES, ...customAssetTypes];

  return (
    <div className="space-y-6">
      {/* Sustainability Factors Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Global Sustainability Factors
          </CardTitle>
          <CardDescription>
            Configure sustainability factors that will be applied to all assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(sustainabilityFactors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => updateSustainabilityFactor(key as keyof SustainabilityFactors, Number(e.target.value))}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Sustainability Score:</span>
              <Badge variant={calculateSustainabilityScore() >= 80 ? "default" : calculateSustainabilityScore() >= 60 ? "secondary" : "destructive"}>
                {calculateSustainabilityScore()}/100
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Asset Types */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Asset Types</CardTitle>
          <CardDescription>Add custom asset types for your valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter custom asset type"
              value={newCustomType}
              onChange={(e) => setNewCustomType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAssetType()}
            />
            <Button onClick={addCustomAssetType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {customAssetTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customAssetTypes.map(type => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Asset Portfolio
            <Button onClick={addAsset} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </CardTitle>
          <CardDescription>
            Configure individual assets and their valuations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <Card key={asset.id} className="relative">
                <CardContent className="pt-6">
                  <Button
                    onClick={() => removeAsset(asset.id)}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select value={asset.type} onValueChange={(value) => updateAsset(asset.id, 'type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allAssetTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Asset Name</Label>
                      <Input
                        value={asset.name}
                        onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                        placeholder="Enter asset name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Base Value ($)</Label>
                      <Input
                        type="number"
                        value={asset.baseValue}
                        onChange={(e) => updateAsset(asset.id, 'baseValue', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sustainability Score</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={asset.sustainabilityScore}
                        onChange={(e) => updateAsset(asset.id, 'sustainabilityScore', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Adjustment Factor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={asset.adjustmentFactor}
                        onChange={(e) => updateAsset(asset.id, 'adjustmentFactor', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Adjusted Value ($)</Label>
                      <div className="p-2 bg-muted rounded border text-sm font-medium">
                        ${asset.adjustedValue.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Value Impact</Label>
                      <Badge variant={asset.adjustmentFactor > 1 ? "default" : asset.adjustmentFactor < 1 ? "destructive" : "secondary"}>
                        {asset.adjustmentFactor > 1 ? '+' : ''}{((asset.adjustmentFactor - 1) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Base Value</Label>
              <div className="text-2xl font-bold">
                ${assets.reduce((total, asset) => total + asset.baseValue, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Total Adjusted Value</Label>
              <div className="text-2xl font-bold text-primary">
                ${calculateTotalValue().toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Overall Impact</Label>
              <div className="text-xl font-semibold">
                {calculateTotalValue() > assets.reduce((total, asset) => total + asset.baseValue, 0) ? '+' : ''}
                ${(calculateTotalValue() - assets.reduce((total, asset) => total + asset.baseValue, 0)).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        <Calculator className="w-4 h-4 mr-2" />
        Calculate Summation Valuation
      </Button>
    </div>
  );
}