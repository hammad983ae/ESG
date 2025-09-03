/**
 * Improved Horticulture Manager with Dropdown Selections
 * Mobile-optimized for all fruit and vegetable crops
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { convertAcreToHectare } from "@/utils/conversionUtils";

interface SelectedCrop {
  id: string;
  category: 'fruit' | 'vegetable' | 'herb' | 'nut';
  crop: string;
  acres: number;
  hectares: number;
  hailNettingAcres: number;
  hailNettingCoverage: number;
  plantingYear: string;
  variety: string;
  notes: string;
}

interface ImprovedHorticultureManagerProps {
  onCropsChange?: (crops: SelectedCrop[]) => void;
}

export const ImprovedHorticultureManager = ({ onCropsChange }: ImprovedHorticultureManagerProps) => {
  const [selectedCrops, setSelectedCrops] = useState<SelectedCrop[]>([]);
  const [newCrop, setNewCrop] = useState({
    category: '',
    crop: '',
    acres: '',
    hailNettingAcres: '',
    plantingYear: '',
    variety: '',
    notes: ''
  });

  const horticultureCrops = {
    fruit: [
      'Apple', 'Orange', 'Lemon', 'Lime', 'Grapefruit', 'Mandarin',
      'Stone Fruit (Peach)', 'Stone Fruit (Plum)', 'Stone Fruit (Apricot)', 'Stone Fruit (Cherry)',
      'Berry (Strawberry)', 'Berry (Blueberry)', 'Berry (Raspberry)', 'Berry (Blackberry)',
      'Avocado', 'Mango', 'Banana', 'Kiwi Fruit', 'Fig', 'Pomegranate',
      'Pear', 'Persimmon', 'Dragon Fruit', 'Passion Fruit'
    ],
    vegetable: [
      'Tomato', 'Capsicum', 'Cucumber', 'Zucchini', 'Eggplant', 'Pumpkin',
      'Lettuce', 'Spinach', 'Kale', 'Cabbage', 'Broccoli', 'Cauliflower',
      'Carrot', 'Potato', 'Sweet Potato', 'Onion', 'Garlic', 'Beetroot',
      'Corn', 'Bean (Green)', 'Pea', 'Asparagus', 'Celery', 'Leek'
    ],
    herb: [
      'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Sage', 'Parsley',
      'Coriander', 'Mint', 'Chives', 'Dill', 'Tarragon', 'Lavender'
    ],
    nut: [
      'Almond', 'Walnut', 'Pecan', 'Macadamia', 'Hazelnut', 'Pistachio',
      'Cashew', 'Brazil Nut', 'Pine Nut'
    ]
  };

  const addCrop = () => {
    if (!newCrop.category || !newCrop.crop || !newCrop.acres) {
      toast.error('Please fill in required fields');
      return;
    }

    const acres = parseFloat(newCrop.acres);
    const hailNettingAcres = parseFloat(newCrop.hailNettingAcres) || 0;
    const hectares = convertAcreToHectare(acres);
    const hailNettingCoverage = acres > 0 ? (hailNettingAcres / acres) * 100 : 0;

    const crop: SelectedCrop = {
      id: crypto.randomUUID(),
      category: newCrop.category as 'fruit' | 'vegetable' | 'herb' | 'nut',
      crop: newCrop.crop,
      acres,
      hectares,
      hailNettingAcres,
      hailNettingCoverage,
      plantingYear: newCrop.plantingYear,
      variety: newCrop.variety,
      notes: newCrop.notes
    };

    const updated = [...selectedCrops, crop];
    setSelectedCrops(updated);
    onCropsChange?.(updated);

    // Reset form
    setNewCrop({
      category: '',
      crop: '',
      acres: '',
      hailNettingAcres: '',
      plantingYear: '',
      variety: '',
      notes: ''
    });

    toast.success(`${crop.crop} added successfully`);
  };

  const removeCrop = (id: string) => {
    const updated = selectedCrops.filter(c => c.id !== id);
    setSelectedCrops(updated);
    onCropsChange?.(updated);
    toast.success('Crop removed');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fruit': return '🍎';
      case 'vegetable': return '🥕';
      case 'herb': return '🌿';
      case 'nut': return '🥜';
      default: return '🌱';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fruit': return 'bg-red-100 text-red-800';
      case 'vegetable': return 'bg-green-100 text-green-800';
      case 'herb': return 'bg-emerald-100 text-emerald-800';
      case 'nut': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="touch-manipulation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5" />
          Horticulture Crops
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select and configure fruit, vegetable, herb, and nut crops
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Available Crops</h4>
            <Button variant="outline" size="sm" className="touch-manipulation min-h-[44px]">
              <Plus className="h-4 w-4 mr-1" />
              Add Custom
            </Button>
          </div>

          {/* Add New Crop Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 border rounded-lg bg-muted/30 touch-manipulation">
            <div className="space-y-2">
              <Label>Crop Category *</Label>
              <Select 
                value={newCrop.category} 
                onValueChange={(value) => setNewCrop({...newCrop, category: value, crop: ''})}
              >
                <SelectTrigger className="bg-background z-50 min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50 max-h-[50vh] overflow-y-auto">
                  <SelectItem value="fruit">🍎 Fruit Crops</SelectItem>
                  <SelectItem value="vegetable">🥕 Vegetable Crops</SelectItem>
                  <SelectItem value="herb">🌿 Herbs & Spices</SelectItem>
                  <SelectItem value="nut">🥜 Nut Trees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Crop *</Label>
              <Select 
                value={newCrop.crop} 
                onValueChange={(value) => setNewCrop({...newCrop, crop: value})}
                disabled={!newCrop.category}
              >
                <SelectTrigger className="bg-background z-40 min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Choose crop" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-40 max-h-[40vh] overflow-y-auto">
                  {newCrop.category && horticultureCrops[newCrop.category as keyof typeof horticultureCrops]?.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Planted Area (acres) *</Label>
              <Input
                type="number"
                step="0.1"
                value={newCrop.acres}
                onChange={(e) => setNewCrop({...newCrop, acres: e.target.value})}
                placeholder="e.g., 10.5"
                className="min-h-[44px]"
              />
              <div className="text-xs text-muted-foreground">
                = {newCrop.acres ? convertAcreToHectare(parseFloat(newCrop.acres)).toFixed(2) : '0'} hectares
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hail Netting (acres)</Label>
              <Input
                type="number"
                step="0.1"
                value={newCrop.hailNettingAcres}
                onChange={(e) => setNewCrop({...newCrop, hailNettingAcres: e.target.value})}
                placeholder="e.g., 5.0"
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
                placeholder="e.g., 2025"
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Variety (optional)</Label>
              <Input
                value={newCrop.variety}
                onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                placeholder="Enter variety"
                className="min-h-[44px]"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>Notes & Comments</Label>
              <Textarea
                value={newCrop.notes}
                onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                placeholder="Additional notes about this crop"
                rows={3}
                className="min-h-[100px]"
              />
            </div>

            <div className="sm:col-span-2">
              <Button onClick={addCrop} className="w-full min-h-[44px] touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Crops */}
        {selectedCrops.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Selected Crops ({selectedCrops.length})</h4>
            <div className="space-y-3">
              {selectedCrops.map((crop) => (
                <Card key={crop.id} className="p-4 touch-manipulation">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(crop.category)}</span>
                      <div>
                        <h5 className="font-semibold text-lg">{crop.crop}</h5>
                        <Badge className={getCategoryColor(crop.category)} variant="secondary">
                          {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
                        </Badge>
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Area:</span>
                      <p>{crop.acres} acres</p>
                      <p className="text-muted-foreground">{crop.hectares.toFixed(2)} hectares</p>
                    </div>
                    <div>
                      <span className="font-medium">Hail Netting:</span>
                      <p>{crop.hailNettingAcres} acres</p>
                      <p className="text-muted-foreground">{crop.hailNettingCoverage.toFixed(1)}% coverage</p>
                    </div>
                    <div>
                      <span className="font-medium">Planting Year:</span>
                      <p>{crop.plantingYear || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Variety:</span>
                      <p>{crop.variety || 'Standard'}</p>
                    </div>
                  </div>

                  {crop.notes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded">
                      <span className="font-medium text-sm">Notes: </span>
                      <span className="text-sm">{crop.notes}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-primary/5 rounded-lg">
              <h5 className="font-semibold mb-2">Summary</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Area:</span>
                  <p>{selectedCrops.reduce((sum, c) => sum + c.acres, 0).toFixed(1)} acres</p>
                </div>
                <div>
                  <span className="font-medium">Hail Protected:</span>
                  <p>{selectedCrops.reduce((sum, c) => sum + c.hailNettingAcres, 0).toFixed(1)} acres</p>
                </div>
                <div>
                  <span className="font-medium">Fruit Crops:</span>
                  <p>{selectedCrops.filter(c => c.category === 'fruit').length}</p>
                </div>
                <div>
                  <span className="font-medium">Other Crops:</span>
                  <p>{selectedCrops.filter(c => c.category !== 'fruit').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCrops.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No crops selected yet</p>
            <p className="text-sm">Choose crop categories and varieties above to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};