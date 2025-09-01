/**
 * RP Data Address Finder Component
 * Provides autocomplete address search with property data integration
 */

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Database, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PropertyData {
  address: string;
  landArea?: number;
  buildingArea?: number;
  yearBuilt?: number;
  propertyType?: string;
  zoning?: string;
  council?: string;
}

interface AddressFinderProps {
  onAddressSelect: (propertyData: PropertyData) => void;
  placeholder?: string;
}

export const AddressFinder = ({ onAddressSelect, placeholder = "Start typing an address..." }: AddressFinderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Simulated RP Data API integration
  const searchAddresses = async (query: string): Promise<PropertyData[]> => {
    // In production, this would call the actual RP Data API
    if (query.length < 3) return [];

    const mockAddresses: PropertyData[] = [
      {
        address: "123 Collins Street, Melbourne VIC 3000",
        landArea: 500,
        buildingArea: 1200,
        yearBuilt: 2010,
        propertyType: "Commercial Office",
        zoning: "Commercial 1",
        council: "City of Melbourne"
      },
      {
        address: "456 George Street, Sydney NSW 2000",
        landArea: 750,
        buildingArea: 2000,
        yearBuilt: 2015,
        propertyType: "Commercial Retail",
        zoning: "Commercial Core",
        council: "City of Sydney"
      },
      {
        address: "789 Queen Street, Brisbane QLD 4000",
        landArea: 300,
        buildingArea: 800,
        yearBuilt: 2008,
        propertyType: "Commercial Mixed Use",
        zoning: "Centre Activities",
        council: "Brisbane City"
      }
    ].filter(addr => 
      addr.address.toLowerCase().includes(query.toLowerCase())
    );

    return mockAddresses;
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setIsLoading(true);
        try {
          const results = await searchAddresses(searchTerm);
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          toast({
            title: "Search Error",
            description: "Unable to search addresses. Please check your API connection.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, toast]);

  const handleAddressSelect = (propertyData: PropertyData) => {
    setSearchTerm(propertyData.address);
    setIsOpen(false);
    onAddressSelect(propertyData);
    
    toast({
      title: "Address Selected",
      description: "Property details have been auto-populated from RP Data",
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-12"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-auto">
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleAddressSelect(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">{suggestion.address}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {suggestion.propertyType && (
                        <Badge variant="outline" className="text-xs">
                          {suggestion.propertyType}
                        </Badge>
                      )}
                      {suggestion.zoning && (
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.zoning}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {suggestion.landArea && (
                        <span>Land: {suggestion.landArea} sqm</span>
                      )}
                      {suggestion.buildingArea && (
                        <span>Building: {suggestion.buildingArea} sqm</span>
                      )}
                      {suggestion.yearBuilt && (
                        <span>Built: {suggestion.yearBuilt}</span>
                      )}
                      {suggestion.council && (
                        <span>Council: {suggestion.council}</span>
                      )}
                    </div>
                  </div>
                  <Database className="h-4 w-4 text-success" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && suggestions.length === 0 && searchTerm.length >= 3 && !isLoading && (
        <Card className="absolute z-50 w-full mt-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">No addresses found for "{searchTerm}"</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};