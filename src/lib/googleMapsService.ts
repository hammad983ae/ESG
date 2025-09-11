/**
 * Google Maps API Service
 * Provides address autocomplete and geocoding functionality
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

// Google Maps API Key - in production, this should be in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyBNK_lTxRuQ3chhIMr1KrFtbsu2QVrKb80';

// OpenAI API Key for AI-powered property data enhancement
const OPENAI_API_KEY = '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';

export interface GoogleMapsPlace {
  place_id: string;
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types: string[];
}

export interface PropertyData {
  address: string;
  landArea?: number;
  buildingArea?: number;
  yearBuilt?: number;
  propertyType?: string;
  zoning?: string;
  council?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  aiInsights?: {
    estimatedMarketValue?: number;
    propertyCondition?: string;
    investmentGrade?: string;
    marketTrend?: string;
    nearbyAmenities?: string[];
    transportAccess?: string;
    schoolZones?: string[];
    developmentPotential?: string;
    riskFactors?: string[];
    recommendations?: string[];
  };
}

/**
 * Search for addresses using Google Places API
 */
export const searchAddresses = async (query: string): Promise<PropertyData[]> => {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&types=address&components=country:au`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    if (!data.predictions || data.predictions.length === 0) {
      return [];
    }

    // Get detailed information for each prediction
    const detailedPlaces = await Promise.all(
      data.predictions.slice(0, 5).map(async (prediction: any) => {
        try {
          const details = await getPlaceDetails(prediction.place_id);
          return details;
        } catch (error) {
          console.error('Error getting place details:', error);
          return null;
        }
      })
    );

    // Filter out null results and convert to PropertyData format
    return detailedPlaces
      .filter((place): place is GoogleMapsPlace => place !== null)
      .map(convertToPropertyData);
  } catch (error) {
    console.error('Error searching addresses:', error);
    throw new Error('Failed to search addresses. Please try again.');
  }
};

/**
 * Get detailed information about a place using its place_id
 */
export const getPlaceDetails = async (placeId: string): Promise<GoogleMapsPlace> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,formatted_address,name,geometry,address_components,types&key=${GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.result;
};

/**
 * Convert Google Maps place data to PropertyData format
 */
const convertToPropertyData = (place: GoogleMapsPlace): PropertyData => {
  const addressComponents = place.address_components;
  
  // Extract relevant information from address components
  const getComponent = (types: string[]) => {
    const component = addressComponents.find(comp => 
      types.some(type => comp.types.includes(type))
    );
    return component?.long_name || '';
  };

  const suburb = getComponent(['locality', 'sublocality', 'sublocality_level_1']);
  const state = getComponent(['administrative_area_level_1']);
  const postcode = getComponent(['postal_code']);
  const country = getComponent(['country']);

  // Determine property type based on place types
  const getPropertyType = (types: string[]): string => {
    if (types.includes('premise')) return 'Residential';
    if (types.includes('subpremise')) return 'Residential Unit';
    if (types.includes('establishment')) return 'Commercial';
    if (types.includes('point_of_interest')) return 'Commercial';
    return 'Property';
  };

  // Determine zoning based on location and types
  const getZoning = (types: string[], suburb: string): string => {
    if (types.includes('establishment') || types.includes('point_of_interest')) {
      return 'Commercial';
    }
    // Add more sophisticated zoning logic based on suburb/area
    return 'Residential';
  };

  // Determine council based on suburb/state
  const getCouncil = (suburb: string, state: string): string => {
    // This would ideally be mapped to actual council data
    if (state === 'VIC') return `City of ${suburb || 'Melbourne'}`;
    if (state === 'NSW') return `City of ${suburb || 'Sydney'}`;
    if (state === 'QLD') return `${suburb || 'Brisbane'} City Council`;
    return `${suburb || 'Local'} Council`;
  };

  return {
    address: place.formatted_address,
    landArea: Math.floor(Math.random() * 1000) + 200, // Mock data - would come from property database
    buildingArea: Math.floor(Math.random() * 500) + 100, // Mock data - would come from property database
    yearBuilt: Math.floor(Math.random() * 50) + 1970, // Mock data - would come from property database
    propertyType: getPropertyType(place.types),
    zoning: getZoning(place.types, suburb),
    council: getCouncil(suburb, state),
    coordinates: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    },
    placeId: place.place_id
  };
};

/**
 * Geocode an address to get coordinates
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to get address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    return data.results[0].formatted_address;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

/**
 * AI-powered property data enhancement using OpenAI
 * Enhances property data with additional insights and analysis
 */
export const enhancePropertyDataWithAI = async (propertyData: PropertyData): Promise<PropertyData> => {
  try {
    const prompt = `Analyze this Australian property data and provide enhanced insights:

Property Address: ${propertyData.address}
Property Type: ${propertyData.propertyType || 'Unknown'}
Zoning: ${propertyData.zoning || 'Unknown'}
Council: ${propertyData.council || 'Unknown'}
Land Area: ${propertyData.landArea || 'Unknown'} sqm
Building Area: ${propertyData.buildingArea || 'Unknown'} sqm
Year Built: ${propertyData.yearBuilt || 'Unknown'}

Please provide enhanced property data in JSON format with these fields:
{
  "estimatedMarketValue": number (estimated property value in AUD),
  "propertyCondition": string (excellent/good/fair/poor),
  "investmentGrade": string (A/B/C/D),
  "marketTrend": string (rising/stable/declining),
  "nearbyAmenities": string[] (list of nearby amenities),
  "transportAccess": string (excellent/good/fair/poor),
  "schoolZones": string[] (nearby school zones),
  "developmentPotential": string (high/medium/low),
  "riskFactors": string[] (list of potential risk factors),
  "recommendations": string[] (investment or improvement recommendations)
}

Base your analysis on Australian property market conditions and provide realistic estimates.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Australian property analyst with deep knowledge of local markets, zoning laws, and property valuation. Provide accurate, professional analysis suitable for real estate investment decisions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiAnalysis = data.choices[0]?.message?.content;

    if (!aiAnalysis) {
      throw new Error('No AI analysis generated');
    }

    // Parse the AI response
    let enhancedData;
    try {
      enhancedData = JSON.parse(aiAnalysis);
    } catch (e) {
      console.error('Failed to parse AI response:', aiAnalysis);
      return propertyData; // Return original data if parsing fails
    }

    // Merge AI insights with original property data
    return {
      ...propertyData,
      aiInsights: enhancedData
    };

  } catch (error) {
    console.error('Error enhancing property data with AI:', error);
    return propertyData; // Return original data if AI enhancement fails
  }
};
