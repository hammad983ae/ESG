/**
 * Spray Program Tracker - Chemical Application Management
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Droplets, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertAcreToHectare, convertHectareToAcre } from "@/utils/conversionUtils";

interface SprayApplication {
  id: string;
  date: Date;
  product: string;
  activeIngredient: string;
  ratePerAcre: number;
  ratePerHectare: number;
  targetPest: string;
  fieldArea: number;
  unitType: 'acres' | 'hectares';
  weatherConditions: string;
  operator: string;
  equipmentUsed: string;
  notes: string;
  witholdingPeriod: number;
  cost: number;
}

export const SprayProgramTracker = () => {
  const [applications, setApplications] = useState<SprayApplication[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [unitType, setUnitType] = useState<'acres' | 'hectares'>('acres');
  
  const [formData, setFormData] = useState({
    product: '',
    activeIngredient: '',
    ratePerAcre: '',
    targetPest: '',
    fieldArea: '',
    weatherConditions: '',
    operator: '',
    equipmentUsed: '',
    notes: '',
    witholdingPeriod: '',
    cost: ''
  });

  const commonProducts = [
    'Roundup (Glyphosate)',
    '2,4-D Amine',
    'Atrazine',
    'Dicamba',
    'Chlorpyrifos',
    'Malathion',
    'Carbaryl',
    'Copper Fungicide',
    'Mancozeb',
    'Tebuconazole'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const ratePerAcre = parseFloat(formData.ratePerAcre);
    const ratePerHectare = unitType === 'acres' ? ratePerAcre * 2.47105 : ratePerAcre;
    
    const newApplication: SprayApplication = {
      id: Date.now().toString(),
      date: selectedDate,
      product: formData.product,
      activeIngredient: formData.activeIngredient,
      ratePerAcre: unitType === 'acres' ? ratePerAcre : ratePerAcre / 2.47105,
      ratePerHectare: unitType === 'hectares' ? ratePerAcre : ratePerAcre * 2.47105,
      targetPest: formData.targetPest,
      fieldArea: parseFloat(formData.fieldArea),
      unitType,
      weatherConditions: formData.weatherConditions,
      operator: formData.operator,
      equipmentUsed: formData.equipmentUsed,
      notes: formData.notes,
      witholdingPeriod: parseInt(formData.witholdingPeriod),
      cost: parseFloat(formData.cost)
    };

    setApplications([...applications, newApplication]);
    
    // Reset form
    setFormData({
      product: '',
      activeIngredient: '',
      ratePerAcre: '',
      targetPest: '',
      fieldArea: '',
      weatherConditions: '',
      operator: '',
      equipmentUsed: '',
      notes: '',
      witholdingPeriod: '',
      cost: ''
    });
    setSelectedDate(undefined);
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);

  return (
    <div className="space-y-6">
      {/* Add New Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Spray Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Application Date</Label>
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

              {/* Product Selection */}
              <div className="space-y-2">
                <Label>Chemical Product</Label>
                <Select value={formData.product} onValueChange={(value) => setFormData({...formData, product: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonProducts.map((product) => (
                      <SelectItem key={product} value={product}>{product}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Ingredient */}
              <div className="space-y-2">
                <Label>Active Ingredient</Label>
                <Input
                  value={formData.activeIngredient}
                  onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                  placeholder="e.g., Glyphosate 540g/L"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Unit Type */}
              <div className="space-y-2">
                <Label>Unit Type</Label>
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

              {/* Application Rate */}
              <div className="space-y-2">
                <Label>Application Rate (per {unitType.slice(0, -1)})</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ratePerAcre}
                  onChange={(e) => setFormData({...formData, ratePerAcre: e.target.value})}
                  placeholder="L/ha or L/acre"
                />
              </div>

              {/* Field Area */}
              <div className="space-y-2">
                <Label>Field Area ({unitType})</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.fieldArea}
                  onChange={(e) => setFormData({...formData, fieldArea: e.target.value})}
                  placeholder={`Area in ${unitType}`}
                />
              </div>

              {/* Cost */}
              <div className="space-y-2">
                <Label>Total Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  placeholder="Total application cost"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Pest */}
              <div className="space-y-2">
                <Label>Target Pest/Disease</Label>
                <Input
                  value={formData.targetPest}
                  onChange={(e) => setFormData({...formData, targetPest: e.target.value})}
                  placeholder="e.g., Broadleaf weeds"
                />
              </div>

              {/* Operator */}
              <div className="space-y-2">
                <Label>Operator</Label>
                <Input
                  value={formData.operator}
                  onChange={(e) => setFormData({...formData, operator: e.target.value})}
                  placeholder="Person who applied"
                />
              </div>

              {/* Witholding Period */}
              <div className="space-y-2">
                <Label>Witholding Period (days)</Label>
                <Input
                  type="number"
                  value={formData.witholdingPeriod}
                  onChange={(e) => setFormData({...formData, witholdingPeriod: e.target.value})}
                  placeholder="Days before harvest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weather Conditions */}
              <div className="space-y-2">
                <Label>Weather Conditions</Label>
                <Input
                  value={formData.weatherConditions}
                  onChange={(e) => setFormData({...formData, weatherConditions: e.target.value})}
                  placeholder="e.g., Calm, 18°C, 65% humidity"
                />
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <Label>Equipment Used</Label>
                <Input
                  value={formData.equipmentUsed}
                  onChange={(e) => setFormData({...formData, equipmentUsed: e.target.value})}
                  placeholder="e.g., Boom sprayer, Airblast"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional observations or notes"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedDate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application Record
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Applications History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Application History
            </CardTitle>
            <Badge variant="secondary">
              Total Cost: ${totalCost.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No spray applications recorded yet. Add your first application above.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{app.product}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(app.date, "PPP")} - Applied by {app.operator}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.witholdingPeriod > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {app.witholdingPeriod}d WHI
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApplication(app.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Active Ingredient:</span>
                        <p>{app.activeIngredient}</p>
                      </div>
                      <div>
                        <span className="font-medium">Target:</span>
                        <p>{app.targetPest}</p>
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span>
                        <p>{app.ratePerAcre.toFixed(2)} L/acre</p>
                        <p>{app.ratePerHectare.toFixed(2)} L/hectare</p>
                      </div>
                      <div>
                        <span className="font-medium">Area:</span>
                        <p>{app.fieldArea} {app.unitType}</p>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <span className="font-medium text-sm">Notes: </span>
                        <span className="text-sm">{app.notes}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <span className="text-sm text-muted-foreground">
                        Weather: {app.weatherConditions} | Equipment: {app.equipmentUsed}
                      </span>
                      <Badge variant="outline">${app.cost.toFixed(2)}</Badge>
                    </div>
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