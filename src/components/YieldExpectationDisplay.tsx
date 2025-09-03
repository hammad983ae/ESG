/**
 * Yield Expectation Display Component
 * Shows expected yields for selected varieties
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart3, TrendingUp, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getYieldExpectation, calculateExpectedYield, YieldExpectation } from "@/utils/yieldExpectations";
import { convertAcreToHectare } from "@/utils/conversionUtils";

interface YieldExpectationDisplayProps {
  variety: string;
  acres?: number;
  showCalculator?: boolean;
}

export const YieldExpectationDisplay = ({ 
  variety, 
  acres = 1, 
  showCalculator = true 
}: YieldExpectationDisplayProps) => {
  const [selectedAcres, setSelectedAcres] = useState(acres);
  const [qualityLevel, setQualityLevel] = useState<'premium' | 'commercial' | 'maximum'>('commercial');
  const [yieldData, setYieldData] = useState<YieldExpectation | null>(null);

  useEffect(() => {
    const data = getYieldExpectation(variety);
    setYieldData(data);
  }, [variety]);

  if (!yieldData) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No yield data available for "{variety}"
          </p>
        </CardContent>
      </Card>
    );
  }

  const calculation = calculateExpectedYield(variety, selectedAcres, qualityLevel);
  const hectares = convertAcreToHectare(selectedAcres);

  const getQualityColor = (level: string) => {
    switch (level) {
      case 'premium': return 'text-green-600';
      case 'maximum': return 'text-blue-600';
      default: return 'text-orange-600';
    }
  };

  const getProgressValue = () => {
    const range = yieldData.yieldPerAcre.max - yieldData.yieldPerAcre.min;
    const current = calculation?.expectedYield.tons || yieldData.yieldPerAcre.average;
    return ((current / selectedAcres - yieldData.yieldPerAcre.min) / range) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Yield Expectations - {variety}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{yieldData.category}</Badge>
          <Badge variant="outline">{yieldData.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Yield Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Per Acre</div>
            <div className="font-semibold">
              {yieldData.yieldPerAcre.min} - {yieldData.yieldPerAcre.max} {yieldData.yieldPerAcre.unit}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg: {yieldData.yieldPerAcre.average.toFixed(1)} {yieldData.yieldPerAcre.unit}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Per Hectare</div>
            <div className="font-semibold">
              {yieldData.yieldPerHectare.min.toFixed(1)} - {yieldData.yieldPerHectare.max.toFixed(1)} {yieldData.yieldPerHectare.unit}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg: {yieldData.yieldPerHectare.average.toFixed(1)} {yieldData.yieldPerHectare.unit}
            </div>
          </div>
        </div>

        {/* Yield Range Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Yield Range</span>
            <span className={getQualityColor(qualityLevel)}>
              {qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1)} Level
            </span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {yieldData.yieldPerAcre.min} {yieldData.yieldPerAcre.unit}/acre</span>
            <span>Max: {yieldData.yieldPerAcre.max} {yieldData.yieldPerAcre.unit}/acre</span>
          </div>
        </div>

        {showCalculator && (
          <>
            {/* Calculator Section */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Yield Calculator
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Planted Area</Label>
                  <Input
                    type="number"
                    value={selectedAcres}
                    onChange={(e) => setSelectedAcres(parseFloat(e.target.value) || 0)}
                    placeholder="Acres"
                    step="0.1"
                  />
                  <div className="text-xs text-muted-foreground">
                    = {hectares.toFixed(2)} hectares
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Quality/Yield Target</Label>
                  <Select value={qualityLevel} onValueChange={(value: any) => setQualityLevel(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium Quality (Lower Yield)</SelectItem>
                      <SelectItem value="commercial">Commercial (Average Yield)</SelectItem>
                      <SelectItem value="maximum">Maximum Yield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results */}
            {calculation && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <h5 className="font-semibold text-primary">Expected Production</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {calculation.expectedYield.tons.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {calculation.expectedYield.unit} total
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {(calculation.expectedYield.tons / selectedAcres).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {calculation.expectedYield.unit} per acre
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Range: {calculation.yieldRange.min.toFixed(1)} - {calculation.yieldRange.max.toFixed(1)} {calculation.expectedYield.unit}
                </div>
              </div>
            )}
          </>
        )}

        {/* Production Factors */}
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Optimal Climate:</span>
            <div className="flex gap-1 mt-1">
              {yieldData.factors.climate.map((climate) => (
                <Badge key={climate} variant="outline" className="text-xs">
                  {climate}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <span className="font-medium">Soil Requirements:</span>
            <div className="flex gap-1 mt-1">
              {yieldData.factors.soil.map((soil) => (
                <Badge key={soil} variant="outline" className="text-xs">
                  {soil}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <span className="font-medium">Irrigation Systems:</span>
            <div className="flex gap-1 mt-1">
              {yieldData.factors.irrigation.map((irrigation) => (
                <Badge key={irrigation} variant="outline" className="text-xs">
                  {irrigation}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 dark:text-blue-200">{yieldData.notes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};