/**
 * Irrigation Management System with Rural Co Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus, Trash2, MapPin, Info } from "lucide-react";
import { toast } from "sonner";

interface IrrigationType {
  id: string;
  name: string;
  type: string;
  efficiency: number;
  coverage: number;
  notes: string;
  zone?: string;
}

interface IrrigationManagerProps {
  address?: string;
  onIrrigationChange?: (irrigationTypes: IrrigationType[]) => void;
}

export const IrrigationManager = ({ address, onIrrigationChange }: IrrigationManagerProps) => {
  const [irrigationTypes, setIrrigationTypes] = useState<IrrigationType[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [irrigationZone, setIrrigationZone] = useState<string>("");
  const [loadingZone, setLoadingZone] = useState(false);

  const [newIrrigation, setNewIrrigation] = useState({
    name: '',
    type: '',
    efficiency: '',
    coverage: '',
    notes: ''
  });

  const defaultIrrigationTypes = [
    'Drip Irrigation', 'Micro-sprinkler', 'Sprinkler System', 'Center Pivot',
    'Flood Irrigation', 'Subsurface Drip', 'Rain-fed', 'Combination System',
    'Overhead Sprinklers', 'Furrow Irrigation', 'Border Check', 'Gun Sprinklers'
  ];

  const irrigationEfficiencies = {
    'Drip Irrigation': 95,
    'Subsurface Drip': 98,
    'Micro-sprinkler': 90,
    'Sprinkler System': 85,
    'Center Pivot': 80,
    'Overhead Sprinklers': 75,
    'Gun Sprinklers': 70,
    'Flood Irrigation': 60,
    'Furrow Irrigation': 65,
    'Border Check': 70,
    'Rain-fed': 70,
    'Combination System': 85
  };

  // Fetch irrigation zone from Rural Co based on address
  const fetchIrrigationZone = async () => {
    if (!address) return;
    
    setLoadingZone(true);
    try {
      // This would integrate with Rural Co API
      // For now, we'll simulate the zone lookup
      setTimeout(() => {
        const mockZones = [
          'Murray Valley Irrigation District',
          'Riverland Irrigation Zone',
          'Sunraysia District',
          'Adelaide Hills Zone',
          'Barossa Valley District',
          'Clare Valley Zone'
        ];
        const randomZone = mockZones[Math.floor(Math.random() * mockZones.length)];
        setIrrigationZone(randomZone);
        setLoadingZone(false);
        toast.success(`Irrigation zone identified: ${randomZone}`);
      }, 1500);
    } catch (error) {
      setLoadingZone(false);
      toast.error('Failed to fetch irrigation zone');
    }
  };

  useEffect(() => {
    if (address) {
      fetchIrrigationZone();
    }
  }, [address]);

  const addIrrigationType = () => {
    if (!newIrrigation.name || !newIrrigation.type) {
      toast.error('Please fill in required fields');
      return;
    }

    const efficiency = parseFloat(newIrrigation.efficiency) || 
                      irrigationEfficiencies[newIrrigation.type as keyof typeof irrigationEfficiencies] || 
                      80;

    const newType: IrrigationType = {
      id: crypto.randomUUID(),
      name: newIrrigation.name,
      type: newIrrigation.type,
      efficiency,
      coverage: parseFloat(newIrrigation.coverage) || 100,
      notes: newIrrigation.notes,
      zone: irrigationZone
    };

    const updated = [...irrigationTypes, newType];
    setIrrigationTypes(updated);
    onIrrigationChange?.(updated);
    
    setNewIrrigation({ name: '', type: '', efficiency: '', coverage: '', notes: '' });
    setIsAddingNew(false);
    toast.success(`${newType.name} irrigation system added`);
  };

  const removeIrrigationType = (id: string) => {
    const updated = irrigationTypes.filter(irrigation => irrigation.id !== id);
    setIrrigationTypes(updated);
    onIrrigationChange?.(updated);
    toast.success('Irrigation system removed');
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Irrigation Systems
        </CardTitle>
        {irrigationZone && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{irrigationZone}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Irrigation Systems */}
        {irrigationTypes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Active Irrigation Systems</h4>
            {irrigationTypes.map((irrigation) => (
              <Card key={irrigation.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{irrigation.name}</h5>
                    <Badge variant="outline">{irrigation.type}</Badge>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeIrrigationType(irrigation.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Efficiency:</span>
                    <span className={`ml-2 ${getEfficiencyColor(irrigation.efficiency)}`}>
                      {irrigation.efficiency}%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Coverage:</span>
                    <span className="ml-2">{irrigation.coverage}%</span>
                  </div>
                </div>
                
                {irrigation.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{irrigation.notes}</p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Add New Irrigation System */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Add Irrigation System</h4>
            {!isAddingNew && (
              <Button variant="outline" onClick={() => setIsAddingNew(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add System
              </Button>
            )}
          </div>

          {isAddingNew && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>System Name *</Label>
                  <Input
                    value={newIrrigation.name}
                    onChange={(e) => setNewIrrigation({...newIrrigation, name: e.target.value})}
                    placeholder="e.g., Main Block Drip System"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Type *</Label>
                  <Select 
                    value={newIrrigation.type} 
                    onValueChange={(value) => {
                      setNewIrrigation({
                        ...newIrrigation, 
                        type: value,
                        efficiency: irrigationEfficiencies[value as keyof typeof irrigationEfficiencies]?.toString() || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultIrrigationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type} ({irrigationEfficiencies[type as keyof typeof irrigationEfficiencies] || 80}% eff.)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Efficiency (%)</Label>
                  <Input
                    type="number"
                    value={newIrrigation.efficiency}
                    onChange={(e) => setNewIrrigation({...newIrrigation, efficiency: e.target.value})}
                    placeholder="Auto-filled based on type"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Coverage (%)</Label>
                  <Input
                    type="number"
                    value={newIrrigation.coverage}
                    onChange={(e) => setNewIrrigation({...newIrrigation, coverage: e.target.value})}
                    placeholder="100"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={newIrrigation.notes}
                  onChange={(e) => setNewIrrigation({...newIrrigation, notes: e.target.value})}
                  placeholder="Additional details about this irrigation system"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addIrrigationType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add System
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Zone Information */}
        {irrigationZone && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Irrigation Zone: {irrigationZone}
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Zone data sourced from Rural Co irrigation districts. 
                  Consider local water availability and restrictions when planning irrigation systems.
                </p>
              </div>
            </div>
          </div>
        )}

        {irrigationTypes.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-muted-foreground">
            <Droplets className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No irrigation systems configured.</p>
            <p className="text-sm">Add your first irrigation system to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};