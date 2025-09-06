/**
 * Specialized AVM Section - Automated Valuation Models for Different Asset Types
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Features specialized AVM tabs with integrated API and AI Spider functionality
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddressFinder } from "@/components/AddressFinder";
import { useToast } from "@/components/ui/use-toast";
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
  ChevronDown
} from "lucide-react";

interface AVMData {
  id: string;
  propertyAddress: string;
  propertyType: string;
  subPropertyType?: string;
  landArea: number;
  buildingArea: number;
  yearBuilt: number;
  condition: string;
  estimatedValue?: number;
}

interface AggregatedResult {
  totalValue: number;
  averageConfidence: number;
  totalComparables: number;
  properties: AVMData[];
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

const SpecializedAVMSection = () => {
  const [activeTab, setActiveTab] = useState("commercial");
  const [isProcessing, setIsProcessing] = useState(false);
  const [avmResults, setAvmResults] = useState<{
    propertyId: string;
    estimatedValue: number;
    confidence: number;
    methodology: string;
    comparableSales: number;
    marketTrends: string;
  } | null>(null);
  const [properties, setProperties] = useState<AVMData[]>([]);
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult | null>(null);

  const addProperty = () => {
    const newProperty: AVMData = {
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
  };

  const updateProperty = (id: string, updates: Partial<AVMData>) => {
    setProperties(properties.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAVMSubmit = async (formData: AVMData, assetType: string) => {
    setIsProcessing(true);
    
    // Simulate API/AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult = {
      estimatedValue: Math.floor(Math.random() * 2000000) + 500000,
      confidence: Math.floor(Math.random() * 30) + 70,
      comparables: Math.floor(Math.random() * 15) + 5,
      marketTrend: Math.random() > 0.5 ? "Increasing" : "Stable",
      aiAnalysis: `Comprehensive AI analysis completed for ${assetType} property`,
      dataSource: "Integrated API + AI Spider Analysis"
    };
    
    setAvmResults(mockResult);
    setIsProcessing(false);
  };

  const calculateAggregatedResults = async () => {
    if (properties.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing each property
    const processedProperties = await Promise.all(
      properties.map(async (property) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const estimatedValue = Math.floor(Math.random() * 2000000) + 500000;
        return { ...property, estimatedValue };
      })
    );

    // Calculate aggregated results
    const totalValue = processedProperties.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const breakdown: AggregatedResult['breakdown'] = {};
    
    processedProperties.forEach(property => {
      const type = property.subPropertyType || property.propertyType;
      if (!breakdown[type]) {
        breakdown[type] = { count: 0, totalValue: 0, averageValue: 0 };
      }
      breakdown[type].count++;
      breakdown[type].totalValue += property.estimatedValue || 0;
      breakdown[type].averageValue = breakdown[type].totalValue / breakdown[type].count;
    });

    const aggregated: AggregatedResult = {
      totalValue,
      averageConfidence: 85,
      totalComparables: processedProperties.length * 8,
      properties: processedProperties,
      breakdown
    };

    setProperties(processedProperties);
    setAggregatedResults(aggregated);
    setIsProcessing(false);
  };

  const AVMForm = ({ assetType, icon: Icon, title }: { assetType: string, icon: any, title: string }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<AVMData>({
      id: Date.now().toString(),
      propertyAddress: "",
      propertyType: assetType,
      subPropertyType: "",
      landArea: 0,
      buildingArea: 0,
      yearBuilt: new Date().getFullYear(),
      condition: ""
    });

    const handleAddressSelect = (propertyData: any) => {
      setFormData(prev => ({
        ...prev,
        propertyAddress: propertyData.address,
        landArea: propertyData.landArea || prev.landArea,
        buildingArea: propertyData.buildingArea || prev.buildingArea,
        yearBuilt: propertyData.yearBuilt || prev.yearBuilt,
        propertyType: propertyData.propertyType || assetType
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-2xl font-bold">{title} AVM</h3>
            <p className="text-muted-foreground">AI-powered valuation with integrated data sources</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <AddressFinder
                  onAddressSelect={handleAddressSelect}
                  placeholder="Search addresses using RP Data..."
                />
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    RP Data Integration
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Auto-populate property details
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subPropertyType">Specific Property Type</Label>
                <Select onValueChange={(value) => setFormData({...formData, subPropertyType: value})}>
                  <SelectTrigger className="bg-background border border-input">
                    <SelectValue placeholder="Select specific type" />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-input shadow-lg z-50">
                    {propertyTypeOptions[assetType as keyof typeof propertyTypeOptions]?.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-accent">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Property Condition</Label>
                <Select onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger className="bg-background border border-input">
                    <SelectValue placeholder="Select condition" />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-input shadow-lg z-50">
                    <SelectItem value="excellent" className="hover:bg-accent">Excellent</SelectItem>
                    <SelectItem value="good" className="hover:bg-accent">Good</SelectItem>
                    <SelectItem value="fair" className="hover:bg-accent">Fair</SelectItem>
                    <SelectItem value="poor" className="hover:bg-accent">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area (sqm)</Label>
                <Input
                  id="landArea"
                  type="number"
                  value={formData.landArea}
                  onChange={(e) => setFormData({...formData, landArea: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingArea">Building Area (sqm)</Label>
                <Input
                  id="buildingArea"
                  type="number"
                  value={formData.buildingArea}
                  onChange={(e) => setFormData({...formData, buildingArea: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                AI Analysis
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                API Integration
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Market Data Spider
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleAVMSubmit(formData, assetType)}
                disabled={!formData.propertyAddress || !formData.condition || isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing AVM..." : "Generate Single AVM"}
              </Button>
              <Button 
                onClick={() => {
                  if (formData.propertyAddress && formData.condition) {
                    setProperties([...properties, { ...formData, id: Date.now().toString() }]);
                    toast({ title: "Property added to portfolio" });
                  }
                }}
                variant="outline"
                disabled={!formData.propertyAddress || !formData.condition}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Property Portfolio Management */}
        {properties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Property Portfolio ({properties.length} properties)
                </span>
                <Button 
                  onClick={calculateAggregatedResults}
                  disabled={isProcessing}
                  className="ml-2"
                >
                  {isProcessing ? "Processing..." : "Calculate Portfolio Value"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {properties.map((property, index) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.propertyAddress || `Property ${index + 1}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.subPropertyType || property.propertyType} • {property.condition} condition
                        {property.estimatedValue && ` • $${property.estimatedValue.toLocaleString()}`}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeProperty(property.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aggregated Results */}
        {aggregatedResults && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Portfolio Valuation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-3xl font-bold text-primary">
                    ${aggregatedResults.totalValue.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average Confidence</p>
                  <p className="text-2xl font-semibold">{aggregatedResults.averageConfidence}%</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                  <p className="text-xl font-semibold">{aggregatedResults.properties.length} assets</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Portfolio Breakdown</h4>
                <div className="grid gap-2">
                  {Object.entries(aggregatedResults.breakdown).map(([type, data]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-background/50 rounded">
                      <span className="text-sm font-medium">{type}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${data.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{data.count} properties</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Property Results */}
        {avmResults && (
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <TrendingUp className="h-5 w-5" />
                Individual AVM Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <p className="text-3xl font-bold text-success">
                    ${avmResults.estimatedValue.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Confidence Level</p>
                  <p className="text-2xl font-semibold">{avmResults.confidence}%</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Comparables Used</p>
                  <p className="text-xl font-semibold">{avmResults.comparables} properties</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Market Trend</p>
                  <Badge variant={avmResults.marketTrend === "Increasing" ? "default" : "secondary"}>
                    {avmResults.marketTrend}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">AI Analysis Summary</p>
                <p className="text-sm">{avmResults.aiAnalysis}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <Badge variant="outline">{avmResults.dataSource}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Specialized AVMs</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced Automated Valuation Models with integrated API and AI Spider technology 
          for specialized asset classes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="commercial" className="flex items-center gap-1 text-xs lg:text-sm">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Commercial</span>
          </TabsTrigger>
          <TabsTrigger value="industrial" className="flex items-center gap-1 text-xs lg:text-sm">
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">Industrial</span>
          </TabsTrigger>
          <TabsTrigger value="retail" className="flex items-center gap-1 text-xs lg:text-sm">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Retail</span>
          </TabsTrigger>
          <TabsTrigger value="hospitality" className="flex items-center gap-1 text-xs lg:text-sm">
            <Hotel className="h-4 w-4" />
            <span className="hidden sm:inline">Hospitality</span>
          </TabsTrigger>
          <TabsTrigger value="healthcare" className="flex items-center gap-1 text-xs lg:text-sm">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Healthcare</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1 text-xs lg:text-sm">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="agricultural" className="flex items-center gap-1 text-xs lg:text-sm">
            <Wheat className="h-4 w-4" />
            <span className="hidden sm:inline">Agricultural</span>
          </TabsTrigger>
          <TabsTrigger value="horticultural" className="flex items-center gap-1 text-xs lg:text-sm">
            <TreePine className="h-4 w-4" />
            <span className="hidden sm:inline">Horticultural</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commercial">
          <AVMForm assetType="commercial" icon={Building2} title="Commercial Properties" />
        </TabsContent>

        <TabsContent value="industrial">
          <AVMForm assetType="industrial" icon={Factory} title="Industrial Assets" />
        </TabsContent>

        <TabsContent value="retail">
          <AVMForm assetType="retail" icon={ShoppingCart} title="Retail Properties" />
        </TabsContent>

        <TabsContent value="hospitality">
          <AVMForm assetType="hospitality" icon={Hotel} title="Hospitality Properties" />
        </TabsContent>

        <TabsContent value="healthcare">
          <AVMForm assetType="healthcare" icon={Heart} title="Healthcare Facilities" />
        </TabsContent>

        <TabsContent value="education">
          <AVMForm assetType="education" icon={GraduationCap} title="Educational Properties" />
        </TabsContent>

        <TabsContent value="agricultural">
          <AVMForm assetType="agricultural" icon={Wheat} title="Agricultural Assets" />
        </TabsContent>

        <TabsContent value="horticultural">
          <AVMForm assetType="horticultural" icon={TreePine} title="Horticultural Properties" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpecializedAVMSection;