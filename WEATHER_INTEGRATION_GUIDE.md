# Weather Forecast API Integration Guide

## Overview

This guide provides comprehensive documentation for integrating Meteoblue Weather Image API into the Delorenzo Property Group ESG Property Assessment Platform. The integration provides weather visualizations and agricultural insights for property valuation and agricultural planning.

## 🌤️ Features Implemented

### Backend Services
- **Complete Weather API Integration**: All Meteoblue Image API endpoints implemented
- **Agricultural Weather Charts**: Specialized charts for agricultural applications
- **Meteogram Visualizations**: Standard and solar meteograms for weather analysis
- **Atmospheric Sounding**: Advanced weather analysis for property risk assessment
- **Caching & Rate Limiting**: Optimized performance and API usage
- **Comprehensive Error Handling**: Robust error management and retry logic

### Frontend Components
- **WeatherDashboard**: Comprehensive weather data visualization
- **WeatherService**: TypeScript service for weather API integration
- **Agricultural Weather Insights**: Weather-based agricultural recommendations
- **Real-time Weather Data**: Current conditions and forecasts

## 📁 File Structure

```
server/
├── services/
│   └── weatherService.js          # Backend weather service
├── routes/
│   └── weatherRoutes.js           # Weather API endpoints
└── middleware/
    └── validation.js              # Updated with weather validation

src/
├── lib/
│   └── weatherService.ts          # Frontend weather service
└── components/
    └── WeatherDashboard.tsx       # Weather dashboard component
```

## 🔧 API Endpoints

### Weather Image Endpoints
- `GET /api/weather/image` - Get weather image URL with custom parameters
- `GET /api/weather/agricultural/:lat/:lon` - Get agricultural weather chart
- `GET /api/weather/meteogram/:lat/:lon` - Get standard meteogram
- `GET /api/weather/weekly/:lat/:lon` - Get weekly forecast pictogram
- `GET /api/weather/solar/:lat/:lon` - Get solar meteogram for agricultural planning
- `GET /api/weather/sounding/:lat/:lon` - Get atmospheric sounding

### Weather Data Endpoints
- `GET /api/weather/agricultural-data/:lat/:lon` - Get comprehensive agricultural weather data
- `GET /api/weather/stats` - Get weather service statistics
- `POST /api/weather/clear-cache` - Clear weather cache
- `GET /api/weather/health` - Weather service health check

## 🚀 Quick Start

### 1. Environment Configuration

Add the Meteoblue API key to your environment variables:

**Frontend (.env.local):**
```bash
VITE_METEOBLUE_API_KEY=your-meteoblue-api-key
```

**Backend (.env):**
```bash
METEOBLUE_API_KEY=your-meteoblue-api-key
```

### 2. Get Meteoblue API Key

1. Visit [Meteoblue API](https://www.meteoblue.com/en/weather/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your environment variables

### 3. Basic Usage

```typescript
import { weatherService } from '@/lib/weatherService';

// Get agricultural weather chart
const weatherData = await weatherService.getAgriculturalWeatherChart({
  lat: -37.8136,
  lon: 144.9631,
  city: 'Melbourne'
});

// Get meteogram
const meteogram = await weatherService.getMeteogram({
  lat: -37.8136,
  lon: 144.9631,
  forecastDays: 7
});
```

### 4. Using the Weather Dashboard Component

```tsx
import { WeatherDashboard } from '@/components/WeatherDashboard';

<WeatherDashboard
  location={{
    lat: -37.8136,
    lon: 144.9631,
    city: 'Melbourne'
  }}
  cropType="wheat"
  showAgriculturalInsights={true}
/>
```

## 🌾 Agricultural Integration Points

### 1. Agricultural Hub Enhancement

The weather integration enhances several agricultural modules:

- **Crop Valuation Forms**: Add weather widgets to show current conditions
- **Yield Calculations**: Include weather-adjusted yield predictions
- **Irrigation Planning**: Weather-based irrigation recommendations
- **Risk Assessment**: Weather-related crop and property risks

### 2. Climate Risk Assessment

Weather data enhances the existing climate risk scoring:

- **Real-time Risk Updates**: Current weather conditions affect risk scores
- **Seasonal Patterns**: Historical weather trends for property analysis
- **Extreme Weather Alerts**: Weather warnings for property protection

### 3. Property Valuation Integration

Weather factors can influence property valuations:

- **Agricultural Properties**: Weather patterns affect land value
- **Climate Risk**: Weather data enhances climate risk assessment
- **Seasonal Adjustments**: Weather patterns for investment timing

## 📊 Weather Image Types

### Available Image Types

1. **meteogram** - Standard weather chart with temperature, precipitation, wind
2. **meteogram_verify** - Verification meteogram with historical data
3. **meteogram_solar** - Solar meteogram for agricultural planning
4. **meteogram_solar_season** - Seasonal solar analysis
5. **agronomy** - Specialized agricultural weather chart
6. **aviation** - Aviation weather chart
7. **picto_1d/3d/7d/14d** - Pictogram forecasts
8. **sounding** - Atmospheric sounding for advanced analysis
9. **cross_section** - Cross-section weather view

### Customization Options

- **Units**: Celsius/Fahrenheit, mm/inches, m/s/mph/knots
- **Languages**: 20+ supported languages
- **Forecast Days**: 1-14 days
- **History Days**: 0-7 days
- **Resolution**: 50-300 DPI
- **Logo**: Optional Meteoblue logo removal

## 🔧 Advanced Configuration

### Weather Service Configuration

```typescript
// Custom weather image configuration
const config: WeatherImageConfig = {
  location: {
    lat: -37.8136,
    lon: 144.9631,
    asl: 31, // altitude above sea level
    city: 'Melbourne',
    tz: 'Australia/Melbourne'
  },
  imageType: 'agronomy',
  forecastDays: 7,
  historyDays: 1,
  look: 'CELSIUS_MILLIMETER_METER_PER_SECOND',
  lang: 'en',
  dpi: 100,
  noLogo: true
};
```

### Agricultural Insights

The weather service provides agricultural insights including:

- **Growing Degree Days**: Heat accumulation for crop growth
- **Chill Hours**: Cold hours for dormancy requirements
- **Frost Risk**: Current frost risk assessment
- **Drought Risk**: Water stress indicators
- **Irrigation Recommendations**: Weather-based irrigation advice
- **Planting Recommendations**: Optimal planting timing

## 🛠️ Integration Examples

### 1. Agricultural Form Enhancement

```tsx
// Add weather widget to crop valuation form
import { WeatherDashboard } from '@/components/WeatherDashboard';

<CropValuationForm>
  {/* Existing form fields */}
  
  <WeatherDashboard
    location={formData.location}
    cropType={formData.cropType}
    showAgriculturalInsights={true}
  />
</CropValuationForm>
```

### 2. Property Risk Assessment

```typescript
// Enhance climate risk with weather data
const enhancedRiskAssessment = {
  ...existingRiskData,
  weatherFactors: {
    currentConditions: weatherData.currentConditions,
    forecast: weatherData.forecast,
    riskAdjustments: calculateWeatherRiskAdjustments(weatherData)
  }
};
```

### 3. Yield Prediction Enhancement

```typescript
// Include weather in yield calculations
const weatherAdjustedYield = calculateYieldWithWeather(
  baseYield,
  weatherData.agriculturalInsights
);
```

## 📈 Performance Optimization

### Caching Strategy

- **Image URLs**: 10-minute cache for weather images
- **Agricultural Data**: 5-minute cache for weather insights
- **Rate Limiting**: 60 requests per minute (Meteoblue limit)

### Error Handling

- **Retry Logic**: 3 attempts with exponential backoff
- **Fallback Data**: Mock data when API is unavailable
- **Graceful Degradation**: Continue without weather data if needed

## 🔒 Security Considerations

### API Key Management

- Store API keys in environment variables
- Never commit keys to version control
- Use different keys for development/production
- Monitor API usage and costs

### Rate Limiting

- Implement client-side rate limiting
- Cache responses to reduce API calls
- Monitor usage patterns
- Implement backoff strategies

## 📊 Monitoring and Analytics

### Service Health

- Health check endpoint: `/api/weather/health`
- Service statistics: `/api/weather/stats`
- Cache performance metrics
- Error rate monitoring

### Usage Tracking

- API request counts
- Cache hit/miss ratios
- Error rates by endpoint
- Response time monitoring

## 🚀 Future Enhancements

### Planned Features

1. **Historical Weather Analysis**: Long-term weather trend analysis
2. **Weather Alerts**: Real-time weather warnings
3. **Climate Change Projections**: Future climate scenarios
4. **Advanced Agricultural Models**: Crop-specific weather models
5. **Property Weather History**: Historical weather for properties

### Integration Opportunities

1. **Machine Learning**: Weather-based yield predictions
2. **IoT Integration**: Weather station data integration
3. **Satellite Data**: Enhanced weather imagery
4. **Climate Models**: Advanced climate projections

## 🆘 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify key is correctly set in environment variables
   - Check key permissions and limits
   - Ensure key is active and not expired

2. **Images Not Loading**
   - Check CORS settings for image domains
   - Verify image URLs are accessible
   - Check network connectivity

3. **Rate Limit Exceeded**
   - Implement caching to reduce API calls
   - Check for duplicate requests
   - Monitor usage patterns

### Debug Mode

Enable debug logging by setting:
```bash
VITE_DEBUG=true
NODE_ENV=development
```

## 📞 Support

For technical support or questions about the weather integration:

- **Documentation**: This guide and inline code comments
- **API Reference**: Meteoblue API documentation
- **Issues**: Create GitHub issues for bugs or feature requests
- **Email**: Contact the development team

## 📄 License

This weather integration is part of the Delorenzo Property Group ESG Property Assessment Platform and is protected by the same licensing terms.

---

**Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.**
**Patent Protected: AU2025000001-AU2025000019**
