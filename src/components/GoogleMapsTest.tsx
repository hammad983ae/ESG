/**
 * Google Maps API Test Component
 * Simple test to verify Google Maps integration is working
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, TestTube, CheckCircle, XCircle } from "lucide-react";
import { searchAddresses, geocodeAddress, enhancePropertyDataWithAI, type PropertyData } from "@/lib/googleMapsService";
import { useToast } from "@/hooks/use-toast";

export const GoogleMapsTest = () => {
  const [testAddress, setTestAddress] = useState("123 Collins Street, Melbourne VIC 3000");
  const [searchResults, setSearchResults] = useState<PropertyData[]>([]);
  const [geocodeResult, setGeocodeResult] = useState<{ lat: number; lng: number } | null>(null);
  const [aiEnhancedData, setAiEnhancedData] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const runSearchTest = async () => {
    setIsLoading(true);
    setTestStatus('idle');
    
    try {
      const results = await searchAddresses(testAddress);
      setSearchResults(results);
      setTestStatus('success');
      
      toast({
        title: "Search Test Successful",
        description: `Found ${results.length} addresses using Google Maps API`,
      });
    } catch (error) {
      console.error('Search test failed:', error);
      setTestStatus('error');
      
      toast({
        title: "Search Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runGeocodeTest = async () => {
    setIsLoading(true);
    
    try {
      const result = await geocodeAddress(testAddress);
      setGeocodeResult(result);
      
      if (result) {
        toast({
          title: "Geocode Test Successful",
          description: `Coordinates: ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}`,
        });
      } else {
        toast({
          title: "Geocode Test Failed",
          description: "Could not find coordinates for the address",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Geocode test failed:', error);
      toast({
        title: "Geocode Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAITest = async () => {
    if (searchResults.length === 0) {
      toast({
        title: "No Search Results",
        description: "Please run address search first to get property data for AI enhancement",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const firstResult = searchResults[0];
      const enhancedData = await enhancePropertyDataWithAI(firstResult);
      setAiEnhancedData(enhancedData);
      
      toast({
        title: "AI Enhancement Successful",
        description: "Property data has been enhanced with AI insights",
      });
    } catch (error) {
      console.error('AI enhancement test failed:', error);
      toast({
        title: "AI Enhancement Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Google Maps API Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Address:</label>
            <Input
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              placeholder="Enter an address to test..."
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runSearchTest} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Test Address Search
            </Button>
            
            <Button 
              onClick={runGeocodeTest} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Test Geocoding
            </Button>
            
            <Button 
              onClick={runAITest} 
              disabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test AI Enhancement
            </Button>
          </div>

          {testStatus !== 'idle' && (
            <div className="flex items-center gap-2">
              {testStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {testStatus === 'success' ? 'API Integration Working' : 'API Integration Failed'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{result.address}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.propertyType && (
                          <Badge variant="outline" className="text-xs">
                            {result.propertyType}
                          </Badge>
                        )}
                        {result.zoning && (
                          <Badge variant="secondary" className="text-xs">
                            {result.zoning}
                          </Badge>
                        )}
                        {result.council && (
                          <Badge variant="outline" className="text-xs">
                            {result.council}
                          </Badge>
                        )}
                      </div>
                      {result.coordinates && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Coordinates: {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {geocodeResult && (
        <Card>
          <CardHeader>
            <CardTitle>Geocoding Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Address: {testAddress}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Latitude: {geocodeResult.lat.toFixed(6)}
              </p>
              <p className="text-sm text-muted-foreground">
                Longitude: {geocodeResult.lng.toFixed(6)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {aiEnhancedData && aiEnhancedData.aiInsights && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Enhanced Property Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Market Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Estimated Value:</strong> ${aiEnhancedData.aiInsights.estimatedMarketValue?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Investment Grade:</strong> {aiEnhancedData.aiInsights.investmentGrade || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Market Trend:</strong> {aiEnhancedData.aiInsights.marketTrend || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Property Condition:</strong> {aiEnhancedData.aiInsights.propertyCondition || 'N/A'}
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Location Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Transport Access:</strong> {aiEnhancedData.aiInsights.transportAccess || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Development Potential:</strong> {aiEnhancedData.aiInsights.developmentPotential || 'N/A'}
                  </p>
                  {aiEnhancedData.aiInsights.nearbyAmenities && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Nearby Amenities:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiEnhancedData.aiInsights.nearbyAmenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {aiEnhancedData.aiInsights.recommendations && aiEnhancedData.aiInsights.recommendations.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">AI Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {aiEnhancedData.aiInsights.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiEnhancedData.aiInsights.riskFactors && aiEnhancedData.aiInsights.riskFactors.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Risk Factors</h4>
                  <div className="flex flex-wrap gap-1">
                    {aiEnhancedData.aiInsights.riskFactors.map((risk, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {risk}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
