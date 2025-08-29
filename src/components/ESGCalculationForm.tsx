import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Leaf, Calculator } from "lucide-react";
import { ESGInputs } from "@/utils/esgCalculations";

interface ESGCalculationFormProps {
  onSubmit: (inputs: ESGInputs) => void;
}

export const ESGCalculationForm = ({ onSubmit }: ESGCalculationFormProps) => {
  const [cashRate, setCashRate] = useState<string>("4.25");
  const [propertyType, setPropertyType] = useState<'Commercial' | 'Residential'>('Commercial');
  const [energyRating, setEnergyRating] = useState<number[]>([6]);
  const [waterEfficiency, setWaterEfficiency] = useState<number[]>([6]);
  const [wasteReduction, setWasteReduction] = useState<number[]>([6]);
  const [sustainableMaterials, setSustainableMaterials] = useState<number[]>([6]);
  const [carbonFootprint, setCarbonFootprint] = useState<number[]>([6]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: ESGInputs = {
      cashRate: parseFloat(cashRate) / 100,
      propertyType,
      energyRating: energyRating[0],
      waterEfficiency: waterEfficiency[0],
      wasteReduction: wasteReduction[0],
      sustainableMaterials: sustainableMaterials[0],
      carbonFootprint: carbonFootprint[0],
    };

    onSubmit(inputs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          ESG All Risks Yield Calculator
        </CardTitle>
        <CardDescription>
          Calculate ESG-adjusted All Risks Yield incorporating sustainability factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cashRate">Australian Cash Rate (%)</Label>
              <Input
                id="cashRate"
                type="number"
                step="0.01"
                min="0"
                max="20"
                value={cashRate}
                onChange={(e) => setCashRate(e.target.value)}
                placeholder="4.25"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={propertyType} onValueChange={(value: 'Commercial' | 'Residential') => setPropertyType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ESG Factors */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary">ESG Performance Factors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Energy Rating / NABERS Score: {energyRating[0]}/10</Label>
                <Slider
                  value={energyRating}
                  onValueChange={setEnergyRating}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher scores indicate better energy performance
                </p>
              </div>

              <div className="space-y-2">
                <Label>Water Efficiency: {waterEfficiency[0]}/10</Label>
                <Slider
                  value={waterEfficiency}
                  onValueChange={setWaterEfficiency}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Water conservation and efficiency measures
                </p>
              </div>

              <div className="space-y-2">
                <Label>Waste Reduction: {wasteReduction[0]}/10</Label>
                <Slider
                  value={wasteReduction}
                  onValueChange={setWasteReduction}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Waste management and reduction systems
                </p>
              </div>

              <div className="space-y-2">
                <Label>Sustainable Materials: {sustainableMaterials[0]}/10</Label>
                <Slider
                  value={sustainableMaterials}
                  onValueChange={setSustainableMaterials}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Use of sustainable and recycled materials
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Carbon Footprint Score: {carbonFootprint[0]}/10</Label>
                <Slider
                  value={carbonFootprint}
                  onValueChange={setCarbonFootprint}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  10 = Net Zero/Carbon Negative, 0 = High Carbon Emissions
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate ESG-Adjusted ARY
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};