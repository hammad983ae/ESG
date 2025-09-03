/**
 * Improved Pasture Manager with Dropdown Selections
 * For Pasture & Livestock Operations with same functionality
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tractor, Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { convertAcreToHectare } from "@/utils/conversionUtils";

interface SelectedPasture {
  id: string;
  category: 'livestock' | 'pasture' | 'hay' | 'forage';
  type: string;
  acres: number;
  hectares: number;
  fencingAcres: number;
  fencingCoverage: number;
  establishmentYear: string;
  variety: string;
  notes: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  pastures: SelectedPasture[];
}

interface ImprovedPastureManagerProps {
  onPropertiesChange?: (properties: Property[]) => void;
}

export const ImprovedPastureManager = ({ onPropertiesChange }: ImprovedPastureManagerProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property>({
    id: crypto.randomUUID(),
    name: '',
    location: '',
    pastures: []
  });
  const [newPasture, setNewPasture] = useState({
    category: '',
    type: '',
    acres: '',
    fencingAcres: '',
    establishmentYear: '',
    variety: '',
    notes: ''
  });

  const pastureTypes = {
    livestock: [
      'Cattle Grazing', 'Sheep Grazing', 'Mixed Livestock', 'Dairy Grazing',
      'Horse Agistment', 'Goat Grazing', 'Rotational Grazing', 'Intensive Grazing'
    ],
    pasture: [
      'Improved Pasture', 'Native Pasture', 'Permanent Pasture', 'Annual Pasture',
      'Ryegrass Pasture', 'Clover Pasture', 'Lucerne Stand', 'Mixed Species'
    ],
    hay: [
      'Lucerne Hay', 'Ryegrass Hay', 'Oaten Hay', 'Wheaten Hay',
      'Clover Hay', 'Mixed Hay', 'Silage Production', 'Wrapped Silage'
    ],
    forage: [
      'Forage Sorghum', 'Forage Maize', 'Forage Oats', 'Forage Rape',
      'Brassica Forage', 'Summer Forage', 'Winter Forage', 'Browse Feed'
    ]
  };

  const addPasture = () => {
    if (!newPasture.category || !newPasture.type || !newPasture.acres) {
      toast.error('Please select pasture type, type, and enter area');
      return;
    }

    const acres = parseFloat(newPasture.acres);
    const fencingAcres = parseFloat(newPasture.fencingAcres) || 0;
    const hectares = convertAcreToHectare(acres);
    const fencingCoverage = acres > 0 ? (fencingAcres / acres) * 100 : 0;

    const pasture: SelectedPasture = {
      id: crypto.randomUUID(),
      category: newPasture.category as 'livestock' | 'pasture' | 'hay' | 'forage',
      type: newPasture.type,
      acres,
      hectares,
      fencingAcres,
      fencingCoverage,
      establishmentYear: newPasture.establishmentYear,
      variety: newPasture.variety,
      notes: newPasture.notes
    };

    const updatedProperty = {
      ...currentProperty,
      pastures: [...currentProperty.pastures, pasture]
    };
    setCurrentProperty(updatedProperty);

    setNewPasture({
      category: '',
      type: '',
      acres: '',
      fencingAcres: '',
      establishmentYear: '',
      variety: '',
      notes: ''
    });

    toast.success(`${pasture.type} added to property`);
  };

  const removePasture = (pastureId: string) => {
    const updatedProperty = {
      ...currentProperty,
      pastures: currentProperty.pastures.filter(p => p.id !== pastureId)
    };
    setCurrentProperty(updatedProperty);
    toast.success('Pasture removed');
  };

  const addProperty = () => {
    if (!currentProperty.name || currentProperty.pastures.length === 0) {
      toast.error('Please enter property name and add at least one pasture');
      return;
    }

    const updatedProperties = [...properties, currentProperty];
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);

    setCurrentProperty({
      id: crypto.randomUUID(),
      name: '',
      location: '',
      pastures: []
    });
    
    toast.success(`Property "${currentProperty.name}" added successfully`);
  };

  const removeProperty = (propertyId: string) => {
    const updatedProperties = properties.filter(p => p.id !== propertyId);
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);
    toast.success('Property removed');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'livestock': return '🐄';
      case 'pasture': return '🌿';
      case 'hay': return '🌾';
      case 'forage': return '🌱';
      default: return '🐄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'livestock': return 'bg-brown-100 text-brown-800';
      case 'pasture': return 'bg-green-100 text-green-800';
      case 'hay': return 'bg-yellow-100 text-yellow-800';
      case 'forage': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="touch-manipulation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5" />
            Pasture & Livestock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label>Property Name *</Label>
              <Input
                value={currentProperty.name}
                onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})}
                placeholder="Enter property name"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Location (optional)</Label>
              <Input
                value={currentProperty.location}
                onChange={(e) => setCurrentProperty({...currentProperty, location: e.target.value})}
                placeholder="Enter location"
                className="min-h-[44px]"
              />
            </div>
          </div>

          {/* Available Pasture Types with Dropdown Selects */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Pasture Types</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Livestock Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🐄</span>
                  Livestock
                  <Badge variant="secondary">{pastureTypes.livestock.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewPasture({...newPasture, category: 'livestock', type: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select livestock type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {pastureTypes.livestock.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pasture Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌿</span>
                  Pasture Types
                  <Badge variant="secondary">{pastureTypes.pasture.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewPasture({...newPasture, category: 'pasture', type: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select pasture type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {pastureTypes.pasture.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hay Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌾</span>
                  Hay Production
                  <Badge variant="secondary">{pastureTypes.hay.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewPasture({...newPasture, category: 'hay', type: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select hay type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {pastureTypes.hay.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Forage Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌱</span>
                  Forage Crops
                  <Badge variant="secondary">{pastureTypes.forage.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewPasture({...newPasture, category: 'forage', type: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select forage type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {pastureTypes.forage.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pasture Details Form */}
            {newPasture.type && (
              <Card className="p-4 bg-primary/5 border-dashed">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(newPasture.category)}>
                      {getCategoryIcon(newPasture.category)} {newPasture.category}
                    </Badge>
                    <Badge variant="outline">{newPasture.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Area (acres) *</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newPasture.acres}
                        onChange={(e) => setNewPasture({...newPasture, acres: e.target.value})}
                        placeholder="200"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        = {newPasture.acres ? convertAcreToHectare(parseFloat(newPasture.acres)).toFixed(2) : '0'} hectares
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Fencing (acres)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newPasture.fencingAcres}
                        onChange={(e) => setNewPasture({...newPasture, fencingAcres: e.target.value})}
                        placeholder="150"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        Coverage: {newPasture.acres && newPasture.fencingAcres 
                          ? Math.round((parseFloat(newPasture.fencingAcres) / parseFloat(newPasture.acres)) * 100) 
                          : 0}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Establishment Year</Label>
                      <Input
                        value={newPasture.establishmentYear}
                        onChange={(e) => setNewPasture({...newPasture, establishmentYear: e.target.value})}
                        placeholder="2025"
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Variety/Species</Label>
                      <Input
                        value={newPasture.variety}
                        onChange={(e) => setNewPasture({...newPasture, variety: e.target.value})}
                        placeholder="Enter variety"
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <Button onClick={addPasture} className="w-full min-h-[44px] touch-manipulation">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pasture to Property
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Current Property Pastures */}
          {currentProperty.pastures.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Current Property Pastures:</h4>
              <div className="space-y-2">
                {currentProperty.pastures.map((pasture) => (
                  <div key={pasture.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span>{getCategoryIcon(pasture.category)}</span>
                      <div>
                        <span className="font-medium">{pasture.type}</span>
                        <div className="text-sm text-muted-foreground">
                          {pasture.acres} acres • {pasture.fencingCoverage.toFixed(1)}% fenced
                          {pasture.establishmentYear && ` • Est. ${pasture.establishmentYear}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePasture(pasture.id)}
                      className="touch-manipulation min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={addProperty} className="w-full min-h-[44px] touch-manipulation" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Property ({currentProperty.pastures.length} pastures)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Properties */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Properties Added ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <h5 className="font-semibold text-lg">{property.name}</h5>
                      {property.location && (
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProperty(property.id)}
                    className="touch-manipulation min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {property.pastures.map((pasture) => (
                    <div key={pasture.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{getCategoryIcon(pasture.category)}</span>
                        <span className="font-medium text-sm">{pasture.type}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{pasture.acres} acres ({pasture.hectares.toFixed(2)} ha)</div>
                        <div>Fenced: {pasture.fencingCoverage.toFixed(1)}%</div>
                        {pasture.establishmentYear && <div>Est.: {pasture.establishmentYear}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Area:</span>
                      <p>{property.pastures.reduce((sum, p) => sum + p.acres, 0).toFixed(1)} acres</p>
                    </div>
                    <div>
                      <span className="font-medium">Pastures:</span>
                      <p>{property.pastures.length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Livestock:</span>
                      <p>{property.pastures.filter(p => p.category === 'livestock').length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Hay/Forage:</span>
                      <p>{property.pastures.filter(p => p.category === 'hay' || p.category === 'forage').length}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {properties.length === 0 && currentProperty.pastures.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Tractor className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No pastures selected yet</p>
          <p className="text-sm">Use the dropdown selects above to choose pasture types</p>
        </div>
      )}
    </div>
  );
};