import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Search, TrendingUp, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ComparableSale {
  id: string;
  property: string;
  location: string;
  saleDate: string;
  price: number;
  size: number;
  pricePerSqm: number;
  adjustmentFactors: {
    location: number;
    condition: number;
    size: number;
    timing: number;
    sustainability: number;
  };
  adjustedPrice: number;
}

interface ValuationDirectComparisonFormProps {
  onSubmit: (data: any) => void;
}

const ASSET_TYPES = [
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' }, 
  { value: 'motel', label: 'Motel' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residential' },
  { value: 'custom', label: 'Custom' }
];

const SAMPLE_COMPARABLES: Record<string, ComparableSale[]> = {
  office: [
    {
      id: '1',
      property: 'CBD Office Tower',
      location: 'Sydney CBD',
      saleDate: '2024-01-15',
      price: 15000000,
      size: 2500,
      pricePerSqm: 6000,
      adjustmentFactors: {
        location: 1.0,
        condition: 0.95,
        size: 1.05,
        timing: 1.02,
        sustainability: 1.08
      },
      adjustedPrice: 15750000
    },
    {
      id: '2',
      property: 'Premium Office Building',
      location: 'Melbourne CBD',
      saleDate: '2024-02-20',
      price: 12500000,
      size: 2000,
      pricePerSqm: 6250,
      adjustmentFactors: {
        location: 0.98,
        condition: 1.02,
        size: 1.0,
        timing: 1.01,
        sustainability: 1.05
      },
      adjustedPrice: 12876250
    }
  ],
  retail: [
    {
      id: '3',
      property: 'Shopping Centre Unit',
      location: 'Westfield Parramatta',
      saleDate: '2024-01-10',
      price: 2500000,
      size: 300,
      pricePerSqm: 8333,
      adjustmentFactors: {
        location: 1.05,
        condition: 0.98,
        size: 1.02,
        timing: 1.03,
        sustainability: 1.0
      },
      adjustedPrice: 2682500
    }
  ],
  motel: [
    {
      id: '4',
      property: 'Highway Motel',
      location: 'Gold Coast Highway',
      saleDate: '2023-12-15',
      price: 3500000,
      size: 1500,
      pricePerSqm: 2333,
      adjustmentFactors: {
        location: 0.95,
        condition: 1.1,
        size: 0.98,
        timing: 1.05,
        sustainability: 0.95
      },
      adjustedPrice: 3442125
    }
  ],
  childcare: [
    {
      id: '5',
      property: 'Modern Childcare Centre',
      location: 'Brisbane Suburbs',
      saleDate: '2024-01-30',
      price: 1800000,
      size: 600,
      pricePerSqm: 3000,
      adjustmentFactors: {
        location: 1.02,
        condition: 0.97,
        size: 1.05,
        timing: 1.01,
        sustainability: 1.12
      },
      adjustedPrice: 1954440
    }
  ]
};

export function ValuationDirectComparisonForm({ onSubmit }: ValuationDirectComparisonFormProps) {
  const [selectedAssetType, setSelectedAssetType] = useState('office');
  const [customAssetType, setCustomAssetType] = useState('');
  const [subjectProperty, setSubjectProperty] = useState({
    name: '',
    location: '',
    size: 0,
    targetPrice: 0
  });
  
  const [comparables, setComparables] = useState<ComparableSale[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchComparables = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const typeKey = selectedAssetType === 'custom' ? 'office' : selectedAssetType;
      const fetchedComparables = SAMPLE_COMPARABLES[typeKey] || [];
      
      setComparables(fetchedComparables);
      toast.success(`Found ${fetchedComparables.length} comparable sales for ${selectedAssetType}`);
    } catch (error) {
      toast.error("Error fetching comparable sales data");
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomComparable = () => {
    const newComparable: ComparableSale = {
      id: Date.now().toString(),
      property: '',
      location: '',
      saleDate: new Date().toISOString().split('T')[0],
      price: 0,
      size: 0,
      pricePerSqm: 0,
      adjustmentFactors: {
        location: 1.0,
        condition: 1.0,
        size: 1.0,
        timing: 1.0,
        sustainability: 1.0
      },
      adjustedPrice: 0
    };
    setComparables([...comparables, newComparable]);
  };

  const removeComparable = (id: string) => {
    setComparables(comparables.filter(comp => comp.id !== id));
  };

  const updateComparable = (id: string, field: string, value: any) => {
    setComparables(comparables.map(comp => {
      if (comp.id === id) {
        const updated = { ...comp };
        
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          (updated as any)[parent] = {
            ...(updated as any)[parent],
            [child]: value
          };
        } else {
          (updated as any)[field] = value;
        }
        
        // Recalculate derived values
        if (field === 'price' || field === 'size') {
          updated.pricePerSqm = updated.size > 0 ? updated.price / updated.size : 0;
        }
        
        // Recalculate adjusted price when adjustment factors change
        if (field.includes('adjustmentFactors') || field === 'price') {
          const factors = updated.adjustmentFactors;
          updated.adjustedPrice = updated.price * factors.location * factors.condition * factors.size * factors.timing * factors.sustainability;
        }
        
        return updated;
      }
      return comp;
    }));
  };

  const calculateValuation = () => {
    if (comparables.length === 0) return null;
    
    const averageAdjustedPrice = comparables.reduce((sum, comp) => sum + comp.adjustedPrice, 0) / comparables.length;
    const averagePricePerSqm = comparables.reduce((sum, comp) => sum + (comp.adjustedPrice / comp.size), 0) / comparables.length;
    const estimatedValue = subjectProperty.size * averagePricePerSqm;
    
    return {
      averageAdjustedPrice,
      averagePricePerSqm,
      estimatedValue,
      valueRange: {
        low: estimatedValue * 0.9,
        high: estimatedValue * 1.1
      },
      comparablesCount: comparables.length
    };
  };

  const handleSubmit = () => {
    const valuation = calculateValuation();
    if (!valuation) {
      toast.error("Please add comparable sales data first");
      return;
    }
    
    const results = {
      subjectProperty,
      selectedAssetType,
      comparables,
      valuation,
      methodology: 'Direct Comparison Approach',
      calculationDate: new Date().toISOString()
    };
    
    onSubmit(results);
    toast.success("Direct comparison valuation completed!");
  };

  const valuation = calculateValuation();

  return (
    <div className="space-y-6">
      {/* Asset Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Property Type & Search Parameters
          </CardTitle>
          <CardDescription>
            Select asset type and configure search parameters for comparable sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Asset Type</Label>
              <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedAssetType === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Asset Type</Label>
                <Input
                  value={customAssetType}
                  onChange={(e) => setCustomAssetType(e.target.value)}
                  placeholder="Enter custom asset type"
                />
              </div>
            )}
          </div>
          
          <Button onClick={handleFetchComparables} disabled={isLoading} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Fetching Comparables...' : 'Fetch Comparable Sales'}
          </Button>
        </CardContent>
      </Card>

      {/* Subject Property Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Subject Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Name</Label>
              <Input
                value={subjectProperty.name}
                onChange={(e) => setSubjectProperty(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter property name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={subjectProperty.location}
                onChange={(e) => setSubjectProperty(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Size (sqm)</Label>
              <Input
                type="number"
                value={subjectProperty.size}
                onChange={(e) => setSubjectProperty(prev => ({ ...prev, size: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparable Sales */}
      {comparables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Comparable Sales Evidence
              </span>
              <Button onClick={addCustomComparable} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Comparable
              </Button>
            </CardTitle>
            <CardDescription>
              Review and adjust comparable sales data with adjustment factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparables.map((comparable) => (
                <Card key={comparable.id} className="relative">
                  <CardContent className="pt-6">
                    <Button
                      onClick={() => removeComparable(comparable.id)}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Property Details</TabsTrigger>
                        <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Property Name</Label>
                            <Input
                              value={comparable.property}
                              onChange={(e) => updateComparable(comparable.id, 'property', e.target.value)}
                              placeholder="Property name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={comparable.location}
                              onChange={(e) => updateComparable(comparable.id, 'location', e.target.value)}
                              placeholder="Location"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Sale Date</Label>
                            <Input
                              type="date"
                              value={comparable.saleDate}
                              onChange={(e) => updateComparable(comparable.id, 'saleDate', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Sale Price ($)</Label>
                            <Input
                              type="number"
                              value={comparable.price}
                              onChange={(e) => updateComparable(comparable.id, 'price', Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Size (sqm)</Label>
                            <Input
                              type="number"
                              value={comparable.size}
                              onChange={(e) => updateComparable(comparable.id, 'size', Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Price per sqm</Label>
                            <div className="p-2 bg-muted rounded border text-sm">
                              ${comparable.pricePerSqm.toFixed(0)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Adjusted Price</Label>
                            <div className="p-2 bg-primary/10 rounded border text-sm font-medium">
                              ${comparable.adjustedPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="adjustments" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {Object.entries(comparable.adjustmentFactors).map(([factor, value]) => (
                            <div key={factor} className="space-y-2">
                              <Label className="capitalize">{factor}</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="2"
                                value={value}
                                onChange={(e) => updateComparable(comparable.id, `adjustmentFactors.${factor}`, Number(e.target.value))}
                              />
                              <Badge variant={value > 1 ? "default" : value < 1 ? "destructive" : "secondary"} className="text-xs">
                                {value > 1 ? '+' : ''}{((value - 1) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valuation Results */}
      {valuation && (
        <Card>
          <CardHeader>
            <CardTitle>Valuation Results</CardTitle>
            <CardDescription>
              Direct comparison approach valuation based on {valuation.comparablesCount} comparable sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Average Price per sqm</Label>
                <div className="text-xl font-bold">
                  ${valuation.averagePricePerSqm.toFixed(0)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Estimated Value</Label>
                <div className="text-2xl font-bold text-primary">
                  ${valuation.estimatedValue.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Valuation Range</Label>
                <div className="text-sm">
                  <div>${valuation.valueRange.low.toLocaleString()} - ${valuation.valueRange.high.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Confidence Level</Label>
                <Badge variant={valuation.comparablesCount >= 3 ? "default" : "secondary"}>
                  {valuation.comparablesCount >= 3 ? "High" : "Medium"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={handleSubmit} 
        className="w-full" 
        size="lg"
        disabled={comparables.length === 0 || !subjectProperty.size}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Complete Direct Comparison Valuation
      </Button>
    </div>
  );
}