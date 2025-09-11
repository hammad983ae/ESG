/**
 * Enhanced Specialized AVM Section with Real CoreLogic Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Enhanced AVM section with real CoreLogic AVM data integration
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedAddressFinder } from "@/components/EnhancedAddressFinder";
import { AVMDisplay } from "@/components/AVMDisplay";
import { AVMComparison } from "@/components/AVMComparison";
import { useToast } from "@/components/ui/use-toast";
import { type CoreLogicAddressMatch } from "@/lib/corelogicService";
import { avmService, type AVMOriginationData, type AVMConsumerBandData } from "@/lib/avmService";
import { 
  Building2, 
  Factory, 
  ShoppingCart, 
  Hotel, 
  Heart, 
  GraduationCap,
  Bot,
  Globe,
  Calculator,
  TrendingUp,
  Wheat,
  TreePine,
  Plus,
  Trash2,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  FileText
} from "lucide-react";

interface PropertyAVMData {
  id: string;
  propertyAddress: string;
  propertyType: string;
  subPropertyType?: string;
  landArea: number;
  buildingArea: number;
  yearBuilt: number;
  condition: string;
  propertyId?: string;
  avmData?: {
    origination?: AVMOriginationData;
    consumerBand?: AVMConsumerBandData;
  };
  customValuation?: number;
}

interface AggregatedResult {
  totalValue: number;
  averageConfidence: number;
  totalProperties: number;
  properties: PropertyAVMData[];
  breakdown: {
    [key: string]: {
      count: number;
      totalValue: number;
      averageValue: number;
    };
  };
}

const propertyTypeOptions = {
  commercial: ["Office Buildings", "Warehouses", "Shopping Centers", "Mixed Use"],
  industrial: ["Manufacturing", "Distribution Centers", "Cold Storage", "Heavy Industrial"],
  retail: ["Strip Centers", "Department Stores", "Specialty Retail", "Drive-Through"],
  hospitality: ["Hotels", "Motels", "Resorts", "Serviced Apartments"],
  healthcare: ["Hospitals", "Medical Centers", "Aged Care", "Veterinary Clinics"],
  education: ["Schools", "Universities", "Training Centers", "Childcare Centers"],
  agricultural: ["Crop Farms", "Livestock Farms", "Poultry Farms"],
  horticultural: ["Nurseries", "Greenhouses", "Orchards", "Market Gardens", "Vineyards"]
};

const EnhancedSpecializedAVMSection = () => {
  const [activeTab, setActiveTab] = useState("commercial");
  const [isProcessing, setIsProcessing] = useState(false);
  const [properties, setProperties] = useState<PropertyAVMData[]>([]);
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyAVMData | null>(null);
  const { toast } = useToast();

  const addProperty = () => {
    const newProperty: PropertyAVMData = {
      id: Date.now().toString(),
      propertyAddress: "",
      propertyType: activeTab,
      landArea: 0,
      buildingArea: 0,
      yearBuilt: new Date().getFullYear(),
      condition: ""
    };
    setProperties([...properties, newProperty]);
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  };

  const handleAddressSelect = (propertyData: CoreLogicAddressMatch & { avmData?: any }) => {
    const propertyId = propertyData.propertyId;
    if (!propertyId) return;

    // Update the property with CoreLogic data
    setProperties(prev => prev.map(p => 
      p.id === selectedProperty?.id 
        ? { 
            ...p, 
            propertyAddress: propertyData.address,
            propertyId: propertyId,
            avmData: propertyData.avmData
          }
        : p
    ));

    // Update selected property
    if (selectedProperty) {
      setSelectedProperty({
        ...selectedProperty,
        propertyAddress: propertyData.address,
        propertyId: propertyId,
        avmData: propertyData.avmData
      });
    }

    toast({
      title: "Property Updated",
      description: "Property address and AVM data have been loaded",
    });
  };

  const handleCustomValuationChange = (propertyId: string, value: number) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, customValuation: value } : p
    ));

    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(prev => prev ? { ...prev, customValuation: value } : null);
    }
  };

  const calculateAggregatedResults = async () => {
    if (properties.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Process properties with AVM data
      const processedProperties = await Promise.all(
        properties.map(async (property) => {
          if (property.propertyId && !property.avmData) {
            try {
              const avmData = await avmService.getComprehensiveAVMData(property.propertyId);
              return { ...property, avmData };
            } catch (error) {
              console.error(`Failed to load AVM for property ${property.propertyId}:`, error);
              return property;
            }
          }
          return property;
        })
      );

      // Calculate aggregated results
      const totalValue = processedProperties.reduce((sum, prop) => {
        if (prop.avmData?.origination) {
          return sum + prop.avmData.origination.estimate;
        } else if (prop.avmData?.consumerBand) {
          return sum + (prop.avmData.consumerBand.lowerBand + prop.avmData.consumerBand.upperBand) / 2;
        }
        return sum;
      }, 0);

      const propertiesWithAVM = processedProperties.filter(prop => prop.avmData);
      const averageConfidence = propertiesWithAVM.length > 0 
        ? propertiesWithAVM.reduce((sum, prop) => {
            const confidence = prop.avmData?.origination?.confidence || prop.avmData?.consumerBand?.confidence;
            const confidenceValue = confidence === 'HIGH' ? 1 : 
                                 confidence === 'MEDIUM_HIGH' ? 0.8 :
                                 confidence === 'MEDIUM' ? 0.6 :
                                 confidence === 'MEDIUM_LOW' ? 0.4 : 0.2;
            return sum + confidenceValue;
          }, 0) / propertiesWithAVM.length
        : 0;

      // Calculate breakdown by property type
      const breakdown: { [key: string]: { count: number; totalValue: number; averageValue: number } } = {};
      processedProperties.forEach(prop => {
        if (!breakdown[prop.propertyType]) {
          breakdown[prop.propertyType] = { count: 0, totalValue: 0, averageValue: 0 };
        }
        breakdown[prop.propertyType].count++;
        
        let value = 0;
        if (prop.avmData?.origination) {
          value = prop.avmData.origination.estimate;
        } else if (prop.avmData?.consumerBand) {
          value = (prop.avmData.consumerBand.lowerBand + prop.avmData.consumerBand.upperBand) / 2;
        }
        
        breakdown[prop.propertyType].totalValue += value;
      });

      // Calculate averages
      Object.keys(breakdown).forEach(key => {
        if (breakdown[key].count > 0) {
          breakdown[key].averageValue = breakdown[key].totalValue / breakdown[key].count;
        }
      });

      const aggregated: AggregatedResult = {
        totalValue,
        averageConfidence,
        totalProperties: processedProperties.length,
        properties: processedProperties,
        breakdown
      };

      setProperties(processedProperties);
      setAggregatedResults(aggregated);
      
      toast({
        title: "Analysis Complete",
        description: `Processed ${processedProperties.length} properties with AVM data`,
      });
    } catch (error) {
      console.error('Error calculating aggregated results:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to calculate aggregated results",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'commercial': return <Building2 className="h-5 w-5" />;
      case 'industrial': return <Factory className="h-5 w-5" />;
      case 'retail': return <ShoppingCart className="h-5 w-5" />;
      case 'hospitality': return <Hotel className="h-5 w-5" />;
      case 'healthcare': return <Heart className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      case 'agricultural': return <Wheat className="h-5 w-5" />;
      case 'horticultural': return <TreePine className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const AVMForm = ({ assetType, icon: Icon, title }: { assetType: string, icon: any, title: string }) => {
    const [formData, setFormData] = useState<PropertyAVMData>({
      id: Date.now().toString(),
      propertyAddress: "",
      propertyType: assetType,
      subPropertyType: "",
      landArea: 0,
      buildingArea: 0,
      yearBuilt: new Date().getFullYear(),
      condition: ""
    });

    const handleAddressSelect = (propertyData: CoreLogicAddressMatch & { avmData?: any }) => {
      setFormData(prev => ({
        ...prev,
        propertyAddress: propertyData.address,
        propertyId: propertyData.propertyId,
        avmData: propertyData.avmData
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setProperties(prev => [...prev, formData]);
      setSelectedProperty(formData);
      setFormData({
        id: Date.now().toString(),
        propertyAddress: "",
        propertyType: assetType,
        subPropertyType: "",
        landArea: 0,
        buildingArea: 0,
        yearBuilt: new Date().getFullYear(),
        condition: ""
      });
      toast({
        title: "Property Added",
        description: "Property has been added to the portfolio",
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">{title} AVM</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Property Address</Label>
              <EnhancedAddressFinder
                onAddressSelect={handleAddressSelect}
                placeholder="Search for property address..."
                showAVM={true}
                customValuation={formData.customValuation}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subPropertyType">Sub Property Type</Label>
                <Select
                  value={formData.subPropertyType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subPropertyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeOptions[assetType as keyof typeof propertyTypeOptions]?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) || 0 }))}
                  min="1800"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landArea">Land Area (m²)</Label>
                <Input
                  id="landArea"
                  type="number"
                  value={formData.landArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, landArea: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="buildingArea">Building Area (m²)</Label>
                <Input
                  id="buildingArea"
                  type="number"
                  value={formData.buildingArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, buildingArea: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Property Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customValuation">Custom Valuation (Optional)</Label>
              <Input
                id="customValuation"
                type="number"
                value={formData.customValuation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customValuation: parseFloat(e.target.value) || undefined }))}
                min="0"
                step="1000"
                placeholder="Enter your valuation estimate"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Property to Portfolio
          </Button>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Enhanced Specialized AVM Analysis
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time property valuation using CoreLogic AVM data with portfolio analysis
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="industrial">Industrial</TabsTrigger>
              <TabsTrigger value="retail">Retail</TabsTrigger>
              <TabsTrigger value="hospitality">Hospitality</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="agricultural">Agricultural</TabsTrigger>
              <TabsTrigger value="horticultural">Horticultural</TabsTrigger>
            </TabsList>

            <TabsContent value="commercial">
              <AVMForm assetType="commercial" icon={Building2} title="Commercial" />
            </TabsContent>

            <TabsContent value="industrial">
              <AVMForm assetType="industrial" icon={Factory} title="Industrial" />
            </TabsContent>

            <TabsContent value="retail">
              <AVMForm assetType="retail" icon={ShoppingCart} title="Retail" />
            </TabsContent>

            <TabsContent value="hospitality">
              <AVMForm assetType="hospitality" icon={Hotel} title="Hospitality" />
            </TabsContent>

            <TabsContent value="healthcare">
              <AVMForm assetType="healthcare" icon={Heart} title="Healthcare" />
            </TabsContent>

            <TabsContent value="education">
              <AVMForm assetType="education" icon={GraduationCap} title="Education" />
            </TabsContent>

            <TabsContent value="agricultural">
              <AVMForm assetType="agricultural" icon={Wheat} title="Agricultural" />
            </TabsContent>

            <TabsContent value="horticultural">
              <AVMForm assetType="horticultural" icon={TreePine} title="Horticultural" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Portfolio Management */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Property Portfolio ({properties.length} properties)
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={calculateAggregatedResults}
                  disabled={isProcessing}
                  variant="outline"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Portfolio
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">{getPropertyTypeIcon(property.propertyType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{property.propertyAddress || 'No address'}</h3>
                            <Badge variant="outline">{property.propertyType}</Badge>
                            {property.propertyId && (
                              <Badge variant="secondary">CoreLogic ID: {property.propertyId}</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>Land: {property.landArea}m²</div>
                            <div>Building: {property.buildingArea}m²</div>
                            <div>Year: {property.yearBuilt}</div>
                            <div>Condition: {property.condition}</div>
                          </div>

                          {/* AVM Data Display */}
                          {property.avmData && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                              <h4 className="font-medium mb-2">CoreLogic AVM Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {property.avmData.origination && (
                                  <div>
                                    <span className="text-muted-foreground">Origination: </span>
                                    <span className="font-semibold text-primary">
                                      {formatCurrency(property.avmData.origination.estimate)}
                                    </span>
                                    <span className="ml-2 text-xs">
                                      ({property.avmData.origination.confidence})
                                    </span>
                                  </div>
                                )}
                                {property.avmData.consumerBand && (
                                  <div>
                                    <span className="text-muted-foreground">Consumer Band: </span>
                                    <span className="font-semibold">
                                      {formatCurrency(property.avmData.consumerBand.lowerBand)} - {formatCurrency(property.avmData.consumerBand.upperBand)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Custom Valuation Input */}
                          <div className="mt-3">
                            <Label htmlFor={`custom-${property.id}`} className="text-sm">Custom Valuation</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`custom-${property.id}`}
                                type="number"
                                value={property.customValuation || ''}
                                onChange={(e) => handleCustomValuationChange(property.id, parseFloat(e.target.value) || 0)}
                                placeholder="Enter custom valuation"
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProperty(property)}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* AVM Comparison */}
                          {property.customValuation && property.avmData && (
                            <div className="mt-3">
                              <AVMComparison
                                propertyId={property.propertyId!}
                                customValuation={property.customValuation}
                                compact={true}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aggregated Results */}
      {aggregatedResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(aggregatedResults.totalValue)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Average Confidence</p>
                <p className="text-3xl font-bold">
                  {Math.round(aggregatedResults.averageConfidence * 100)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Properties Analyzed</p>
                <p className="text-3xl font-bold">
                  {aggregatedResults.totalProperties}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-4">Breakdown by Property Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(aggregatedResults.breakdown).map(([type, data]) => (
                  <div key={type} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getPropertyTypeIcon(type)}
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Count:</span>
                        <span>{data.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Value:</span>
                        <span className="font-semibold">{formatCurrency(data.totalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span className="font-semibold">{formatCurrency(data.averageValue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Property AVM Details */}
      {selectedProperty && selectedProperty.propertyId && (
        <AVMDisplay
          propertyId={selectedProperty.propertyId}
          propertyAddress={selectedProperty.propertyAddress}
          customValuation={selectedProperty.customValuation}
          showComparison={true}
          showHistory={true}
          showLiveAVM={true}
        />
      )}
    </div>
  );
};

export default EnhancedSpecializedAVMSection;
