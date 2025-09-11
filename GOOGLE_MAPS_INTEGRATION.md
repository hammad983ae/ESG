# Google Maps API Integration

## Overview
The ESG Property Assessment Platform now integrates with Google Maps API to provide real address lookup functionality, replacing the previous dummy data implementation.

## API Key Configuration
The Google Maps API key has been configured as:
```
AIzaSyBNK_lTxRuQ3chhIMr1KrFtbsu2QVrKb80
```

## Features Implemented

### 1. Address Autocomplete
- **Service**: `src/lib/googleMapsService.ts`
- **Function**: `searchAddresses(query: string)`
- **API Used**: Google Places API Autocomplete
- **Features**:
  - Real-time address suggestions as user types
  - Australian address filtering (`components=country:au`)
  - Detailed place information retrieval
  - Property data extraction and formatting

### 2. Geocoding
- **Function**: `geocodeAddress(address: string)`
- **API Used**: Google Geocoding API
- **Features**:
  - Convert addresses to coordinates (lat/lng)
  - Error handling for invalid addresses
  - Returns null for addresses that cannot be found

### 3. Reverse Geocoding
- **Function**: `reverseGeocode(lat: number, lng: number)`
- **API Used**: Google Geocoding API
- **Features**:
  - Convert coordinates to formatted addresses
  - Useful for map-based property selection

## Components Updated

### 1. AddressFinder Component
- **File**: `src/components/AddressFinder.tsx`
- **Changes**:
  - Replaced mock data with real Google Maps API calls
  - Updated UI to show Google Maps integration
  - Improved error handling and loading states
  - Updated placeholder text and badges

### 2. SpecializedAVMSection
- **File**: `src/components/SpecializedAVMSection.tsx`
- **Changes**:
  - Updated badges to reflect Google Maps integration
  - Updated placeholder text for address search

### 3. GoogleMapsTest Component
- **File**: `src/components/GoogleMapsTest.tsx`
- **Purpose**: Test component to verify API integration
- **Features**:
  - Test address search functionality
  - Test geocoding functionality
  - Visual feedback for API status
  - Results display for debugging

## API Endpoints Used

### 1. Places Autocomplete
```
https://maps.googleapis.com/maps/api/place/autocomplete/json
```
- **Parameters**: `input`, `key`, `types=address`, `components=country:au`
- **Purpose**: Get address suggestions as user types

### 2. Place Details
```
https://maps.googleapis.com/maps/api/place/details/json
```
- **Parameters**: `place_id`, `fields`, `key`
- **Purpose**: Get detailed information about selected place

### 3. Geocoding
```
https://maps.googleapis.com/maps/api/geocode/json
```
- **Parameters**: `address`, `key`
- **Purpose**: Convert address to coordinates

## Data Structure

### PropertyData Interface
```typescript
interface PropertyData {
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
}
```

## Usage Examples

### Basic Address Search
```typescript
import { searchAddresses } from '@/lib/googleMapsService';

const results = await searchAddresses("123 Collins Street, Melbourne");
console.log(results); // Array of PropertyData objects
```

### Geocoding
```typescript
import { geocodeAddress } from '@/lib/googleMapsService';

const coords = await geocodeAddress("123 Collins Street, Melbourne VIC 3000");
console.log(coords); // { lat: -37.8136, lng: 144.9631 }
```

## Testing

### Test Component
The `GoogleMapsTest` component is available in the Property Hub page to test the integration:
1. Navigate to Property Hub
2. Scroll to the "Google Maps API Integration Test" section
3. Enter a test address
4. Click "Test Address Search" or "Test Geocoding"
5. Verify results are returned correctly

### Test Addresses
Try these Australian addresses for testing:
- "123 Collins Street, Melbourne VIC 3000"
- "456 George Street, Sydney NSW 2000"
- "789 Queen Street, Brisbane QLD 4000"

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- API quota exceeded
- Invalid API key
- No results found
- Invalid addresses

All errors are logged to console and displayed to users via toast notifications.

## Performance Considerations

- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Result Limiting**: Maximum 5 results per search
- **Caching**: Consider implementing result caching for frequently searched addresses
- **Rate Limiting**: Google Maps API has usage quotas and rate limits

## Security Notes

- API key is currently hardcoded (should be moved to environment variables in production)
- CORS is handled by Google's API endpoints
- No sensitive data is sent to Google (only address queries)

## Future Enhancements

1. **Environment Variables**: Move API key to environment configuration
2. **Result Caching**: Cache frequently searched addresses
3. **Map Integration**: Add visual map component for address selection
4. **Property Data Enhancement**: Integrate with property databases for more detailed information
5. **Batch Processing**: Support for multiple address lookups
6. **Offline Support**: Cache results for offline usage

## Troubleshooting

### Common Issues

1. **"API key not valid"**: Check API key configuration
2. **"No results found"**: Verify address format and Australian addresses
3. **CORS errors**: Ensure proper API key permissions
4. **Rate limiting**: Check Google Cloud Console for quota usage

### Debug Steps

1. Check browser console for error messages
2. Verify API key is correctly configured
3. Test with the GoogleMapsTest component
4. Check network tab for API request/response details

