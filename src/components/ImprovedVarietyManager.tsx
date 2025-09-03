/**
 * Improved Variety Manager with Dropdown Selections
 * Clean interface for selecting grape varieties and custom additions
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Grape, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { convertAcreToHectare } from "@/utils/conversionUtils";

interface SelectedVariety {
  id: string;
  category: 'wine' | 'table' | 'dried';
  variety: string;
  acres: number;
  hectares: number;
  hailNettingAcres: number;
  hailNettingCoverage: number;
  plantingYear: string;
  cloneSelection: string;
  notes: string;
}

interface ImprovedVarietyManagerProps {
  onVarietiesChange?: (varieties: SelectedVariety[]) => void;
}

export const ImprovedVarietyManager = ({ onVarietiesChange }: ImprovedVarietyManagerProps) => {
  const [selectedVarieties, setSelectedVarieties] = useState<SelectedVariety[]>([]);
  const [newVariety, setNewVariety] = useState({
    category: '',
    variety: '',
    acres: '',
    hailNettingAcres: '',
    plantingYear: '',
    cloneSelection: '',
    notes: ''
  });

  const grapeVarieties = {
    wine: [
      'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay', 'Sauvignon Blanc',
      'Riesling', 'Syrah/Shiraz', 'Zinfandel', 'Grenache', 'Tempranillo',
      'Sangiovese', 'Nebbiolo', 'Malbec', 'Petit Verdot'
    ],
    table: [
      'Jack Salute', 'Red Globe', 'Thompson Seedless', 'Flame Seedless',
      'Ruby Seedless', 'Princess', 'Crimson Seedless', 'Autumn Royal',
      'Sugraone', 'Black Beauty', 'Italia', 'Cardinal',
      // SNFL Red Seedless Varieties
      'Navsel 3', 'Sunrise Red (Sheegene 8)', 'Navsel 20', 'Navsel 21',
      'Carlita (Sheegene 25)', 'Krissy (Sheegene 12)', 'Timco (Sheegene 13)',
      'Allison (Sheegene 20)',
      // SNFL Green Seedless Varieties
      'Kelly (Sheegene 18)', 'Navsel 6', 'Navsel 5', 'Ivory (Sheegene 21)',
      'Timpson (Sheegene 2)', 'Great Green (Sheegene 17)', 'Navsel 1',
      // SNFL Black Seedless Varieties
      'Sheegene 105', 'Sheegene 101', 'Sheegene 104'
    ],
    dried: [
      'Sultana (Thompson Seedless)', 'Currants (Black Corinth)', 'Muscat Gordo Blanco',
      'Carina Currants', 'Flame Seedless (Raisins)', 'Ruby Seedless (Raisins)',
      'Sunmuscat', 'Sultana H5', 'Merbein Seedless', 'Menindee Seedless'
    ]
  };

  const addVariety = () => {
    if (!newVariety.category || !newVariety.variety || !newVariety.acres) {
      toast.error('Please fill in required fields');
      return;
    }

    const acres = parseFloat(newVariety.acres);
    const hailNettingAcres = parseFloat(newVariety.hailNettingAcres) || 0;
    const hectares = convertAcreToHectare(acres);
    const hailNettingCoverage = acres > 0 ? (hailNettingAcres / acres) * 100 : 0;

    const variety: SelectedVariety = {
      id: crypto.randomUUID(),
      category: newVariety.category as 'wine' | 'table' | 'dried',
      variety: newVariety.variety,
      acres,
      hectares,
      hailNettingAcres,
      hailNettingCoverage,
      plantingYear: newVariety.plantingYear,
      cloneSelection: newVariety.cloneSelection,
      notes: newVariety.notes
    };

    const updated = [...selectedVarieties, variety];
    setSelectedVarieties(updated);
    onVarietiesChange?.(updated);

    // Reset form
    setNewVariety({
      category: '',
      variety: '',
      acres: '',
      hailNettingAcres: '',
      plantingYear: '',
      cloneSelection: '',
      notes: ''
    });

    toast.success(`${variety.variety} added successfully`);
  };

  const removeVariety = (id: string) => {
    const updated = selectedVarieties.filter(v => v.id !== id);
    setSelectedVarieties(updated);
    onVarietiesChange?.(updated);
    toast.success('Variety removed');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wine': return '🍷';
      case 'table': return '🍇';
      case 'dried': return '🫐';
      default: return '🍇';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wine': return 'bg-purple-100 text-purple-800';
      case 'table': return 'bg-green-100 text-green-800';
      case 'dried': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grape className="h-5 w-5" />
          Grape Varieties
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select and configure grape varieties for your vineyard operations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Varieties - Add Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Available Varieties</h4>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Custom
            </Button>
          </div>

          {/* Add New Variety Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 border rounded-lg bg-muted/30 touch-manipulation">
            <div className="space-y-2">
              <Label>Grape Category *</Label>
              <Select 
                value={newVariety.category} 
                onValueChange={(value) => setNewVariety({...newVariety, category: value, variety: ''})}
              >
                <SelectTrigger className="bg-background z-50 min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50 max-h-[50vh] overflow-y-auto">
                  <SelectItem value="wine">🍷 Wine Grapes</SelectItem>
                  <SelectItem value="table">🍇 Table Grapes</SelectItem>
                  <SelectItem value="dried">🫐 Dried Fruit Grapes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Variety *</Label>
              <Select 
                value={newVariety.variety} 
                onValueChange={(value) => setNewVariety({...newVariety, variety: value})}
                disabled={!newVariety.category}
              >
                <SelectTrigger className="bg-background z-40 min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Choose variety" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-40 max-h-[40vh] overflow-y-auto">
                  {newVariety.category && grapeVarieties[newVariety.category as keyof typeof grapeVarieties]?.map((variety) => (
                    <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Planted Area (acres) *</Label>
              <Input
                type="number"
                step="0.1"
                value={newVariety.acres}
                onChange={(e) => setNewVariety({...newVariety, acres: e.target.value})}
                placeholder="e.g., 10.5"
              />
              <div className="text-xs text-muted-foreground">
                = {newVariety.acres ? convertAcreToHectare(parseFloat(newVariety.acres)).toFixed(2) : '0'} hectares
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hail Netting (acres)</Label>
              <Input
                type="number"
                step="0.1"
                value={newVariety.hailNettingAcres}
                onChange={(e) => setNewVariety({...newVariety, hailNettingAcres: e.target.value})}
                placeholder="e.g., 5.0"
              />
              <div className="text-xs text-muted-foreground">
                Coverage: {newVariety.acres && newVariety.hailNettingAcres 
                  ? Math.round((parseFloat(newVariety.hailNettingAcres) / parseFloat(newVariety.acres)) * 100) 
                  : 0}%
              </div>
            </div>

            <div className="space-y-2">
              <Label>Planting Year</Label>
              <Input
                value={newVariety.plantingYear}
                onChange={(e) => setNewVariety({...newVariety, plantingYear: e.target.value})}
                placeholder="e.g., 2025"
              />
            </div>

            <div className="space-y-2">
              <Label>Clone Selection (optional)</Label>
              <Input
                value={newVariety.cloneSelection}
                onChange={(e) => setNewVariety({...newVariety, cloneSelection: e.target.value})}
                placeholder="Enter clone selection"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Notes & Comments</Label>
              <Textarea
                value={newVariety.notes}
                onChange={(e) => setNewVariety({...newVariety, notes: e.target.value})}
                placeholder="Additional notes about this variety"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Button onClick={addVariety} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Variety
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Varieties */}
        {selectedVarieties.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Selected Varieties ({selectedVarieties.length})</h4>
            <div className="space-y-3">
              {selectedVarieties.map((variety) => (
                <Card key={variety.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(variety.category)}</span>
                      <div>
                        <h5 className="font-semibold text-lg">{variety.variety}</h5>
                        <Badge className={getCategoryColor(variety.category)} variant="secondary">
                          {variety.category.charAt(0).toUpperCase() + variety.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVariety(variety.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Area:</span>
                      <p>{variety.acres} acres</p>
                      <p className="text-muted-foreground">{variety.hectares.toFixed(2)} hectares</p>
                    </div>
                    <div>
                      <span className="font-medium">Hail Netting:</span>
                      <p>{variety.hailNettingAcres} acres</p>
                      <p className="text-muted-foreground">{variety.hailNettingCoverage.toFixed(1)}% coverage</p>
                    </div>
                    <div>
                      <span className="font-medium">Planting Year:</span>
                      <p>{variety.plantingYear || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Clone:</span>
                      <p>{variety.cloneSelection || 'Standard'}</p>
                    </div>
                  </div>

                  {variety.notes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded">
                      <span className="font-medium text-sm">Notes: </span>
                      <span className="text-sm">{variety.notes}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-primary/5 rounded-lg">
              <h5 className="font-semibold mb-2">Summary</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Area:</span>
                  <p>{selectedVarieties.reduce((sum, v) => sum + v.acres, 0).toFixed(1)} acres</p>
                </div>
                <div>
                  <span className="font-medium">Hail Protected:</span>
                  <p>{selectedVarieties.reduce((sum, v) => sum + v.hailNettingAcres, 0).toFixed(1)} acres</p>
                </div>
                <div>
                  <span className="font-medium">Wine Varieties:</span>
                  <p>{selectedVarieties.filter(v => v.category === 'wine').length}</p>
                </div>
                <div>
                  <span className="font-medium">Table/Dried:</span>
                  <p>{selectedVarieties.filter(v => v.category !== 'wine').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedVarieties.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Grape className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No varieties selected yet</p>
            <p className="text-sm">Choose grape categories and varieties above to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};