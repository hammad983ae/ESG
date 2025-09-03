/**
 * Improved Variety Manager with Clean Dropdown Selections
 * Clean interface like the reference image provided
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
      // SNFL Varieties
      'Navsel 3', 'Sunrise Red (Sheegene 8)', 'Navsel 20', 'Navsel 21',
      'Carlita (Sheegene 25)', 'Krissy (Sheegene 12)', 'Timco (Sheegene 13)',
      'Allison (Sheegene 20)', 'Kelly (Sheegene 18)', 'Navsel 6', 'Navsel 5',
      'Ivory (Sheegene 21)', 'Timpson (Sheegene 2)', 'Great Green (Sheegene 17)',
      'Navsel 1', 'Sheegene 105', 'Sheegene 101', 'Sheegene 104'
    ],
    dried: [
      'Sultana (Thompson Seedless)', 'Currants (Black Corinth)', 'Muscat Gordo Blanco',
      'Carina Currants', 'Flame Seedless (Raisins)', 'Ruby Seedless (Raisins)',
      'Sunmuscat', 'Sultana H5', 'Merbein Seedless', 'Menindee Seedless'
    ]
  };

  const addVariety = () => {
    if (!newVariety.variety || !newVariety.acres) {
      toast.error('Please select variety and enter area');
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
    <Card className="touch-manipulation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grape className="h-5 w-5" />
          Vineyard Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Grape Varieties
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Varieties Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Available Varieties</h4>
            <Button variant="outline" size="sm" className="touch-manipulation min-h-[44px]">
              <Plus className="h-4 w-4 mr-1" />
              Add Custom
            </Button>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-purple-600">🍷</span>
                <span className="font-medium">Wine Grapes</span>
                <Badge variant="secondary">{grapeVarieties.wine.length}</Badge>
              </div>
              <Select onValueChange={(value) => {
                setNewVariety({...newVariety, category: 'wine', variety: value});
              }}>
                <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select wine grape" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                  {grapeVarieties.wine.map((variety) => (
                    <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600">🍇</span>
                <span className="font-medium">Table Grapes</span>
                <Badge variant="secondary">{grapeVarieties.table.length}</Badge>
              </div>
              <Select onValueChange={(value) => {
                setNewVariety({...newVariety, category: 'table', variety: value});
              }}>
                <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select table grape" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                  {grapeVarieties.table.map((variety) => (
                    <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-600">🫐</span>
                <span className="font-medium">Dried Fruit Grapes</span>
                <Badge variant="secondary">{grapeVarieties.dried.length}</Badge>
              </div>
              <Select onValueChange={(value) => {
                setNewVariety({...newVariety, category: 'dried', variety: value});
              }}>
                <SelectTrigger className="bg-background min-h-[44px] touch-manipulation">
                  <SelectValue placeholder="Select dried fruit grape" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-[40vh] overflow-y-auto">
                  {grapeVarieties.dried.map((variety) => (
                    <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          </div>

          {/* Quick Add Form - Only shows when variety selected */}
          {newVariety.variety && (
            <Card className="p-4 bg-muted/30 border-dashed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Selected: {newVariety.variety}</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(newVariety.category)}>
                      {getCategoryIcon(newVariety.category)} {newVariety.category}
                    </Badge>
                    <Badge variant="outline">{newVariety.variety}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Planted Area (acres) *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newVariety.acres}
                    onChange={(e) => setNewVariety({...newVariety, acres: e.target.value})}
                    placeholder="e.g., 10.5"
                    className="min-h-[44px]"
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
                    className="min-h-[44px]"
                  />
                  <div className="text-xs text-muted-foreground">
                    Coverage: {newVariety.acres && newVariety.hailNettingAcres 
                      ? Math.round((parseFloat(newVariety.hailNettingAcres) / parseFloat(newVariety.acres)) * 100) 
                      : 0}%
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Planting Year</Label>
                    <Input
                      value={newVariety.plantingYear}
                      onChange={(e) => setNewVariety({...newVariety, plantingYear: e.target.value})}
                      placeholder="2025"
                      className="min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Clone Selection</Label>
                    <Input
                      value={newVariety.cloneSelection}
                      onChange={(e) => setNewVariety({...newVariety, cloneSelection: e.target.value})}
                      placeholder="Enter clone"
                      className="min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button onClick={addVariety} className="w-full min-h-[44px] touch-manipulation">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variety
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Selected Varieties */}
        {selectedVarieties.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Selected Varieties:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedVarieties.map((variety) => (
                <Badge key={variety.id} variant="outline" className="flex items-center gap-2 px-3 py-1 touch-manipulation">
                  <span>{getCategoryIcon(variety.category)}</span>
                  <span>{variety.variety}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariety(variety.id)}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full touch-manipulation"
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-primary/5 rounded-lg">
              <h5 className="font-semibold mb-2">Summary</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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
            <p className="text-sm">Choose grape varieties from the categories above to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};