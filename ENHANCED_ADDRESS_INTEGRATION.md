# Enhanced Address Finder with Weather Integration

## Overview

The Enhanced Address Finder combines CoreLogic address matching with Google Maps geocoding and optional weather data integration. This provides a seamless experience where users get accurate property data from CoreLogic and coordinates for weather analysis, even when CoreLogic doesn't provide coordinates.

## 🌟 Key Features

### **Dual API Integration**
- **CoreLogic API**: Primary address matching and property data
- **Google Maps API**: Fallback geocoding for coordinates
- **Weather API**: Agricultural weather data when coordinates are available

### **Smart Fallback System**
- Uses CoreLogic coordinates when available
- Automatically falls back to Google Maps geocoding
- Tracks coordinate source for transparency
- Maintains all CoreLogic functionality

### **Weather Integration**
- Optional weather data for agricultural applications
- Real-time weather conditions and forecasts
- Agricultural insights and recommendations
- Crop-specific weather analysis

## 🚀 Usage Examples

### Basic Address Search (CoreLogic + Google Maps)

```tsx
import { EnhancedAddressFinder } from '@/components/EnhancedAddressFinder';

<EnhancedAddressFinder
  onAddressSelect={(data) => {
    console.log('CoreLogic Data:', data.corelogic);
    console.log('Coordinates:', data.coordinates);
    console.log('Coordinate Source:', data.coordinates?.source);
  }}
  showPropertyDetails={true}
/>
```

### Agricultural Address Search with Weather

```tsx
<EnhancedAddressFinder
  onAddressSelect={(data) => {
    // Use the enhanced data for agricultural planning
    if (data.weather) {
      console.log('Weather Data:', data.weather);
      console.log('Agricultural Insights:', data.weather.agriculturalInsights);
    }
  }}
  showPropertyDetails={true}
  showWeatherData={true}
  enableWeatherIntegration={true}
  cropType="wheat"
/>
```

### Programmatic Usage

```tsx
import { coreLogicService } from '@/lib/corelogicService';

// Basic search with coordinate fallback
const result = await coreLogicService.searchAddress(
  "123 Collins Street Melbourne VIC 3000",
  "Sustaino Pro",
  true // Enable Google Maps fallback
);

// Search with weather data
const enhancedResult = await coreLogicService.searchAddressWithWeather(
  "123 Collins Street Melbourne VIC 3000",
  "Sustaino Pro",
  {
    includeWeatherData: true,
    cropType: "grapes",
    forecastDays: 7
  }
);
```

## 🔧 Integration Points

### 1. Agricultural Hub Integration

```tsx
// In CropValuationForm.tsx
import { EnhancedAddressFinder } from '@/components/EnhancedAddressFinder';

<CropValuationForm>
  <EnhancedAddressFinder
    onAddressSelect={(data) => {
      // Pre-populate form with address data
      setFormData(prev => ({
        ...prev,
        property_address: data.corelogic.address,
        coordinates: data.coordinates
      }));
      
      // Set weather data for yield calculations
      if (data.weather) {
        setWeatherData(data.weather);
      }
    }}
    showWeatherData={true}
    enableWeatherIntegration={true}
    cropType={formData.crop_type}
  />
  
  {/* Rest of form */}
</CropValuationForm>
```

### 2. Property Valuation Integration

```tsx
// In PropertyAssessmentForm.tsx
<PropertyAssessmentForm>
  <EnhancedAddressFinder
    onAddressSelect={(data) => {
      // Use for climate risk assessment
      if (data.coordinates) {
        // Calculate climate risk with coordinates
        const climateRisk = calculateClimateRisk(
          data.coordinates.lat,
          data.coordinates.lng,
          data.weather
        );
        setFormData(prev => ({
          ...prev,
          climateRisk
        }));
      }
    }}
    showPropertyDetails={true}
    enableWeatherIntegration={true}
  />
</PropertyAssessmentForm>
```

### 3. Crop Harvest Simulation Integration

```tsx
// In CropHarvestSimulation.tsx
<CropHarvestSimulation>
  <EnhancedAddressFinder
    onAddressSelect={(data) => {
      // Use weather data in simulation
      if (data.weather) {
        setSimulationParameters(prev => ({
          ...prev,
          weatherConditions: data.weather.currentConditions,
          weatherForecast: data.weather.forecast,
          location: {
            lat: data.coordinates.lat,
            lng: data.coordinates.lng
          }
        }));
      }
    }}
    showWeatherData={true}
    enableWeatherIntegration={true}
    cropType="wheat"
  />
</CropHarvestSimulation>
```

## 📊 Data Flow

### 1. Address Search Process

```
User Input Address
        ↓
CoreLogic API Search
        ↓
    Success?
    ↓        ↓
   Yes      No
    ↓        ↓
Has Coords?  Return Error
    ↓        ↓
   Yes      No
    ↓        ↓
Return Data  Google Maps Geocoding
    ↓        ↓
            Success?
            ↓      ↓
           Yes    No
            ↓      ↓
        Add Coords  Return Data
            ↓        ↓
        Return Enhanced Data
```

### 2. Weather Integration Process

```
Address with Coordinates
        ↓
Weather API Call
        ↓
Agricultural Weather Data
        ↓
Weather Dashboard Display
```

## 🛠️ Configuration Options

### EnhancedAddressFinder Props

```tsx
interface EnhancedAddressFinderProps {
  onAddressSelect?: (data: {
    corelogic: CoreLogicAddressMatch;
    coordinates?: {
      lat: number;
      lng: number;
      source: 'corelogic' | 'google_maps';
    };
    weather?: any;
  }) => void;
  showPropertyDetails?: boolean;        // Show CoreLogic property details
  showWeatherData?: boolean;           // Show weather dashboard by default
  enableWeatherIntegration?: boolean;  // Enable weather data fetching
  cropType?: string;                   // Crop type for weather analysis
  className?: string;                  // Additional CSS classes
}
```

### CoreLogic Service Options

```tsx
// Basic search with coordinate fallback
await coreLogicService.searchAddress(
  address: string,
  clientName?: string,
  enableCoordinatesFallback: boolean = true
);

// Search with weather integration
await coreLogicService.searchAddressWithWeather(
  address: string,
  clientName?: string,
  weatherOptions?: {
    includeWeatherData?: boolean;
    cropType?: string;
    forecastDays?: number;
  }
);
```

## 🔒 Error Handling

### Graceful Degradation

1. **CoreLogic Fails**: Returns error, no fallback
2. **CoreLogic Succeeds, No Coords**: Google Maps geocoding attempted
3. **Google Maps Fails**: Returns CoreLogic data without coordinates
4. **Weather API Fails**: Returns address data without weather
5. **All APIs Fail**: Returns appropriate error messages

### Error States

```tsx
// No address found
<Alert>
  <AlertTriangle className="h-4 w-4" />
  <AlertDescription>
    No matching address found. Please try a different address.
  </AlertDescription>
</Alert>

// No coordinates available
<Alert>
  <AlertTriangle className="h-4 w-4" />
  <AlertDescription>
    No coordinates available for this address. Weather data cannot be displayed.
  </AlertDescription>
</Alert>

// Weather data unavailable
<Alert>
  <Info className="h-4 w-4" />
  <AlertDescription>
    Weather data is not available for this location.
  </AlertDescription>
</Alert>
```

## 📈 Performance Considerations

### Caching Strategy

- **CoreLogic Results**: Cached by backend service
- **Google Maps Geocoding**: Cached for 10 minutes
- **Weather Data**: Cached for 5 minutes
- **Coordinate Source**: Tracked to avoid duplicate API calls

### Rate Limiting

- **CoreLogic**: 100 requests/minute
- **Google Maps**: 1000 requests/day (free tier)
- **Weather API**: 60 requests/minute
- **Smart Fallback**: Only calls Google Maps when needed

## 🧪 Testing

### Unit Tests

```tsx
// Test CoreLogic with coordinate fallback
test('should fallback to Google Maps when CoreLogic has no coordinates', async () => {
  const mockCoreLogicResponse = {
    success: true,
    data: { /* CoreLogic data without coordinates */ }
  };
  
  const result = await coreLogicService.searchAddress('test address');
  expect(result.data.coordinates.source).toBe('google_maps');
});

// Test weather integration
test('should include weather data when requested', async () => {
  const result = await coreLogicService.searchAddressWithWeather(
    'test address',
    'client',
    { includeWeatherData: true, cropType: 'wheat' }
  );
  
  expect(result.weather).toBeDefined();
  expect(result.weather.agriculturalInsights).toBeDefined();
});
```

### Integration Tests

```tsx
// Test full component integration
test('should display weather dashboard when coordinates available', async () => {
  render(
    <EnhancedAddressFinder
      showWeatherData={true}
      enableWeatherIntegration={true}
      cropType="wheat"
    />
  );
  
  // Search for address
  await userEvent.type(screen.getByPlaceholderText('Enter property address...'), 'test address');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));
  
  // Wait for weather dashboard
  await waitFor(() => {
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
  });
});
```

## 🚀 Future Enhancements

### Planned Features

1. **Batch Address Processing**: Process multiple addresses at once
2. **Historical Weather Data**: Include historical weather patterns
3. **Weather Alerts**: Real-time weather warnings
4. **Advanced Caching**: Redis-based caching for better performance
5. **Offline Support**: Cache results for offline usage

### Integration Opportunities

1. **Machine Learning**: Weather-based yield predictions
2. **IoT Integration**: Real-time weather station data
3. **Satellite Data**: Enhanced weather imagery
4. **Climate Models**: Future climate projections

## 📞 Support

For technical support or questions about the enhanced address integration:

- **Documentation**: This guide and inline code comments
- **API Reference**: CoreLogic and Google Maps API documentation
- **Issues**: Create GitHub issues for bugs or feature requests
- **Email**: Contact the development team

---

**Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.**
**Patent Protected: AU2025000001-AU2025000017**
