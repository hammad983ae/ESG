import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export interface PropertyData {
  propertyName: string;
  location: string;
  propertyType: string;
  yearBuilt: number;
  squareFootage: number;
  actualEnergyUse: number;
  benchmarkEnergyUse: number;
  waterEfficientFixtures: number;
  totalFixtures: number;
  hasRecyclingProgram: boolean;
  hasComposting: boolean;
  sustainableMaterialsPercentage: number;
  meetsADAStandards: "full" | "partial" | "none";
  hasGoodAirQuality: boolean;
  hasNaturalLight: boolean;
  hasErgonomicDesign: boolean;
  hasCommunitySpace: boolean;
  hasLocalSourcing: boolean;
  certifications: string[];
  esgDataPublic: boolean;
  esgReportAvailable: boolean;
  riskManagementPractices: number;
  totalPotentialPractices: number;
  notes: string;
}

interface PropertyAssessmentFormProps {
  onSubmit: (data: PropertyData) => void;
}

export function PropertyAssessmentForm({ onSubmit }: PropertyAssessmentFormProps) {
  const [formData, setFormData] = useState<PropertyData>({
    propertyName: "",
    location: "",
    propertyType: "",
    yearBuilt: new Date().getFullYear(),
    squareFootage: 0,
    actualEnergyUse: 0,
    benchmarkEnergyUse: 0,
    waterEfficientFixtures: 0,
    totalFixtures: 0,
    hasRecyclingProgram: false,
    hasComposting: false,
    sustainableMaterialsPercentage: 0,
    meetsADAStandards: "none",
    hasGoodAirQuality: false,
    hasNaturalLight: false,
    hasErgonomicDesign: false,
    hasCommunitySpace: false,
    hasLocalSourcing: false,
    certifications: [],
    esgDataPublic: false,
    esgReportAvailable: false,
    riskManagementPractices: 0,
    totalPotentialPractices: 10,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof PropertyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationChange = (certification: string, checked: boolean) => {
    if (checked) {
      updateField("certifications", [...formData.certifications, certification]);
    } else {
      updateField("certifications", formData.certifications.filter(c => c !== certification));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Property Assessment Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propertyName">Property Name</Label>
              <Input
                id="propertyName"
                value={formData.propertyName}
                onChange={(e) => updateField("propertyName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(value) => updateField("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Building</SelectItem>
                  <SelectItem value="retail">Retail Space</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => updateField("yearBuilt", parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                value={formData.squareFootage}
                onChange={(e) => updateField("squareFootage", parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Energy Efficiency */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Energy Efficiency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actualEnergyUse">Actual Energy Use (kWh/sq ft/year)</Label>
                <Input
                  id="actualEnergyUse"
                  type="number"
                  step="0.1"
                  value={formData.actualEnergyUse}
                  onChange={(e) => updateField("actualEnergyUse", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="benchmarkEnergyUse">Benchmark Energy Use (kWh/sq ft/year)</Label>
                <Input
                  id="benchmarkEnergyUse"
                  type="number"
                  step="0.1"
                  value={formData.benchmarkEnergyUse}
                  onChange={(e) => updateField("benchmarkEnergyUse", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Water Conservation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Water Conservation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterEfficientFixtures">Water Efficient Fixtures</Label>
                <Input
                  id="waterEfficientFixtures"
                  type="number"
                  value={formData.waterEfficientFixtures}
                  onChange={(e) => updateField("waterEfficientFixtures", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="totalFixtures">Total Fixtures</Label>
                <Input
                  id="totalFixtures"
                  type="number"
                  value={formData.totalFixtures}
                  onChange={(e) => updateField("totalFixtures", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Waste Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Waste Management</h3>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recycling"
                  checked={formData.hasRecyclingProgram}
                  onCheckedChange={(checked) => updateField("hasRecyclingProgram", checked)}
                />
                <Label htmlFor="recycling">Has Recycling Program</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="composting"
                  checked={formData.hasComposting}
                  onCheckedChange={(checked) => updateField("hasComposting", checked)}
                />
                <Label htmlFor="composting">Has Composting</Label>
              </div>
            </div>
          </div>

          {/* Sustainable Materials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Sustainable Materials</h3>
            <div>
              <Label htmlFor="sustainableMaterials">Sustainable Materials Percentage (%)</Label>
              <Input
                id="sustainableMaterials"
                type="number"
                min="0"
                max="100"
                value={formData.sustainableMaterialsPercentage}
                onChange={(e) => updateField("sustainableMaterialsPercentage", parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Social Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Social Impact</h3>
            <div>
              <Label htmlFor="adaStandards">ADA Standards Compliance</Label>
              <Select 
                value={formData.meetsADAStandards} 
                onValueChange={(value: "full" | "partial" | "none") => updateField("meetsADAStandards", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Fully Compliant</SelectItem>
                  <SelectItem value="partial">Partially Compliant</SelectItem>
                  <SelectItem value="none">Not Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="airQuality"
                    checked={formData.hasGoodAirQuality}
                    onCheckedChange={(checked) => updateField("hasGoodAirQuality", checked)}
                  />
                  <Label htmlFor="airQuality">Good Air Quality</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="naturalLight"
                    checked={formData.hasNaturalLight}
                    onCheckedChange={(checked) => updateField("hasNaturalLight", checked)}
                  />
                  <Label htmlFor="naturalLight">Natural Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ergonomicDesign"
                    checked={formData.hasErgonomicDesign}
                    onCheckedChange={(checked) => updateField("hasErgonomicDesign", checked)}
                  />
                  <Label htmlFor="ergonomicDesign">Ergonomic Design</Label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="communitySpace"
                    checked={formData.hasCommunitySpace}
                    onCheckedChange={(checked) => updateField("hasCommunitySpace", checked)}
                  />
                  <Label htmlFor="communitySpace">Community Space</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="localSourcing"
                    checked={formData.hasLocalSourcing}
                    onCheckedChange={(checked) => updateField("hasLocalSourcing", checked)}
                  />
                  <Label htmlFor="localSourcing">Local Sourcing</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Certifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["LEED", "ENERGY STAR", "Green Star", "NABERS", "BREEAM", "Other"].map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={formData.certifications.includes(cert)}
                    onCheckedChange={(checked) => handleCertificationChange(cert, !!checked)}
                  />
                  <Label htmlFor={cert}>{cert}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Governance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Governance & Transparency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="esgDataPublic"
                  checked={formData.esgDataPublic}
                  onCheckedChange={(checked) => updateField("esgDataPublic", checked)}
                />
                <Label htmlFor="esgDataPublic">ESG Data Publicly Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="esgReport"
                  checked={formData.esgReportAvailable}
                  onCheckedChange={(checked) => updateField("esgReportAvailable", checked)}
                />
                <Label htmlFor="esgReport">ESG Report Available</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="riskPractices">Risk Management Practices Implemented</Label>
                <Input
                  id="riskPractices"
                  type="number"
                  min="0"
                  value={formData.riskManagementPractices}
                  onChange={(e) => updateField("riskManagementPractices", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="totalPractices">Total Potential Practices</Label>
                <Input
                  id="totalPractices"
                  type="number"
                  min="1"
                  value={formData.totalPotentialPractices}
                  onChange={(e) => updateField("totalPotentialPractices", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              placeholder="Any additional information about the property..."
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Calculate ESG Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}