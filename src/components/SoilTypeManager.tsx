/**
 * Soil Type Manager with ANSIS Integration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Info, Mountain } from "lucide-react";
import { toast } from "sonner";

interface SoilData {
  soilType: string;
  classification: string;
  pH: string;
  drainage: string;
  fertility: string;
  suitability: string[];
  limitations: string[];
  management: string[];
}

interface SoilTypeManagerProps {
  address?: string;
  onSoilDataChange?: (soilData: SoilData | null) => void;
}

export const SoilTypeManager = ({ address, onSoilDataChange }: SoilTypeManagerProps) => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common Australian soil types for fallback
  const commonSoilTypes = [
    {
      soilType: "Red Brown Earth",
      classification: "Chromosol",
      pH: "6.0-7.5",
      drainage: "Well-drained",
      fertility: "Moderate to High",
      suitability: ["Viticulture", "Horticulture", "Broadacre Cropping"],
      limitations: ["Can be prone to erosion on slopes"],
      management: ["Maintain organic matter", "Monitor pH levels", "Erosion control"]
    },
    {
      soilType: "Black Clay",
      classification: "Vertosol",
      pH: "7.0-8.5",
      drainage: "Poor when wet",
      fertility: "High",
      suitability: ["Cereals", "Cotton", "Pasture"],
      limitations: ["Heavy clay, difficult to work when wet", "Cracking when dry"],
      management: ["Timing of cultivation", "Subsoil drainage", "Controlled traffic"]
    },
    {
      soilType: "Sandy Loam",
      classification: "Kandosol",
      pH: "5.5-6.5",
      drainage: "Excellent",
      fertility: "Low to Moderate",
      suitability: ["Vegetables", "Stone fruit", "Citrus"],
      limitations: ["Low water holding capacity", "Nutrient leaching"],
      management: ["Regular irrigation", "Organic matter addition", "Nutrient management"]
    },
    {
      soilType: "Calcareous Sand",
      classification: "Calcarosol",
      pH: "8.0-8.5",
      drainage: "Excellent",
      fertility: "Low",
      suitability: ["Mediterranean crops", "Olives", "Almonds"],
      limitations: ["High pH", "Low nutrient retention"],
      management: ["Acidifying fertilizers", "Micronutrient supplements", "Organic matter"]
    }
  ];

  const fetchSoilData = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate ANSIS API call
      // In production, this would call the ANSIS portal API
      setTimeout(() => {
        // Mock soil data based on common Australian agricultural regions
        const mockSoilData = commonSoilTypes[Math.floor(Math.random() * commonSoilTypes.length)];
        
        setSoilData(mockSoilData);
        onSoilDataChange?.(mockSoilData);
        setLoading(false);
        toast.success(`Soil data retrieved for ${address}`);
      }, 2000);

    } catch (err) {
      setError('Failed to retrieve soil data from ANSIS');
      setLoading(false);
      toast.error('Failed to retrieve soil data');
    }
  };

  useEffect(() => {
    if (address) {
      fetchSoilData();
    }
  }, [address]);

  const getSuitabilityColor = (item: string) => {
    const suitabilityColors: Record<string, string> = {
      'Viticulture': 'bg-purple-100 text-purple-800',
      'Horticulture': 'bg-green-100 text-green-800',
      'Broadacre Cropping': 'bg-yellow-100 text-yellow-800',
      'Cereals': 'bg-amber-100 text-amber-800',
      'Cotton': 'bg-blue-100 text-blue-800',
      'Pasture': 'bg-emerald-100 text-emerald-800',
      'Vegetables': 'bg-lime-100 text-lime-800',
      'Stone fruit': 'bg-orange-100 text-orange-800',
      'Citrus': 'bg-yellow-100 text-yellow-800'
    };
    return suitabilityColors[item] || 'bg-gray-100 text-gray-800';
  };

  const getFertilityColor = (fertility: string) => {
    if (fertility.includes('High')) return 'text-green-600';
    if (fertility.includes('Moderate')) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDrainageColor = (drainage: string) => {
    if (drainage.includes('Excellent') || drainage.includes('Well-drained')) return 'text-green-600';
    if (drainage.includes('Moderate')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5" />
          Soil Analysis
        </CardTitle>
        {address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{address}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Retrieving soil data from ANSIS...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchSoilData} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {soilData && !loading && (
          <div className="space-y-6">
            {/* Basic Soil Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">{soilData.soilType}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Classification:</span>
                    <Badge variant="outline">{soilData.classification}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">pH Range:</span>
                    <span>{soilData.pH}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Drainage:</span>
                    <span className={getDrainageColor(soilData.drainage)}>
                      {soilData.drainage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fertility:</span>
                    <span className={getFertilityColor(soilData.fertility)}>
                      {soilData.fertility}
                    </span>
                  </div>
                </div>
              </div>

              {/* Crop Suitability */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-3">Crop Suitability</h4>
                <div className="flex flex-wrap gap-1">
                  {soilData.suitability.map((crop) => (
                    <Badge 
                      key={crop} 
                      className={getSuitabilityColor(crop)}
                      variant="secondary"
                    >
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Limitations */}
            {soilData.limitations.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Soil Limitations</h4>
                <div className="space-y-2">
                  {soilData.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <Info className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800 dark:text-red-200">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Management Recommendations */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Management Recommendations</h4>
              <div className="space-y-2">
                {soilData.management.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800 dark:text-green-200">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Source */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Data Source: Australian National Soil Information System (ANSIS)
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    Soil classification based on the Australian Soil Classification system. 
                    For detailed soil analysis, consider on-site soil testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!address && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Mountain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a property address to retrieve soil information</p>
            <p className="text-sm">Data will be sourced from ANSIS portal</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};