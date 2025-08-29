import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Home, Building, Calculator } from "lucide-react";
import { 
  ESGWeightedSalesInputs, 
  SubjectPropertyData, 
  ComparableSaleData, 
  PropertyAdjustment,
  getAllESGFactors 
} from "@/utils/comparableSalesCalculations";

interface ESGComparableSalesFormProps {
  onSubmit: (inputs: ESGWeightedSalesInputs) => void;
}

const PROPERTY_TYPES = [
  "Office",
  "Retail",
  "Industrial", 
  "Residential",
  "Mixed Use",
  "Hotel",
  "Warehouse",
  "Other"
];

const ADJUSTMENT_FACTORS = [
  "Market (National and Regional)",
  "Location", 
  "Property",
  "Architecture/Type of Construction",
  "Fitout",
  "Structural Condition",
  "Plot Situation",
  "Ecological Sustainability",
  "Profitability of building concept",
  "Quality of property cashflow",
  "Tenant and Occupier Situation",
  "Rental Growth Potential/Value Growth Potential",
  "Letting Prospects",
  "Vacancy/Letting Situation",
  "Recoverable and Non-Recoverable Operating Expenses",
  "Usability by their 3rd parties and/or Alternative Use",
  "Exceptional Circumstances"
];

export function ESGComparableSalesForm({ onSubmit }: ESGComparableSalesFormProps) {
  // Subject Property State
  const [subjectProperty, setSubjectProperty] = useState<Partial<SubjectPropertyData>>({
    id: "subject-01",
    address: "",
    propertyType: "",
    floorArea: 0,
    landArea: 0,
    yearBuilt: undefined,
    esgFeatures: {
      energyRating: 0,
      waterEfficiency: 0,
      wasteManagement: 0,
      sustainableMaterials: 0,
      greenCertifications: [],
    }
  });

  // Comparable Sales State
  const [comparableSales, setComparableSales] = useState<Partial<ComparableSaleData>[]>([
    {
      id: "comp-01",
      address: "",
      salePrice: 0,
      saleDate: "",
      propertyType: "",
      floorArea: 0,
      landArea: 0,
      yearBuilt: undefined,
      adjustments: []
    }
  ]);

  const esgFactors = getAllESGFactors();

  const addComparable = () => {
    const newComparable: Partial<ComparableSaleData> = {
      id: `comp-${String(comparableSales.length + 1).padStart(2, '0')}`,
      address: "",
      salePrice: 0,
      saleDate: "",
      propertyType: "",
      floorArea: 0,
      landArea: 0,
      yearBuilt: undefined,
      adjustments: []
    };
    setComparableSales([...comparableSales, newComparable]);
  };

  const removeComparable = (index: number) => {
    if (comparableSales.length > 1) {
      setComparableSales(comparableSales.filter((_, i) => i !== index));
    }
  };

  const updateComparable = (index: number, field: string, value: any) => {
    const updated = [...comparableSales];
    updated[index] = { ...updated[index], [field]: value };
    setComparableSales(updated);
  };

  const addAdjustment = (comparableIndex: number) => {
    const updated = [...comparableSales];
    const adjustments = updated[comparableIndex].adjustments || [];
    adjustments.push({
      factorName: ADJUSTMENT_FACTORS[0],
      adjustmentValue: 0
    });
    updated[comparableIndex] = { ...updated[comparableIndex], adjustments };
    setComparableSales(updated);
  };

  const removeAdjustment = (comparableIndex: number, adjustmentIndex: number) => {
    const updated = [...comparableSales];
    const adjustments = updated[comparableIndex].adjustments || [];
    adjustments.splice(adjustmentIndex, 1);
    updated[comparableIndex] = { ...updated[comparableIndex], adjustments };
    setComparableSales(updated);
  };

  const updateAdjustment = (comparableIndex: number, adjustmentIndex: number, field: string, value: any) => {
    const updated = [...comparableSales];
    const adjustments = [...(updated[comparableIndex].adjustments || [])];
    adjustments[adjustmentIndex] = { ...adjustments[adjustmentIndex], [field]: value };
    updated[comparableIndex] = { ...updated[comparableIndex], adjustments };
    setComparableSales(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!subjectProperty.address || !subjectProperty.propertyType || !subjectProperty.floorArea) {
      throw new Error("Please complete all required subject property fields");
    }

    const validComparables = comparableSales.filter(comp => 
      comp.address && comp.salePrice && comp.saleDate && comp.propertyType && comp.floorArea
    );

    if (validComparables.length === 0) {
      throw new Error("Please provide at least one complete comparable sale");
    }

    const inputs: ESGWeightedSalesInputs = {
      subjectProperty: subjectProperty as SubjectPropertyData,
      comparableSales: validComparables as ComparableSaleData[]
    };

    onSubmit(inputs);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          ESG-Weighted Comparable Sales Assessment
        </CardTitle>
        <CardDescription>
          Perform ESG-enhanced sales comparison analysis with sustainability-weighted adjustments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Subject Property Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold">Subject Property</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectAddress">Address *</Label>
                <Input
                  id="subjectAddress"
                  placeholder="123 Main Street, Sydney NSW"
                  value={subjectProperty.address}
                  onChange={(e) => setSubjectProperty({...subjectProperty, address: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectType">Property Type *</Label>
                <Select 
                  value={subjectProperty.propertyType} 
                  onValueChange={(value) => setSubjectProperty({...subjectProperty, propertyType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectFloorArea">Floor Area (sqm) *</Label>
                <Input
                  id="subjectFloorArea"
                  type="number"
                  placeholder="1000"
                  value={subjectProperty.floorArea}
                  onChange={(e) => setSubjectProperty({...subjectProperty, floorArea: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectLandArea">Land Area (sqm)</Label>
                <Input
                  id="subjectLandArea"
                  type="number"
                  placeholder="2000"
                  value={subjectProperty.landArea}
                  onChange={(e) => setSubjectProperty({...subjectProperty, landArea: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectYearBuilt">Year Built</Label>
                <Input
                  id="subjectYearBuilt"
                  type="number"
                  placeholder="2020"
                  value={subjectProperty.yearBuilt}
                  onChange={(e) => setSubjectProperty({...subjectProperty, yearBuilt: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* ESG Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">ESG Features (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Energy Rating (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={subjectProperty.esgFeatures?.energyRating}
                    onChange={(e) => setSubjectProperty({
                      ...subjectProperty, 
                      esgFeatures: {...subjectProperty.esgFeatures, energyRating: parseFloat(e.target.value)}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Water Efficiency (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={subjectProperty.esgFeatures?.waterEfficiency}
                    onChange={(e) => setSubjectProperty({
                      ...subjectProperty, 
                      esgFeatures: {...subjectProperty.esgFeatures, waterEfficiency: parseFloat(e.target.value)}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Waste Management (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={subjectProperty.esgFeatures?.wasteManagement}
                    onChange={(e) => setSubjectProperty({
                      ...subjectProperty, 
                      esgFeatures: {...subjectProperty.esgFeatures, wasteManagement: parseFloat(e.target.value)}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sustainable Materials (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={subjectProperty.esgFeatures?.sustainableMaterials}
                    onChange={(e) => setSubjectProperty({
                      ...subjectProperty, 
                      esgFeatures: {...subjectProperty.esgFeatures, sustainableMaterials: parseFloat(e.target.value)}
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comparable Sales Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold">Comparable Sales</h3>
              </div>
              <Button type="button" onClick={addComparable} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Comparable
              </Button>
            </div>

            {comparableSales.map((comparable, compIndex) => (
              <Card key={compIndex} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Comparable Sale #{compIndex + 1}</CardTitle>
                    {comparableSales.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeComparable(compIndex)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Basic Property Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Input
                        placeholder="456 Example St, Melbourne VIC"
                        value={comparable.address}
                        onChange={(e) => updateComparable(compIndex, 'address', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sale Price (AUD) *</Label>
                      <Input
                        type="number"
                        placeholder="1500000"
                        value={comparable.salePrice}
                        onChange={(e) => updateComparable(compIndex, 'salePrice', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sale Date *</Label>
                      <Input
                        type="date"
                        value={comparable.saleDate}
                        onChange={(e) => updateComparable(compIndex, 'saleDate', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Property Type *</Label>
                      <Select 
                        value={comparable.propertyType} 
                        onValueChange={(value) => updateComparable(compIndex, 'propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Floor Area (sqm) *</Label>
                      <Input
                        type="number"
                        placeholder="900"
                        value={comparable.floorArea}
                        onChange={(e) => updateComparable(compIndex, 'floorArea', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Year Built</Label>
                      <Input
                        type="number"
                        placeholder="2018"
                        value={comparable.yearBuilt}
                        onChange={(e) => updateComparable(compIndex, 'yearBuilt', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Adjustments Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Property Adjustments</h4>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => addAdjustment(compIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Adjustment
                      </Button>
                    </div>

                    {comparable.adjustments?.map((adjustment, adjIndex) => (
                      <div key={adjIndex} className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Label>Adjustment Factor</Label>
                          <Select
                            value={adjustment.factorName}
                            onValueChange={(value) => updateAdjustment(compIndex, adjIndex, 'factorName', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ADJUSTMENT_FACTORS.map(factor => (
                                <SelectItem key={factor} value={factor}>
                                  <div className="flex items-center justify-between w-full">
                                    <span className="mr-2">{factor}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      ESG Weight: {(esgFactors[factor] * 100).toFixed(0)}%
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-32 space-y-2">
                          <Label>Adjustment Value</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={adjustment.adjustmentValue}
                            onChange={(e) => updateAdjustment(compIndex, adjIndex, 'adjustmentValue', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => removeAdjustment(compIndex, adjIndex)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate ESG-Weighted Valuation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}