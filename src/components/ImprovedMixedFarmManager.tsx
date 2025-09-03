/**
 * Improved Mixed Farm Manager with Dropdown Selections
 * For Mixed Farming Operations with same functionality
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

interface SelectedOperation {
  id: string;
  category: 'crops' | 'livestock' | 'orchard' | 'pasture';
  operation: string;
  acres: number;
  hectares: number;
  hailNettingAcres: number;
  hailNettingCoverage: number;
  establishmentYear: string;
  variety: string;
  notes: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  operations: SelectedOperation[];
}

interface ImprovedMixedFarmManagerProps {
  onPropertiesChange?: (properties: Property[]) => void;
}

export const ImprovedMixedFarmManager = ({ onPropertiesChange }: ImprovedMixedFarmManagerProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property>({
    id: crypto.randomUUID(),
    name: '',
    location: '',
    operations: []
  });
  const [newOperation, setNewOperation] = useState({
    category: '',
    operation: '',
    acres: '',
    hailNettingAcres: '',
    establishmentYear: '',
    variety: '',
    notes: ''
  });

  const operationTypes = {
    crops: [
      'Annual Crops', 'Wheat', 'Barley', 'Canola', 'Oats', 'Corn', 'Soybeans',
      'Cotton', 'Rice', 'Sunflower', 'Sorghum'
    ],
    livestock: [
      'Cattle Grazing', 'Sheep Grazing', 'Dairy Operation', 'Goat Farming',
      'Pig Farming', 'Poultry (Chickens)', 'Poultry (Ducks)', 'Horse Agistment'
    ],
    orchard: [
      'Apple Orchard', 'Citrus Orchard', 'Stone Fruit', 'Avocado', 'Nut Trees',
      'Berry Farm', 'Vineyard', 'Olive Grove'
    ],
    pasture: [
      'Improved Pasture', 'Native Pasture', 'Lucerne', 'Clover Pasture',
      'Ryegrass Pasture', 'Hay Production', 'Silage Production'
    ]
  };

  const addOperation = () => {
    if (!newOperation.category || !newOperation.operation || !newOperation.acres) {
      toast.error('Please select operation type, operation, and enter area');
      return;
    }

    const acres = parseFloat(newOperation.acres);
    const hailNettingAcres = parseFloat(newOperation.hailNettingAcres) || 0;
    const hectares = convertAcreToHectare(acres);
    const hailNettingCoverage = acres > 0 ? (hailNettingAcres / acres) * 100 : 0;

    const operation: SelectedOperation = {
      id: crypto.randomUUID(),
      category: newOperation.category as 'crops' | 'livestock' | 'orchard' | 'pasture',
      operation: newOperation.operation,
      acres,
      hectares,
      hailNettingAcres,
      hailNettingCoverage,
      establishmentYear: newOperation.establishmentYear,
      variety: newOperation.variety,
      notes: newOperation.notes
    };

    const updatedProperty = {
      ...currentProperty,
      operations: [...currentProperty.operations, operation]
    };
    setCurrentProperty(updatedProperty);

    setNewOperation({
      category: '',
      operation: '',
      acres: '',
      hailNettingAcres: '',
      establishmentYear: '',
      variety: '',
      notes: ''
    });

    toast.success(`${operation.operation} added to property`);
  };

  const removeOperation = (operationId: string) => {
    const updatedProperty = {
      ...currentProperty,
      operations: currentProperty.operations.filter(o => o.id !== operationId)
    };
    setCurrentProperty(updatedProperty);
    toast.success('Operation removed');
  };

  const addProperty = () => {
    if (!currentProperty.name || currentProperty.operations.length === 0) {
      toast.error('Please enter property name and add at least one operation');
      return;
    }

    const updatedProperties = [...properties, currentProperty];
    setProperties(updatedProperties);
    onPropertiesChange?.(updatedProperties);

    setCurrentProperty({
      id: crypto.randomUUID(),
      name: '',
      location: '',
      operations: []
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
      case 'crops': return '🌾';
      case 'livestock': return '🐄';
      case 'orchard': return '🍎';
      case 'pasture': return '🌿';
      default: return '🚜';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crops': return 'bg-yellow-100 text-yellow-800';
      case 'livestock': return 'bg-brown-100 text-brown-800';
      case 'orchard': return 'bg-red-100 text-red-800';
      case 'pasture': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="touch-manipulation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5" />
            Mixed Farm Operations
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

          {/* Available Operations with Dropdown Selects */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Operations</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Crops Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌾</span>
                  Crop Operations
                  <Badge variant="secondary">{operationTypes.crops.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewOperation({...newOperation, category: 'crops', operation: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select crop operation" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {operationTypes.crops.map((operation) => (
                      <SelectItem key={operation} value={operation}>{operation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Livestock Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🐄</span>
                  Livestock Operations
                  <Badge variant="secondary">{operationTypes.livestock.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewOperation({...newOperation, category: 'livestock', operation: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select livestock operation" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {operationTypes.livestock.map((operation) => (
                      <SelectItem key={operation} value={operation}>{operation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Orchard Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🍎</span>
                  Orchard Operations
                  <Badge variant="secondary">{operationTypes.orchard.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewOperation({...newOperation, category: 'orchard', operation: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select orchard operation" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {operationTypes.orchard.map((operation) => (
                      <SelectItem key={operation} value={operation}>{operation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pasture Dropdown */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🌿</span>
                  Pasture Operations
                  <Badge variant="secondary">{operationTypes.pasture.length}</Badge>
                </Label>
                <Select onValueChange={(value) => {
                  setNewOperation({...newOperation, category: 'pasture', operation: value});
                }}>
                  <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Select pasture operation" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                    {operationTypes.pasture.map((operation) => (
                      <SelectItem key={operation} value={operation}>{operation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Operation Details Form */}
            {newOperation.operation && (
              <Card className="p-4 bg-primary/5 border-dashed">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(newOperation.category)}>
                      {getCategoryIcon(newOperation.category)} {newOperation.category}
                    </Badge>
                    <Badge variant="outline">{newOperation.operation}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Area (acres) *</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newOperation.acres}
                        onChange={(e) => setNewOperation({...newOperation, acres: e.target.value})}
                        placeholder="100"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        = {newOperation.acres ? convertAcreToHectare(parseFloat(newOperation.acres)).toFixed(2) : '0'} hectares
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Protection (acres)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newOperation.hailNettingAcres}
                        onChange={(e) => setNewOperation({...newOperation, hailNettingAcres: e.target.value})}
                        placeholder="50"
                        className="min-h-[44px]"
                      />
                      <div className="text-xs text-muted-foreground">
                        Coverage: {newOperation.acres && newOperation.hailNettingAcres 
                          ? Math.round((parseFloat(newOperation.hailNettingAcres) / parseFloat(newOperation.acres)) * 100) 
                          : 0}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Establishment Year</Label>
                      <Input
                        value={newOperation.establishmentYear}
                        onChange={(e) => setNewOperation({...newOperation, establishmentYear: e.target.value})}
                        placeholder="2025"
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Variety/Type</Label>
                      <Input
                        value={newOperation.variety}
                        onChange={(e) => setNewOperation({...newOperation, variety: e.target.value})}
                        placeholder="Enter variety"
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  <Button onClick={addOperation} className="w-full min-h-[44px] touch-manipulation">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Operation to Property
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Current Property Operations */}
          {currentProperty.operations.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Current Property Operations:</h4>
              <div className="space-y-2">
                {currentProperty.operations.map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span>{getCategoryIcon(operation.category)}</span>
                      <div>
                        <span className="font-medium">{operation.operation}</span>
                        <div className="text-sm text-muted-foreground">
                          {operation.acres} acres • {operation.hailNettingCoverage.toFixed(1)}% protection
                          {operation.establishmentYear && ` • Est. ${operation.establishmentYear}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeOperation(operation.id)}
                      className="touch-manipulation min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={addProperty} className="w-full min-h-[44px] touch-manipulation" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Property ({currentProperty.operations.length} operations)
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
                  {property.operations.map((operation) => (
                    <div key={operation.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{getCategoryIcon(operation.category)}</span>
                        <span className="font-medium text-sm">{operation.operation}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{operation.acres} acres ({operation.hectares.toFixed(2)} ha)</div>
                        <div>Protection: {operation.hailNettingCoverage.toFixed(1)}%</div>
                        {operation.establishmentYear && <div>Est.: {operation.establishmentYear}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Area:</span>
                      <p>{property.operations.reduce((sum, o) => sum + o.acres, 0).toFixed(1)} acres</p>
                    </div>
                    <div>
                      <span className="font-medium">Operations:</span>
                      <p>{property.operations.length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Crop Ops:</span>
                      <p>{property.operations.filter(o => o.category === 'crops').length}</p>
                    </div>
                    <div>
                      <span className="font-medium">Livestock:</span>
                      <p>{property.operations.filter(o => o.category === 'livestock').length}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {properties.length === 0 && currentProperty.operations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Tractor className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No operations selected yet</p>
          <p className="text-sm">Use the dropdown selects above to choose farm operations</p>
        </div>
      )}
    </div>
  );
};