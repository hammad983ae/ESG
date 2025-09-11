/**
 * Property Details Panel - Comprehensive CoreLogic Property Data Display
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000017
 * 
 * Displays comprehensive property details using CoreLogic Property Data API
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Camera, 
  FileText, 
  Home,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { coreLogicService, type CoreLogicApiResponse } from '@/lib/corelogicService';

interface PropertyDetailsPanelProps {
  propertyId: string | number;
  propertyAddress?: string;
  className?: string;
  onDataLoaded?: (data: any) => void;
}

interface PropertyDetailsData {
  otmSales?: any;
  otmRent?: any;
  timeline?: any;
  legal?: any;
  contacts?: any;
  occupancy?: any;
  developmentApplications?: any;
  location?: any;
  images?: any;
  site?: any;
  coreAttributes?: any;
  additionalAttributes?: any;
  features?: any;
  sales?: any;
}

export function PropertyDetailsPanel({
  propertyId,
  propertyAddress,
  className = '',
  onDataLoaded
}: PropertyDetailsPanelProps) {
  const [propertyData, setPropertyData] = useState<PropertyDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showImages, setShowImages] = useState(false);
  const { toast } = useToast();

  // Load property details on mount
  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails();
    }
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await coreLogicService.getComprehensivePropertyDetails(propertyId, false);
      
      if (response.success && response.data) {
        setPropertyData(response.data);
        onDataLoaded?.(response.data);
      } else {
        throw new Error(response.error || 'Failed to load property details');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load property details';
      setError(errorMessage);
      toast({
        title: "Property Details Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={loadPropertyDetails}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!propertyData) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Details
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadPropertyDetails}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        {propertyAddress && (
          <p className="text-sm text-muted-foreground">{propertyAddress}</p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Core Attributes */}
            {propertyData.coreAttributes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Attributes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-semibold">{propertyData.coreAttributes.propertyType || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{propertyData.coreAttributes.beds || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{propertyData.coreAttributes.baths || 'N/A'}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Car Spaces</p>
                    <p className="font-semibold">{propertyData.coreAttributes.carSpaces || 'N/A'}</p>
                  </div>
                </div>
                {propertyData.coreAttributes.landArea && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Land Area</p>
                    <p className="font-semibold">{propertyData.coreAttributes.landArea}m²</p>
                  </div>
                )}
              </div>
            )}

            {/* Location Information */}
            {propertyData.location && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">{propertyData.location.singleLine}</p>
                  {propertyData.location.locallyFormattedAddress && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {propertyData.location.locallyFormattedAddress}
                    </p>
                  )}
                  {propertyData.location.coordinates && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {propertyData.location.latitude}, {propertyData.location.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Occupancy Information */}
            {propertyData.occupancy && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Occupancy
                </h3>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {propertyData.occupancy.occupancyType || 'Unknown'}
                  </Badge>
                  <Badge 
                    variant={propertyData.occupancy.confidenceScore === 'High' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {propertyData.occupancy.confidenceScore || 'Unknown'} Confidence
                  </Badge>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            {/* OTM Sales */}
            {propertyData.otmSales && propertyData.otmSales.forSalePropertyCampaign && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  On The Market - Sales
                </h3>
                {propertyData.otmSales.forSalePropertyCampaign.campaigns?.map((campaign: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={campaign.isActiveCampaign ? 'default' : 'secondary'}>
                        {campaign.isActiveCampaign ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.daysOnMarket} days on market
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold">{campaign.priceDescription || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agency</p>
                        <p className="font-semibold">{campaign.agency?.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-semibold">{campaign.agent?.agent || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* OTM Rent */}
            {propertyData.otmRent && propertyData.otmRent.forRentPropertyCampaign && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  On The Market - Rent
                </h3>
                {propertyData.otmRent.forRentPropertyCampaign.campaigns?.map((campaign: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={campaign.isActiveCampaign ? 'default' : 'secondary'}>
                        {campaign.isActiveCampaign ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.daysOnMarket} days on market
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rent</p>
                        <p className="font-semibold">{campaign.priceDescription || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agency</p>
                        <p className="font-semibold">{campaign.agency?.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-semibold">{campaign.agent?.agent || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sales History */}
            {propertyData.sales && propertyData.sales.saleList && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sales History
                </h3>
                <div className="space-y-2">
                  {propertyData.sales.saleList.slice(0, 5).map((sale: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {sale.price ? formatCurrency(sale.price) : 'Price Withheld'}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(sale.contractDate)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Agency</p>
                          <p>{sale.agencyName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Agent</p>
                          <p>{sale.agentName || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            {/* Legal Information */}
            {propertyData.legal && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Legal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Real Property Description</p>
                    <p className="font-semibold">{propertyData.legal.realPropertyDescription || 'N/A'}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">VG Number</p>
                    <p className="font-semibold">{propertyData.legal.vgNumber || 'N/A'}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Heritage Status</p>
                    <p className="font-semibold">{propertyData.legal.heritageRegistered || 'N/A'}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Maori Land</p>
                    <p className="font-semibold">{propertyData.legal.maoriLand || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Development Applications */}
            {propertyData.developmentApplications && propertyData.developmentApplications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Development Applications
                </h3>
                <div className="space-y-2">
                  {propertyData.developmentApplications.map((app: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{app.developmentApplicationType || 'N/A'}</p>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(app.permitIssueDate)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Build Value</p>
                          <p>{app.buildValue ? formatCurrency(app.buildValue) : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Build Area</p>
                          <p>{app.buildArea ? `${app.buildArea}m²` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Permit Number</p>
                          <p>{app.permitNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Additional Attributes */}
            {propertyData.additionalAttributes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Additional Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyData.additionalAttributes.airConditioned && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Air Conditioning</span>
                    </div>
                  )}
                  {propertyData.additionalAttributes.pool && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Swimming Pool</span>
                    </div>
                  )}
                  {propertyData.additionalAttributes.fireplace && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fireplace</span>
                    </div>
                  )}
                  {propertyData.additionalAttributes.solarPower && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Solar Power</span>
                    </div>
                  )}
                </div>
                {propertyData.additionalAttributes.yearBuilt && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-semibold">{propertyData.additionalAttributes.yearBuilt}</p>
                  </div>
                )}
              </div>
            )}

            {/* Images */}
            {propertyData.images && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Property Images
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImages(!showImages)}
                  >
                    {showImages ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showImages ? 'Hide' : 'Show'} Images
                  </Button>
                </div>
                {showImages && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propertyData.images.defaultImage && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Default Image</p>
                        <img
                          src={propertyData.images.defaultImage.mediumPhotoUrl}
                          alt="Property default"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {propertyData.images.secondaryImageList && propertyData.images.secondaryImageList.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Additional Images</p>
                        <div className="grid grid-cols-2 gap-2">
                          {propertyData.images.secondaryImageList.slice(0, 4).map((image: any, index: number) => (
                            <img
                              key={index}
                              src={image.mediumPhotoUrl}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contacts */}
            {propertyData.contacts && propertyData.contacts.contacts && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Property Contacts
                </h3>
                <div className="space-y-2">
                  {propertyData.contacts.contacts.map((contact: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{contact.contactType}</p>
                        {contact.person && (
                          <p className="text-sm text-muted-foreground">
                            {contact.person.firstName} {contact.person.lastName}
                          </p>
                        )}
                      </div>
                      {contact.company && (
                        <p className="text-sm">{contact.company.companyName}</p>
                      )}
                      {contact.phoneNumber && (
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
