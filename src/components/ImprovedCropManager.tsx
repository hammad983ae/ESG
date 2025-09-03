/**
 * Improved Crop Manager with Dropdown Selections
 * For Annual Crops with same functionality as grape varieties
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wheat, Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { convertAcreToHectare } from "@/utils/conversionUtils";

interface SelectedCrop {
  id: string;
  category: 'grain' | 'oilseed' | 'fiber' | 'legume';
  crop: string;
  acres: number;
  hectares: number;
  hailNettingAcres: number;
  hailNettingCoverage: number;
  plantingYear: string;
  variety: string;
  notes: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  crops: SelectedCrop[];
}

interface ImprovedCropManagerProps {
  onPropertiesChange?: (properties: Property[]) => void;
}

export const ImprovedCropManager = ({ onPropertiesChange }: ImprovedCropManagerProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property>({
    id: crypto.randomUUID(),
    name: '',
    location: '',
    crops: []
  });
  const [newCrop, setNewCrop] = useState({
    category: '',
    crop: '',
    acres: '',
    hailNettingAcres: '',
    plantingYear: '',
    variety: '',
    notes: ''
  });

  const cropTypes = {
    grain: [
      'Wheat', 'Barley', 'Oats', 'Rye', 'Corn (Maize)', 'Rice', 'Sorghum', 
      'Millet', 'Triticale', 'Quinoa', 'Buckwheat'
    ],
    oilseed: [
      'Canola', 'Sunflower', 'Safflower', 'Linseed (Flax)', 'Sesame',
      'Mustard Seed', 'Camelina', 'Crambe'
    ],
    fiber: [
      'Cotton', 'Hemp', 'Flax (Fiber)', 'Jute', 'Kenaf'
    ],
    legume: [
      'Soybeans', 'Field Peas', 'Chickpeas', 'Lentils', 'Black Beans',
      'Navy Beans', 'Pinto Beans', 'Faba Beans', 'Lupins', 'Cowpeas'
    ]
  };

  const addCrop = () => {
    if (!newCrop.category || !newCrop.crop || !newCrop.acres) {
      toast.error('Please select crop type, crop, and enter area');
      return;
    }

    const acres = parseFloat(newCrop.acres);
    const hailNettingAcres = parseFloat(newCrop.hailNettingAcres) || 0;
    const hectares = convertAcreToHectare(acres);
    const hailNettingCoverage = acres > 0 ? (hailNettingAcres / acres) * 100 : 0;

    const crop: SelectedCrop = {
      id: crypto.randomUUID(),
      category: newCrop.category as 'grain' | 'oilseed' | 'fiber' | 'legume',
      crop: newCrop.crop,
      acres,
      hectares,
      hailNettingAcres,
      hailNettingCoverage,
      plantingYear: newCrop.plantingYear,
      variety: newCrop.variety,
      notes: newCrop.notes
    };

    const updatedProperty = {
      ...currentProperty,
      crops: [...currentProperty.crops, crop]
    };
    setCurrentProperty(updatedProperty);

    setNewCrop({
      category: '',
      crop: '',
      acres: '',
      hailNettingAcres: '',
      plantingYear: '',
      variety: '',
      notes: ''
    });

    toast.success(`${crop.crop} added to property`);
  };

  const removeCrop = (cropId: string) => {
    const updatedProperty = {
      ...currentProperty,
      crops: currentProperty.crops.filter(c => c.id !== cropId)
    };
    setCurrentProperty(updatedProperty);
    toast.success('Crop removed');
  };

  const addProperty = () => {
    if (!currentProperty.name || currentProperty.crops.length === 0) {
      toast.error('Please enter property name and add at least one crop');
      return;
    }

    const updatedProperties = [...properties, currentProperty];
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);

    setCurrentProperty({
      id: crypto.randomUUID(),
      name: '',
      location: '',
      crops: []
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
      case 'grain': return '🌾';
      case 'oilseed': return '🌻';
      case 'fiber': return '🌱';
      case 'legume': return '🫘';
      default: return '🌾';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grain': return 'bg-yellow-100 text-yellow-800';
      case 'oilseed': return 'bg-orange-100 text-orange-800';
      case 'fiber': return 'bg-green-100 text-green-800';
      case 'legume': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="touch-manipulation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Annual Crops
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

          {/* Available Crops with Dropdown Selects */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Crops</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Grain Crops Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌾</span>
                  Grain Crops
                  <Badge variant="secondary">{cropTypes.grain.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewCrop({...newCrop, category: 'grain', crop: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select grain crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {cropTypes.grain.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Oilseed Crops Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌻</span>
                  Oilseed Crops
                  <Badge variant="secondary">{cropTypes.oilseed.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewCrop({...newCrop, category: 'oilseed', crop: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select oilseed crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {cropTypes.oilseed.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fiber Crops Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌱</span>
                  Fiber Crops
                  <Badge variant="secondary">{cropTypes.fiber.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewCrop({...newCrop, category: 'fiber', crop: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select fiber crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {cropTypes.fiber.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Legume Crops Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🫘</span>
                  Legume Crops
                  <Badge variant="secondary">{cropTypes.legume.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewCrop({...newCrop, category: 'legume', crop: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select legume crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {cropTypes.legume.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Crop Details Form */}
            {newCrop.crop && (
              <Card className="p-4 bg-primary/5 border-dashed">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(newCrop.category)}>
                      {getCategoryIcon(newCrop.category)} {newCrop.category}
                    </Badge>
                    <Badge variant="outline">{newCrop.crop}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Planted Area (acres) *</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newCrop.acres}
                        onChange={(e) => setNewCrop({...newCrop, acres: e.target.value})}
                        placeholder="100"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        = {newCrop.acres ? convertAcreToHectare(parseFloat(newCrop.acres)).toFixed(2) : '0'} hectares
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hail Coverage (acres)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newCrop.hailNettingAcres}
                        onChange={(e) => setNewCrop({...newCrop, hailNettingAcres: e.target.value})}
                        placeholder="50"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        Coverage: {newCrop.acres && newCrop.hailNettingAcres 
                          ? Math.round((parseFloat(newCrop.hailNettingAcres) / parseFloat(newCrop.acres)) * 100) 
                          : 0}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Planting Year</Label>
                      <Input
                        value={newCrop.plantingYear}
                        onChange={(e) => setNewCrop({...newCrop, plantingYear: e.target.value})}
                        placeholder="2025"
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Variety</Label>
                      <Input
                        value={newCrop.variety}
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        placeholder="Enter variety"
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <Button onClick={addCrop} className="w-full min-h-[44px] touch-manipulation">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Crop to Property
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Current Property Crops */}
          {currentProperty.crops.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Current Property Crops:</h4>
              <div className="space-y-2">
                {currentProperty.crops.map((crop) => (
                  <div key={crop.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span>{getCategoryIcon(crop.category)}</span>
                      <div>
                        <span className="font-medium">{crop.crop}</span>
                        <div className="text-sm text-muted-foreground">
                          {crop.acres} acres • {crop.hailNettingCoverage.toFixed(1)}% coverage
                          {crop.plantingYear && ` • ${crop.plantingYear}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCrop(crop.id)}
                      className="touch-manipulation min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={addProperty} className="w-full min-h-[44px] touch-manipulation" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Property ({currentProperty.crops.length} crops)
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
                  {property.crops.map((crop) => (
                    <div key={crop.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{getCategoryIcon(crop.category)}</span>
                        <span className="font-medium text-sm">{crop.crop}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{crop.acres} acres ({crop.hectares.toFixed(2)} ha)</div>
                        <div>Coverage: {crop.hailNettingCoverage.toFixed(1)}%</div>
                        {crop.plantingYear && <div>Year: {crop.plantingYear}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Area:</span>
                      <p>{property.crops.reduce((sum, c) => sum + c.acres, 0).toFixed(1)} acres</p>
                    </div>
                    <div>
                      <span className="font-medium">Crops:</span>
                      <p>{property.crops.length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Grain Crops:</span>
                      <p>{property.crops.filter(c => c.category === 'grain').length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Other Types:</span>
                      <p>{property.crops.filter(c => c.category !== 'grain').length}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {properties.length === 0 && currentProperty.crops.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Wheat className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No crops selected yet</p>
          <p className="text-sm">Use the dropdown selects above to choose crop types</p>
        </div>
      )}
    </div>
  );
};