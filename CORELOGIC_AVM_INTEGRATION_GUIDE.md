# CoreLogic AVM Integration Guide

## Overview

This guide provides comprehensive documentation for the CoreLogic AVM (Automated Valuation Model) integration implemented in the Delorenzo Property Group valuation platform. The integration provides real-time property valuations using CoreLogic's IntelliVal® AVM service.

## 🚀 Features Implemented

### Backend Services
- **Complete AVM API Integration**: All CoreLogic AVM endpoints implemented
- **Origination AVM**: Professional-grade valuations for lending institutions
- **Consumer AVM**: Consumer-friendly valuations with confidence bands
- **Live AVM**: Real-time valuations with property modifications
- **Historical AVM**: Historical valuation trends and analysis
- **AVM Reporting**: PDF report generation
- **Caching & Rate Limiting**: Optimized performance and API usage

### Frontend Components
- **AVMDisplay**: Comprehensive AVM data visualization
- **AVMComparison**: Side-by-side comparison with custom valuations
- **EnhancedAddressFinder**: Address search with integrated AVM lookup
- **EnhancedSpecializedAVMSection**: Portfolio-level AVM analysis

## 📁 File Structure

```
server/
├── services/
│   └── corelogicService.js          # Extended with AVM methods
├── routes/
│   └── avmRoutes.js                 # AVM API endpoints
└── app.js                          # Updated with AVM routes

src/
├── lib/
│   └── avmService.ts               # Frontend AVM service
└── components/
    ├── AVMDisplay.tsx              # Main AVM display component
    ├── AVMComparison.tsx           # AVM comparison component
    ├── EnhancedAddressFinder.tsx   # Address finder with AVM
    └── EnhancedSpecializedAVMSection.tsx # Portfolio AVM analysis
```

## 🔧 API Endpoints

### Current AVM Endpoints
- `GET /api/avm/origination/current/:propertyId` - Current origination AVM
- `GET /api/avm/consumer/band/current/:propertyId` - Current consumer band AVM

### Historical AVM Endpoints
- `GET /api/avm/consumer/history/:propertyId` - Consumer AVM history
- `GET /api/avm/origination/history/:propertyId` - Origination AVM history
- `GET /api/avm/date/:propertyId/:valuationDate` - AVM for specific date

### Live AVM Endpoints
- `POST /api/avm/live/origination/:propertyId` - Live origination AVM
- `POST /api/avm/live/consumer/:propertyId` - Live consumer AVM
- `POST /api/avm/live/consumer/band/:propertyId` - Live consumer band AVM

### Report Endpoints
- `GET /api/avm/report/consumer/:propertyId` - Consumer AVM report
- `GET /api/avm/report/origination/:propertyId` - Origination AVM report

### Utility Endpoints
- `GET /api/avm/stats` - Service statistics
- `POST /api/avm/clear-cache` - Clear cache

## 💻 Usage Examples

### 1. Basic AVM Display

```tsx
import { AVMDisplay } from '@/components/AVMDisplay';

function PropertyValuation() {
  return (
    <AVMDisplay
      propertyId="12345"
      propertyAddress="123 Main Street, Sydney NSW 2000"
      customValuation={850000}
      showComparison={true}
      showHistory={true}
      showLiveAVM={true}
    />
  );
}
```

### 2. AVM Comparison in Forms

```tsx
import { AVMComparison } from '@/components/AVMComparison';

function ValuationForm() {
  const [customValuation, setCustomValuation] = useState(0);
  
  return (
    <div>
      <input 
        value={customValuation}
        onChange={(e) => setCustomValuation(Number(e.target.value))}
      />
      <AVMComparison
        propertyId="12345"
        customValuation={customValuation}
        compact={true}
      />
    </div>
  );
}
```

### 3. Enhanced Address Finder

```tsx
import { EnhancedAddressFinder } from '@/components/EnhancedAddressFinder';

function PropertySearch() {
  const handleAddressSelect = (propertyData) => {
    console.log('Selected property:', propertyData);
    console.log('AVM data:', propertyData.avmData);
  };

  return (
    <EnhancedAddressFinder
      onAddressSelect={handleAddressSelect}
      showAVM={true}
      customValuation={750000}
    />
  );
}
```

### 4. Direct AVM Service Usage

```tsx
import { avmService } from '@/lib/avmService';

async function getPropertyValuation(propertyId) {
  try {
    // Get current origination AVM
    const origination = await avmService.getCurrentOriginationAVM(propertyId);
    
    // Get consumer band AVM
    const consumerBand = await avmService.getCurrentConsumerBandAVM(propertyId);
    
    // Get comprehensive data
    const comprehensive = await avmService.getComprehensiveAVMData(propertyId);
    
    return { origination, consumerBand, comprehensive };
  } catch (error) {
    console.error('AVM Error:', error);
  }
}
```

## 🔄 Integration Points

### 1. Address Validation Flow
```
User enters address → AddressFinder → CoreLogic Address Matcher → 
Property ID obtained → AVM lookup → Display results
```

### 2. Valuation Form Integration
```
Form input → Custom valuation → AVM lookup → Comparison display → 
Validation recommendations
```

### 3. Portfolio Analysis
```
Multiple properties → Batch AVM lookup → Aggregated analysis → 
Portfolio insights and reporting
```

## 📊 Data Types

### AVMOriginationData
```typescript
interface AVMOriginationData {
  estimate: number;
  lowEstimate: number;
  highEstimate: number;
  fsd: number;
  confidence: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
  isCurrent: boolean;
}
```

### AVMConsumerBandData
```typescript
interface AVMConsumerBandData {
  lowerBand: number;
  upperBand: number;
  confidence: 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW';
  valuationDate: string;
}
```

### PropertyModificationData
```typescript
interface PropertyModificationData {
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  floorAreaM2?: number;
  landAreaM2?: number;
  salePrice?: number;
  yearBuilt?: number;
  propertyType?: string;
  saleDate?: string;
  valuationDate?: string;
  craftsmanshipQuality?: 'AVERAGE' | 'ABOVE_AVERAGE' | 'BELOW_AVERAGE' | 'EXCELLENT' | 'POOR';
}
```

## 🎯 Key Features

### 1. Real-time Validation
- Compare custom valuations with CoreLogic AVM estimates
- Confidence scoring and validation recommendations
- Market alignment analysis

### 2. Historical Analysis
- Track property value changes over time
- Market trend analysis
- Investment decision support

### 3. Live AVM Testing
- Test property modifications in real-time
- What-if scenario analysis
- Property improvement impact assessment

### 4. Portfolio Management
- Multi-property AVM analysis
- Aggregated portfolio insights
- Comparative analysis across property types

## 🔧 Configuration

### Environment Variables
```env
CORELOGIC_CLIENT_KEY=your_client_key
CORELOGIC_CLIENT_SECRET=your_client_secret
```

### API Configuration
- Base URL: `https://api-sbox.corelogic.asia` (sandbox)
- Rate Limiting: 100 requests per minute
- Caching: 10-30 minutes depending on endpoint
- Retry Logic: 3 attempts with exponential backoff

## 🚨 Error Handling

### Common Error Scenarios
1. **Property Not Found**: 404 - No AVM available for property
2. **Rate Limiting**: 429 - Too many requests
3. **Authentication**: 401/403 - Invalid credentials
4. **Invalid Parameters**: 400 - Bad request data

### Error Response Format
```typescript
interface AVMApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  statusCode?: number;
  type?: string;
  timestamp?: string;
}
```

## 📈 Performance Optimizations

### Caching Strategy
- **Address Matches**: 5 minutes
- **Current AVM**: 10 minutes
- **Historical AVM**: 15 minutes
- **Date-specific AVM**: 30 minutes

### Rate Limiting
- **Per-minute limit**: 100 requests
- **Automatic retry**: With exponential backoff
- **Request queuing**: For high-volume scenarios

## 🔍 Testing

### Test Scenarios
1. **Valid Property ID**: Should return AVM data
2. **Invalid Property ID**: Should return 404 error
3. **Rate Limiting**: Should handle gracefully
4. **Network Errors**: Should retry and fail gracefully

### Test Data
- Use CoreLogic sandbox environment
- Test with known property IDs
- Validate error handling with invalid IDs

## 🚀 Deployment

### Backend Deployment
1. Ensure environment variables are set
2. Deploy updated server files
3. Test API endpoints
4. Monitor rate limiting and caching

### Frontend Deployment
1. Build with new AVM components
2. Deploy updated frontend
3. Test component integration
4. Verify API connectivity

## 📚 Additional Resources

### CoreLogic Documentation
- [CoreLogic AVM API Documentation](https://developer.corelogic.asia)
- [IntelliVal® AVM Overview](https://developer.corelogic.asia/avm)

### Internal Documentation
- [Address Matcher Integration](./CORELOGIC_INTEGRATION.md)
- [Google Maps Integration](./GOOGLE_MAPS_INTEGRATION.md)
- [Valuation Integration Guide](./VALUATION_INTEGRATION_GUIDE.md)

## 🤝 Support

For technical support or questions about the AVM integration:
- **Backend Issues**: Check server logs and API responses
- **Frontend Issues**: Check browser console and network tab
- **Data Issues**: Verify property IDs and CoreLogic service status

## 📝 Changelog

### Version 1.0.0
- Initial AVM integration
- All CoreLogic AVM endpoints implemented
- Frontend components created
- Comprehensive documentation

---

**Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.**
**Licensed under MIT License - see LICENSE file for details**
**Patent Protected: AU2025000001-AU2025000017**
