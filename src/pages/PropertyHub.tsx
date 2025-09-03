/**
 * Property Hub - Central Dashboard for All Property Types
 * Mobile-optimized for iOS and Android devices
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Store, 
  Baby, 
  Heart, 
  ShoppingBag, 
  Warehouse, 
  Home, 
  Factory, 
  Hotel, 
  GraduationCap,
  ArrowLeft,
  MapPin,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "sonner";

// Import property-specific components
import { ChildcareValuationForm } from "@/components/ChildcareValuationForm";
import { HospitalityValuationForm } from "@/components/HospitalityValuationForm";
import { PetrolStationValuationForm } from "@/components/PetrolStationValuationForm";
import { StadiumValuationForm } from "@/components/StadiumValuationForm";
import { IPProtectionNotice } from "@/components/IPProtectionNotice";
import { CapitalizationNetIncomeForm } from "@/components/CapitalizationNetIncomeForm";
import { SummationApproachForm } from "@/components/SummationApproachForm";
import { ValuationDirectComparisonForm } from "@/components/ValuationDirectComparisonForm";
import { PropertyBuilder } from "@/components/PropertyBuilder";
import { AddressFinder } from "@/components/AddressFinder";
import { ForecastingGrowthFunctions } from "@/components/ForecastingGrowthFunctions";
import { WeightPortfolioSection } from "@/components/WeightPortfolioSection";
import { ComparableAssetForecast } from "@/components/ComparableAssetForecast";
import { RateGrowthAnalysis } from "@/components/RateGrowthAnalysis";

export default function PropertyHub() {
  const navigate = useNavigate();
  const [activePropertyType, setActivePropertyType] = useState<string>('overview');

  const propertyTypes = [
    {
      id: 'commercial-office',
      name: 'Commercial Office',
      icon: Building2,
      description: 'Office buildings, business parks, and corporate facilities',
      examples: 'CBD offices, suburban business parks',
      color: 'bg-blue-500',
      category: 'commercial'
    },
    {
      id: 'retail',
      name: 'Retail Properties',
      icon: Store,
      description: 'Shopping centers, strip malls, and standalone retail',
      examples: 'Shopping malls, convenience stores',
      color: 'bg-green-500',
      category: 'commercial'
    },
    {
      id: 'childcare',
      name: 'Childcare Centers',
      icon: Baby,
      description: 'Early childhood education and care facilities',
      examples: 'Day care centers, preschools',
      color: 'bg-pink-500',
      category: 'specialized'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Facilities',
      icon: Heart,
      description: 'Medical centers, clinics, and health services',
      examples: 'Medical centers, dental clinics',
      color: 'bg-red-500',
      category: 'specialized'
    },
    {
      id: 'big-box',
      name: 'Big Box Retail',
      icon: Warehouse,
      description: 'Large format retail and national tenants',
      examples: 'Woolworths, Coles, Bunnings',
      color: 'bg-orange-500',
      category: 'retail'
    },
    {
      id: 'residential',
      name: 'Residential',
      icon: Home,
      description: 'Houses, apartments, and residential developments',
      examples: 'Single homes, unit complexes',
      color: 'bg-purple-500',
      category: 'residential'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: Factory,
      description: 'Warehouses, manufacturing, and logistics facilities',
      examples: 'Distribution centers, factories',
      color: 'bg-gray-600',
      category: 'industrial'
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      icon: Hotel,
      description: 'Hotels, motels, and accommodation facilities',
      examples: 'Hotels, serviced apartments',
      color: 'bg-cyan-500',
      category: 'hospitality'
    },
    {
      id: 'education',
      name: 'Educational',
      icon: GraduationCap,
      description: 'Schools, universities, and training facilities',
      examples: 'Primary schools, universities',
      color: 'bg-indigo-500',
      category: 'specialized'
    },
    {
      id: 'petrol-station',
      name: 'Petrol Stations',
      icon: Zap,
      description: 'Fuel stations and convenience retail',
      examples: 'Service stations, truck stops',
      color: 'bg-yellow-500',
      category: 'specialized'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Properties', count: propertyTypes.length },
    { id: 'commercial', name: 'Commercial', count: propertyTypes.filter(p => p.category === 'commercial').length },
    { id: 'retail', name: 'Retail', count: propertyTypes.filter(p => p.category === 'retail').length },
    { id: 'residential', name: 'Residential', count: propertyTypes.filter(p => p.category === 'residential').length },
    { id: 'specialized', name: 'Specialized', count: propertyTypes.filter(p => p.category === 'specialized').length },
    { id: 'industrial', name: 'Industrial', count: propertyTypes.filter(p => p.category === 'industrial').length },
    { id: 'hospitality', name: 'Hospitality', count: propertyTypes.filter(p => p.category === 'hospitality').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProperties = selectedCategory === 'all' 
    ? propertyTypes 
    : propertyTypes.filter(p => p.category === selectedCategory);

  const handlePropertySubmit = (data: any, propertyType: string) => {
    toast.success(`${propertyType} assessment completed!`);
    console.log(`${propertyType} data:`, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Mobile-friendly container */}
      <div className="mobile-container mobile-padding py-4 sm:py-6 lg:py-8">
        
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Property Hub
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Comprehensive property assessment and valuation platform for all property types
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm py-2 px-4 touch-manipulation">
              <Building2 className="h-4 w-4 mr-2" />
              {propertyTypes.length} Property Types
            </Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4 touch-manipulation">
              <TrendingUp className="h-4 w-4 mr-2" />
              Advanced Valuations
            </Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4 touch-manipulation">
              <Shield className="h-4 w-4 mr-2" />
              ESG Assessments
            </Badge>
          </div>
        </div>

        {/* IP Protection Notice */}
        <div className="mb-8">
          <IPProtectionNotice />
        </div>

        {/* Category Filter Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 mb-6 touch-manipulation min-h-[44px] overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs sm:text-sm px-2 py-2 touch-manipulation min-w-fit"
              >
                <span className="truncate">{category.name}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Property Types Grid */}
        <Tabs value={activePropertyType} onValueChange={setActivePropertyType}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {filteredProperties.map((property) => {
              const IconComponent = property.icon;
              const isActive = activePropertyType === property.id;
              
              return (
                <Card 
                  key={property.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 touch-manipulation ${
                    isActive ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setActivePropertyType(property.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${property.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${property.color.replace('bg-', 'text-')}`} />
                      </div>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {property.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.examples}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Property Type Content */}
          <div className="mt-8">
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Assessment Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Select a property type above to access specialized valuation tools, 
                    market analysis, and ESG assessment capabilities.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">Advanced Valuations</h4>
                        <p className="text-sm text-muted-foreground">DCF, Comparable Sales, Income Approach</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Shield className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">ESG Assessments</h4>
                        <p className="text-sm text-muted-foreground">Environmental, Social, Governance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">Property Analytics</h4>
                        <p className="text-sm text-muted-foreground">Market trends, risk analysis</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Property-specific content */}
            <TabsContent value="childcare">
              <ChildcareValuationForm onSubmit={(data) => handlePropertySubmit(data, 'Childcare')} />
            </TabsContent>

            <TabsContent value="hospitality">
              <HospitalityValuationForm onSubmit={(data) => handlePropertySubmit(data, 'Hospitality')} />
            </TabsContent>

            <TabsContent value="petrol-station">
              <PetrolStationValuationForm onSubmit={(data) => handlePropertySubmit(data, 'Petrol Station')} />
            </TabsContent>

            <TabsContent value="sporting-stadiums">
              <StadiumValuationForm onSubmit={(data) => handlePropertySubmit(data, 'Stadium')} />
            </TabsContent>

            {/* Advanced Analysis Tools */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PropertyBuilder onSave={(profile) => toast.success(`Property profile saved: ${profile.name}`)} />
                <Card>
                  <CardHeader>
                    <CardTitle>Address Finder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressFinder onAddressSelect={(data) => toast.success(`Selected: ${data.address}`)} />
                  </CardContent>
                </Card>
              </div>
              
              <ForecastingGrowthFunctions onForecastComplete={(results) => toast.success("Forecast completed!")} />
              <WeightPortfolioSection onOptimizationComplete={(allocations, metrics) => toast.success("Portfolio optimized!")} />
              <ComparableAssetForecast onForecastComplete={(results) => toast.success("Asset forecast completed!")} />
              <RateGrowthAnalysis onAnalysisComplete={(results) => toast.success("Rate analysis completed!")} />
            </TabsContent>

            {/* Property-specific valuation approaches */}
            <TabsContent value="commercial-office">
              <div className="space-y-6">
                <CapitalizationNetIncomeForm onSubmit={(data) => handlePropertySubmit(data, 'Commercial Office - Cap Income')} />
                <SummationApproachForm onSubmit={(data) => handlePropertySubmit(data, 'Commercial Office - Summation')} />
                <ValuationDirectComparisonForm onSubmit={(data) => handlePropertySubmit(data, 'Commercial Office - Direct Comparison')} />
              </div>
            </TabsContent>

            <TabsContent value="industrial">
              <div className="space-y-6">
                <CapitalizationNetIncomeForm onSubmit={(data) => handlePropertySubmit(data, 'Industrial - Cap Income')} />
                <SummationApproachForm onSubmit={(data) => handlePropertySubmit(data, 'Industrial - Summation')} />
                <ValuationDirectComparisonForm onSubmit={(data) => handlePropertySubmit(data, 'Industrial - Direct Comparison')} />
              </div>
            </TabsContent>

            <TabsContent value="residential">
              <div className="space-y-6">
                <SummationApproachForm onSubmit={(data) => handlePropertySubmit(data, 'Residential - Summation')} />
                <ValuationDirectComparisonForm onSubmit={(data) => handlePropertySubmit(data, 'Residential - Direct Comparison')} />
              </div>
            </TabsContent>

            <TabsContent value="big-box">
              <div className="space-y-6">
                <CapitalizationNetIncomeForm onSubmit={(data) => handlePropertySubmit(data, 'Big Box - Cap Income')} />
                <SummationApproachForm onSubmit={(data) => handlePropertySubmit(data, 'Big Box - Summation')} />
                <ValuationDirectComparisonForm onSubmit={(data) => handlePropertySubmit(data, 'Big Box - Direct Comparison')} />
              </div>
            </TabsContent>

            {/* Placeholder for other property types */}
            {propertyTypes
              .filter(p => !['childcare', 'hospitality', 'petrol-station', 'sporting-stadiums', 'commercial-office', 'industrial', 'residential', 'big-box'].includes(p.id))
              .map((property) => (
                <TabsContent key={property.id} value={property.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <property.icon className="h-6 w-6" />
                        {property.name} Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {property.description}
                      </p>
                      <div className="p-6 bg-muted/50 rounded-lg text-center">
                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h4 className="font-semibold mb-2">Coming Soon</h4>
                        <p className="text-sm text-muted-foreground">
                          Specialized valuation tools for {property.name.toLowerCase()} are under development.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}