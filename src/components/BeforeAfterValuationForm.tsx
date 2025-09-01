import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calculator, ArrowRight } from "lucide-react";

export interface BeforeAfterValuationData {
  propertyName: string;
  beforeValue: number;
  afterValue: number;
  compensation: number;
  acquisitionType: "partial" | "full" | "easement" | "other";
  acquisitionDescription: string;
  damagesAndBenefits: string;
  valuationDate: string;
  percentageChange: number;
}

interface BeforeAfterValuationFormProps {
  onSubmit: (data: BeforeAfterValuationData) => void;
}

export function BeforeAfterValuationForm({ onSubmit }: BeforeAfterValuationFormProps) {
  const [formData, setFormData] = useState({
    propertyName: "",
    beforeValue: 0,
    afterValue: 0,
    acquisitionType: "partial" as const,
    acquisitionDescription: "",
    damagesAndBenefits: "",
    valuationDate: new Date().toISOString().split('T')[0],
  });

  const compensation = formData.beforeValue - formData.afterValue;
  const percentageChange = formData.beforeValue > 0 ? ((compensation / formData.beforeValue) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valuationData: BeforeAfterValuationData = {
      ...formData,
      compensation,
      percentageChange,
    };
    
    onSubmit(valuationData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Before & After Valuation Methodology
        </CardTitle>
        <p className="text-muted-foreground">
          Calculate compensation for partial acquisition using before and after methodology.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="propertyName">Property Name</Label>
              <Input
                id="propertyName"
                value={formData.propertyName}
                onChange={(e) => updateField("propertyName", e.target.value)}
                placeholder="Enter property name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="valuationDate">Valuation Date</Label>
              <Input
                id="valuationDate"
                type="date"
                value={formData.valuationDate}
                onChange={(e) => updateField("valuationDate", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="acquisitionType">Type of Acquisition</Label>
              <Select 
                value={formData.acquisitionType} 
                onValueChange={(value) => updateField("acquisitionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select acquisition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partial">Partial Acquisition</SelectItem>
                  <SelectItem value="full">Full Acquisition</SelectItem>
                  <SelectItem value="easement">Easement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valuation Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Before Value */}
            <Card className="bg-gradient-to-br from-card to-muted/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Before Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="beforeValue">Full Market Value Before Acquisition ($)</Label>
                  <Input
                    id="beforeValue"
                    type="number"
                    step="1000"
                    min="0"
                    value={formData.beforeValue}
                    onChange={(e) => updateField("beforeValue", parseFloat(e.target.value) || 0)}
                    placeholder="Enter full market value before acquisition"
                    required
                  />
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Full Market Value Before</p>
                  <p className="text-xl font-semibold text-primary">
                    ${formData.beforeValue.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* After Value */}
            <Card className="bg-gradient-to-br from-card to-warning/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-warning" />
                  Residual Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="afterValue">Market Value of Remaining Property ($)</Label>
                  <Input
                    id="afterValue"
                    type="number"
                    step="1000"
                    min="0"
                    value={formData.afterValue}
                    onChange={(e) => updateField("afterValue", parseFloat(e.target.value) || 0)}
                    placeholder="Enter market value of remaining property"
                    required
                  />
                </div>
                <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Residual Property Value</p>
                  <p className="text-xl font-semibold text-warning">
                    ${formData.afterValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {percentageChange.toFixed(2)}% of original
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card className="bg-gradient-to-br from-card to-success/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-muted-foreground">Calculated Compensation</p>
                    <p className="text-2xl font-bold text-success">
                      ${compensation.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Calculation</p>
                    <p className="text-sm font-mono">
                      ${formData.beforeValue.toLocaleString()} - ${formData.afterValue.toLocaleString()} = ${compensation.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acquisition Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="acquisitionDescription">Acquisition Description</Label>
              <Input
                id="acquisitionDescription"
                value={formData.acquisitionDescription}
                onChange={(e) => updateField("acquisitionDescription", e.target.value)}
                placeholder="Brief description of the acquisition (e.g., Road widening, Utility easement)"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="damagesAndBenefits">Damages and Benefits Analysis</Label>
              <Textarea
                id="damagesAndBenefits"
                value={formData.damagesAndBenefits}
                onChange={(e) => updateField("damagesAndBenefits", e.target.value)}
                placeholder="Provide detailed explanation of land taken, damages incurred, and any benefits received. Include supporting factors and market conditions..."
                rows={4}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Calculate Acquisition Compensation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}