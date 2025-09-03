/**
 * Yield Tracker - Monitor crop yields per acre/hectare
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, TrendingUp, BarChart3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertAcreToHectare, convertHectareToAcre } from "@/utils/conversionUtils";

interface YieldRecord {
  id: string;
  date: Date;
  crop: string;
  variety: string;
  fieldName: string;
  area: number;
  unitType: 'acres' | 'hectares';
  yieldAmount: number;
  yieldUnit: string;
  yieldPerAcre: number;
  yieldPerHectare: number;
  quality: string;
  marketPrice: number;
  totalValue: number;
  notes: string;
  season: string;
}

export const YieldTracker = () => {
  const [yieldRecords, setYieldRecords] = useState<YieldRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [unitType, setUnitType] = useState<'acres' | 'hectares'>('acres');
  
  const [formData, setFormData] = useState({
    crop: '',
    variety: '',
    fieldName: '',
    area: '',
    yieldAmount: '',
    yieldUnit: '',
    quality: '',
    marketPrice: '',
    notes: '',
    season: ''
  });

  const cropTypes = [
    'Wheat', 'Corn', 'Soybeans', 'Rice', 'Cotton', 'Barley', 'Oats',
    'Apples', 'Oranges', 'Grapes', 'Almonds', 'Avocados', 'Peaches',
    'Tomatoes', 'Potatoes', 'Carrots', 'Lettuce', 'Broccoli'
  ];

  const yieldUnits = [
    'tons', 'tonnes', 'bushels', 'pounds', 'kg', 'boxes', 'bins', 'cases'
  ];

  const qualityGrades = [
    'Premium', 'Grade A', 'Grade B', 'Standard', 'Below Standard', 'Reject'
  ];

  const seasons = [
    '2024 Spring', '2024 Summer', '2024 Fall', '2024 Winter',
    '2025 Spring', '2025 Summer', '2025 Fall', '2025 Winter'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const area = parseFloat(formData.area);
    const yieldAmount = parseFloat(formData.yieldAmount);
    const marketPrice = parseFloat(formData.marketPrice);
    
    const yieldPerAcre = unitType === 'acres' ? yieldAmount / area : (yieldAmount / area) / 2.47105;
    const yieldPerHectare = unitType === 'hectares' ? yieldAmount / area : (yieldAmount / area) * 2.47105;
    
    const newRecord: YieldRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      crop: formData.crop,
      variety: formData.variety,
      fieldName: formData.fieldName,
      area,
      unitType,
      yieldAmount,
      yieldUnit: formData.yieldUnit,
      yieldPerAcre,
      yieldPerHectare,
      quality: formData.quality,
      marketPrice,
      totalValue: yieldAmount * marketPrice,
      notes: formData.notes,
      season: formData.season
    };

    setYieldRecords([...yieldRecords, newRecord]);
    
    // Reset form
    setFormData({
      crop: '',
      variety: '',
      fieldName: '',
      area: '',
      yieldAmount: '',
      yieldUnit: '',
      quality: '',
      marketPrice: '',
      notes: '',
      season: ''
    });
    setSelectedDate(undefined);
  };

  const deleteRecord = (id: string) => {
    setYieldRecords(yieldRecords.filter(record => record.id !== id));
  };

  const totalValue = yieldRecords.reduce((sum, record) => sum + record.totalValue, 0);
  const totalArea = yieldRecords.reduce((sum, record) => 
    sum + (record.unitType === 'acres' ? record.area : convertHectareToAcre(record.area)), 0
  );
  const averageYieldPerAcre = yieldRecords.length > 0 
    ? yieldRecords.reduce((sum, record) => sum + record.yieldPerAcre, 0) / yieldRecords.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{yieldRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Area</p>
              <p className="text-2xl font-bold">{totalArea.toFixed(1)} acres</p>
              <p className="text-xs text-muted-foreground">{convertAcreToHectare(totalArea).toFixed(1)} hectares</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Yield/Acre</p>
              <p className="text-2xl font-bold">{averageYieldPerAcre.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Yield Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Record New Yield
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Harvest Date */}
              <div className="space-y-2">
                <Label>Harvest Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Crop Type */}
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select value={formData.crop} onValueChange={(value) => setFormData({...formData, crop: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <Label>Season</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season} value={season}>{season}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Variety */}
              <div className="space-y-2">
                <Label>Variety</Label>
                <Input
                  value={formData.variety}
                  onChange={(e) => setFormData({...formData, variety: e.target.value})}
                  placeholder="e.g., Red Delicious, Honeycrisp"
                />
              </div>

              {/* Field Name */}
              <div className="space-y-2">
                <Label>Field/Block Name</Label>
                <Input
                  value={formData.fieldName}
                  onChange={(e) => setFormData({...formData, fieldName: e.target.value})}
                  placeholder="e.g., North Field, Block A"
                />
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label>Quality Grade</Label>
                <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Unit Type */}
              <div className="space-y-2">
                <Label>Area Unit</Label>
                <Select value={unitType} onValueChange={(value: 'acres' | 'hectares') => setUnitType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label>Harvested Area</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder={unitType}
                />
              </div>

              {/* Yield Amount */}
              <div className="space-y-2">
                <Label>Total Yield</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.yieldAmount}
                  onChange={(e) => setFormData({...formData, yieldAmount: e.target.value})}
                  placeholder="Total harvest"
                />
              </div>

              {/* Yield Unit */}
              <div className="space-y-2">
                <Label>Yield Unit</Label>
                <Select value={formData.yieldUnit} onValueChange={(value) => setFormData({...formData, yieldUnit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {yieldUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Market Price */}
              <div className="space-y-2">
                <Label>Price per Unit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.marketPrice}
                  onChange={(e) => setFormData({...formData, marketPrice: e.target.value})}
                  placeholder="$/unit"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any observations about the harvest"
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedDate}>
              <Plus className="mr-2 h-4 w-4" />
              Record Yield
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Yield Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yield History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {yieldRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No yield records yet. Add your first harvest record above.
            </div>
          ) : (
            <div className="space-y-4">
              {yieldRecords.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {record.crop} - {record.variety}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(record.date, "PPP")} - {record.fieldName} ({record.season})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{record.quality}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Yield:</span>
                        <p>{record.yieldAmount} {record.yieldUnit}</p>
                      </div>
                      <div>
                        <span className="font-medium">Area:</span>
                        <p>{record.area} {record.unitType}</p>
                      </div>
                      <div>
                        <span className="font-medium">Yield/Acre:</span>
                        <p>{record.yieldPerAcre.toFixed(2)} {record.yieldUnit}</p>
                      </div>
                      <div>
                        <span className="font-medium">Yield/Hectare:</span>
                        <p>{record.yieldPerHectare.toFixed(2)} {record.yieldUnit}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span>
                        <p className="text-green-600 font-semibold">${record.totalValue.toLocaleString()}</p>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <span className="font-medium text-sm">Notes: </span>
                        <span className="text-sm">{record.notes}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};