/**
 * Traffic Analysis Comparison Component
 * Compares foot traffic and vehicle traffic for applicable property types
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Users, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface TrafficData {
  timeSlot: string;
  footTraffic: number;
  vehicleTraffic: number;
  date: string;
}

interface TrafficAnalysisProps {
  propertyType: string;
  onAnalysisComplete: (results: any) => void;
}

const APPLICABLE_PROPERTY_TYPES = [
  'commercial-office',
  'retail', 
  'industrial',
  'hospitality',
  'healthcare'
];

const TIME_SLOTS = [
  { value: '6-9', label: '6:00 AM - 9:00 AM' },
  { value: '9-12', label: '9:00 AM - 12:00 PM' },
  { value: '12-15', label: '12:00 PM - 3:00 PM' },
  { value: '15-18', label: '3:00 PM - 6:00 PM' },
  { value: '18-21', label: '6:00 PM - 9:00 PM' },
  { value: '21-6', label: '9:00 PM - 6:00 AM' }
];

export function TrafficAnalysisComparison({ propertyType, onAnalysisComplete }: TrafficAnalysisProps) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    timeSlot: '',
    footTraffic: '',
    vehicleTraffic: '',
    date: new Date().toISOString().split('T')[0]
  });

  const isApplicable = APPLICABLE_PROPERTY_TYPES.includes(propertyType);
  const showFootTraffic = !['big-box-retail', 'residential', 'industrial'].includes(propertyType);
  const showVehicleTraffic = true; // All applicable types can have vehicle traffic

  const addTrafficEntry = () => {
    if (!currentEntry.timeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    const newEntry: TrafficData = {
      timeSlot: currentEntry.timeSlot,
      footTraffic: Number(currentEntry.footTraffic) || 0,
      vehicleTraffic: Number(currentEntry.vehicleTraffic) || 0,
      date: currentEntry.date
    };

    setTrafficData(prev => [...prev, newEntry]);
    setCurrentEntry({
      timeSlot: '',
      footTraffic: '',
      vehicleTraffic: '',
      date: new Date().toISOString().split('T')[0]
    });
    toast.success("Traffic data added successfully");
  };

  const removeTrafficEntry = (index: number) => {
    setTrafficData(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeTraffic = () => {
    if (trafficData.length === 0) {
      toast.error("Please add traffic data before analyzing");
      return;
    }

    const totalFootTraffic = trafficData.reduce((sum, entry) => sum + entry.footTraffic, 0);
    const totalVehicleTraffic = trafficData.reduce((sum, entry) => sum + entry.vehicleTraffic, 0);
    const avgFootTraffic = totalFootTraffic / trafficData.length;
    const avgVehicleTraffic = totalVehicleTraffic / trafficData.length;

    // Find peak times
    const peakFootTraffic = trafficData.reduce((max, entry) => 
      entry.footTraffic > max.footTraffic ? entry : max, trafficData[0]);
    const peakVehicleTraffic = trafficData.reduce((max, entry) => 
      entry.vehicleTraffic > max.vehicleTraffic ? entry : max, trafficData[0]);

    const results = {
      propertyType,
      totalEntries: trafficData.length,
      totals: {
        footTraffic: totalFootTraffic,
        vehicleTraffic: totalVehicleTraffic
      },
      averages: {
        footTraffic: avgFootTraffic,
        vehicleTraffic: avgVehicleTraffic
      },
      peaks: {
        footTraffic: peakFootTraffic,
        vehicleTraffic: peakVehicleTraffic
      },
      trafficRatio: showFootTraffic ? totalFootTraffic / totalVehicleTraffic : null,
      recommendations: getTrafficRecommendations(propertyType, avgFootTraffic, avgVehicleTraffic)
    };

    onAnalysisComplete(results);
    toast.success("Traffic analysis completed!");
  };

  const getTrafficRecommendations = (type: string, footTraffic: number, vehicleTraffic: number): string[] => {
    const recommendations = [];
    
    if (type === 'retail' && footTraffic < 100) {
      recommendations.push("Consider marketing strategies to increase foot traffic");
    }
    if (type === 'commercial-office' && vehicleTraffic > footTraffic * 0.8) {
      recommendations.push("High vehicle dependency - consider public transport accessibility");
    }
    if (type === 'industrial' && vehicleTraffic < 50) {
      recommendations.push("Vehicle access may be insufficient for industrial operations");
    }
    if (footTraffic > vehicleTraffic * 3) {
      recommendations.push("Excellent pedestrian accessibility - leverage for retail opportunities");
    }

    return recommendations.length > 0 ? recommendations : ["Traffic patterns are within normal ranges"];
  };

  if (!isApplicable) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">Traffic Analysis Not Applicable</h3>
          <p className="text-muted-foreground">
            Traffic analysis is not applicable for {propertyType} properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Traffic Analysis & Comparison
        </CardTitle>
        <CardDescription>
          Analyze and compare foot traffic and vehicle traffic patterns for {propertyType} properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entry" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entry">Data Entry</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="entry" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select value={currentEntry.timeSlot} onValueChange={(value) => 
                  setCurrentEntry(prev => ({ ...prev, timeSlot: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showFootTraffic && (
                <div className="space-y-2">
                  <Label>Foot Traffic Count</Label>
                  <Input
                    type="number"
                    value={currentEntry.footTraffic}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, footTraffic: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Vehicle Traffic Count</Label>
                <Input
                  type="number"
                  value={currentEntry.vehicleTraffic}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, vehicleTraffic: e.target.value }))}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={addTrafficEntry} className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Add Traffic Data
            </Button>

            {trafficData.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Recorded Traffic Data</h4>
                <div className="space-y-2">
                  {trafficData.map((entry, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{TIME_SLOTS.find(s => s.value === entry.timeSlot)?.label}</Badge>
                            {showFootTraffic && (
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="w-4 h-4" />
                                {entry.footTraffic}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm">
                              <Car className="w-4 h-4" />
                              {entry.vehicleTraffic}
                            </div>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                          <Button 
                            onClick={() => removeTrafficEntry(index)}
                            variant="ghost" 
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {trafficData.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showFootTraffic && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Foot Traffic Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-semibold">
                              {trafficData.reduce((sum, entry) => sum + entry.footTraffic, 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average:</span>
                            <span className="font-semibold">
                              {Math.round(trafficData.reduce((sum, entry) => sum + entry.footTraffic, 0) / trafficData.length)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Vehicle Traffic Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-semibold">
                            {trafficData.reduce((sum, entry) => sum + entry.vehicleTraffic, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average:</span>
                          <span className="font-semibold">
                            {Math.round(trafficData.reduce((sum, entry) => sum + entry.vehicleTraffic, 0) / trafficData.length)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={analyzeTraffic} size="lg" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Run Traffic Analysis
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No Traffic Data</h3>
                <p>Add traffic data in the Data Entry tab to perform analysis.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="text-center p-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">Analysis Results</h3>
              <p>Results will appear here after running the traffic analysis.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}