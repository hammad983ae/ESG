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
  changeImpact: number;
  changeType: "improvement" | "deterioration" | "market-adjustment" | "other";
  changeDescription: string;
  reasonForChange: string;
  valuationDate: string;
  afterValue: number;
  percentageChange: number;
}

interface BeforeAfterValuationFormProps {
  onSubmit: (data: BeforeAfterValuationData) => void;
}

export function BeforeAfterValuationForm({ onSubmit }: BeforeAfterValuationFormProps) {
  const [formData, setFormData] = useState({
    propertyName: "",
    beforeValue: 0,
    changeImpact: 0,
    changeType: "improvement" as const,
    changeDescription: "",
    reasonForChange: "",
    valuationDate: new Date().toISOString().split('T')[0],
  });

  const afterValue = formData.beforeValue + formData.changeImpact;
  const percentageChange = formData.beforeValue > 0 ? ((formData.changeImpact / formData.beforeValue) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valuationData: BeforeAfterValuationData = {
      ...formData,
      afterValue,
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
          Analyze property value changes due to improvements, deterioration, or market conditions.
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
              <Label htmlFor="changeType">Type of Change</Label>
              <Select 
                value={formData.changeType} 
                onValueChange={(value) => updateField("changeType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select change type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improvement">Property Improvement</SelectItem>
                  <SelectItem value="deterioration">Property Deterioration</SelectItem>
                  <SelectItem value="market-adjustment">Market Adjustment</SelectItem>
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
                  <Label htmlFor="beforeValue">Property Value ($)</Label>
                  <Input
                    id="beforeValue"
                    type="number"
                    step="1000"
                    min="0"
                    value={formData.beforeValue}
                    onChange={(e) => updateField("beforeValue", parseFloat(e.target.value) || 0)}
                    placeholder="Enter before value"
                    required
                  />
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Base Property Value</p>
                  <p className="text-xl font-semibold text-primary">
                    ${formData.beforeValue.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Change Impact */}
            <Card className="bg-gradient-to-br from-card to-warning/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-warning" />
                  Change Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="changeImpact">Value Change ($)</Label>
                  <Input
                    id="changeImpact"
                    type="number"
                    step="1000"
                    value={formData.changeImpact}
                    onChange={(e) => updateField("changeImpact", parseFloat(e.target.value) || 0)}
                    placeholder="Enter change amount (+ or -)"
                    required
                  />
                </div>
                <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Impact Amount</p>
                  <p className={`text-xl font-semibold ${formData.changeImpact >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formData.changeImpact >= 0 ? '+' : ''}${formData.changeImpact.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {percentageChange.toFixed(2)}% change
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* After Value */}
            <Card className="bg-gradient-to-br from-card to-success/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  After Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-muted-foreground">Calculated Value</p>
                    <p className="text-2xl font-bold text-success">
                      ${afterValue.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Calculation</p>
                    <p className="text-sm font-mono">
                      ${formData.beforeValue.toLocaleString()} {formData.changeImpact >= 0 ? '+' : ''} ${formData.changeImpact.toLocaleString()} = ${afterValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Change Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="changeDescription">Change Description</Label>
              <Input
                id="changeDescription"
                value={formData.changeDescription}
                onChange={(e) => updateField("changeDescription", e.target.value)}
                placeholder="Brief description of the change (e.g., Kitchen renovation, Market decline)"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reasonForChange">Detailed Reason for Change</Label>
              <Textarea
                id="reasonForChange"
                value={formData.reasonForChange}
                onChange={(e) => updateField("reasonForChange", e.target.value)}
                placeholder="Provide detailed explanation for the valuation change, including supporting factors and market conditions..."
                rows={4}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Generate Before & After Analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}