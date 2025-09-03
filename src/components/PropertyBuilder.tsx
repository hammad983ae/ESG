/**
 * Property Builder Component
 * Allows users to construct custom property profiles with detailed specifications
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Plus, Save, FileText } from "lucide-react";
import { toast } from "sonner";

interface PropertySpec {
  id: string;
  name: string;
  value: string;
  unit: string;
  category: string;
}

interface PropertyProfile {
  name: string;
  type: string;
  location: string;
  specifications: PropertySpec[];
  notes: string;
}

interface PropertyBuilderProps {
  onSave: (profile: PropertyProfile) => void;
}

const PROPERTY_TYPES = [
  { value: 'commercial-office', label: 'Commercial Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residential' },
  { value: 'big-box', label: 'Big Box Retail' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'childcare', label: 'Childcare' }
];

const DEFAULT_SPECS: Record<string, PropertySpec[]> = {
  'commercial-office': [
    { id: '1', name: 'Floor Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '2', name: 'Number of Floors', value: '', unit: 'floors', category: 'Physical' },
    { id: '3', name: 'Car Spaces', value: '', unit: 'spaces', category: 'Physical' },
    { id: '4', name: 'Annual Rent', value: '', unit: 'AUD', category: 'Financial' },
    { id: '5', name: 'Operating Expenses', value: '', unit: 'AUD', category: 'Financial' },
    { id: '6', name: 'Occupancy Rate', value: '', unit: '%', category: 'Performance' }
  ],
  'retail': [
    { id: '1', name: 'Floor Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '2', name: 'Street Frontage', value: '', unit: 'm', category: 'Physical' },
    { id: '3', name: 'Car Spaces', value: '', unit: 'spaces', category: 'Physical' },
    { id: '4', name: 'Annual Rent', value: '', unit: 'AUD', category: 'Financial' },
    { id: '5', name: 'Outgoings', value: '', unit: 'AUD', category: 'Financial' }
  ],
  'industrial': [
    { id: '1', name: 'Floor Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '2', name: 'Land Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '3', name: 'Ceiling Height', value: '', unit: 'm', category: 'Physical' },
    { id: '4', name: 'Loading Docks', value: '', unit: 'docks', category: 'Physical' },
    { id: '5', name: 'Annual Rent', value: '', unit: 'AUD', category: 'Financial' }
  ],
  'residential': [
    { id: '1', name: 'Floor Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '2', name: 'Land Area', value: '', unit: 'sqm', category: 'Physical' },
    { id: '3', name: 'Bedrooms', value: '', unit: 'rooms', category: 'Physical' },
    { id: '4', name: 'Bathrooms', value: '', unit: 'rooms', category: 'Physical' },
    { id: '5', name: 'Car Spaces', value: '', unit: 'spaces', category: 'Physical' },
    { id: '6', name: 'Weekly Rent', value: '', unit: 'AUD', category: 'Financial' }
  ]
};

export function PropertyBuilder({ onSave }: PropertyBuilderProps) {
  const [profile, setProfile] = useState<PropertyProfile>({
    name: '',
    type: '',
    location: '',
    specifications: [],
    notes: ''
  });

  const handleTypeChange = (type: string) => {
    setProfile(prev => ({
      ...prev,
      type,
      specifications: DEFAULT_SPECS[type] || []
    }));
  };

  const updateSpecification = (id: string, field: keyof PropertySpec, value: string) => {
    setProfile(prev => ({
      ...prev,
      specifications: prev.specifications.map(spec =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const addCustomSpecification = () => {
    const newId = Date.now().toString();
    const newSpec: PropertySpec = {
      id: newId,
      name: '',
      value: '',
      unit: '',
      category: 'Custom'
    };
    
    setProfile(prev => ({
      ...prev,
      specifications: [...prev.specifications, newSpec]
    }));
  };

  const removeSpecification = (id: string) => {
    setProfile(prev => ({
      ...prev,
      specifications: prev.specifications.filter(spec => spec.id !== id)
    }));
  };

  const handleSave = () => {
    if (!profile.name || !profile.type) {
      toast.error("Please fill in property name and type");
      return;
    }

    onSave(profile);
    toast.success("Property profile saved successfully!");
    
    // Reset form
    setProfile({
      name: '',
      type: '',
      location: '',
      specifications: [],
      notes: ''
    });
  };

  const groupedSpecs = profile.specifications.reduce((acc, spec) => {
    if (!acc[spec.category]) {
      acc[spec.category] = [];
    }
    acc[spec.category].push(spec);
    return acc;
  }, {} as Record<string, PropertySpec[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Property Builder
          </CardTitle>
          <CardDescription>
            Create custom property profiles with detailed specifications and characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property-name">Property Name</Label>
              <Input
                id="property-name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter property name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={profile.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property-location">Location</Label>
              <Input
                id="property-location"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Property Specifications */}
          {profile.type && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Property Specifications</h3>
                <Button onClick={addCustomSpecification} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Spec
                </Button>
              </div>

              {Object.entries(groupedSpecs).map(([category, specs]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{category}</Badge>
                    <Separator className="flex-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specs.map(spec => (
                      <div key={spec.id} className="border rounded-lg p-4 space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Specification Name</Label>
                          <Input
                            value={spec.name}
                            onChange={(e) => updateSpecification(spec.id, 'name', e.target.value)}
                            placeholder="Specification name"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Value</Label>
                            <Input
                              value={spec.value}
                              onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                              placeholder="Value"
                              className="h-8"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Unit</Label>
                            <Input
                              value={spec.unit}
                              onChange={(e) => updateSpecification(spec.id, 'unit', e.target.value)}
                              placeholder="Unit"
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        {spec.category === 'Custom' && (
                          <Button
                            onClick={() => removeSpecification(spec.id)}
                            variant="ghost"
                            size="sm"
                            className="w-full text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="property-notes">Additional Notes</Label>
            <textarea
              id="property-notes"
              value={profile.notes}
              onChange={(e) => setProfile(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about the property..."
              className="w-full p-3 border rounded-md resize-none h-24 text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Property Profile
            </Button>
            
            <Button variant="outline" onClick={() => toast.info("Export functionality coming soon!")}>
              <FileText className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}