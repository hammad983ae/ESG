# CoreLogic Address Matcher API Integration

## Overview

This document describes the complete integration of the CoreLogic Address Matcher API into the Sustaino Pro property assessment platform. The integration provides professional-grade address matching using CoreLogic's industry-leading AddressRight algorithm.

## Architecture

### Backend Service (Node.js/Express)
- **Location**: `server/services/corelogicService.js`
- **Routes**: `server/routes/corelogicRoutes.js`
- **Features**:
  - Secure API credential management
  - Rate limiting (100 requests/minute)
  - Response caching (5-minute TTL)
  - Retry logic with exponential backoff
  - Comprehensive error handling

### Frontend Service (TypeScript/React)
- **Location**: `src/lib/corelogicService.ts`
- **Component**: `src/components/AddressFinder.tsx`
- **Features**:
  - Real-time address search
  - Visual match quality indicators
  - Auto-population of property details
  - Professional UI with confidence scores

## API Endpoints

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/corelogic/search` | Search for property address |
| `GET` | `/api/corelogic/search` | Search for property address (GET) |
| `GET` | `/api/corelogic/health` | Health check |
| `GET` | `/api/corelogic/stats` | Service statistics |
| `DELETE` | `/api/corelogic/cache` | Clear cache |

### Request/Response Format

#### Search Request
```json
{
  "address": "123 Collins Street Melbourne VIC 3000",
  "clientName": "Sustaino Pro",
  "minConfidence": 0.7
}
```

#### Search Response
```json
{
  "success": true,
  "data": {
    "propertyId": "12345678",
    "address": "123 Collins Street, Melbourne VIC 3000",
    "matchCode": "E000000000000",
    "matchType": "E",
    "matchRule": "000",
    "updateIndicator": "O",
    "updateDetail": "00000000",
    "confidence": 0.95,
    "coordinates": {
      "latitude": -37.8136,
      "longitude": 144.9631
    },
    "suburb": "Melbourne",
    "state": "VIC",
    "postcode": "3000",
    "streetName": "Collins Street",
    "streetNumber": "123",
    "streetType": "Street"
  },
  "matchQuality": "exact"
}
```

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# CoreLogic API Configuration
CORELOGIC_CLIENT_KEY=HYbG0zAfAoItzOAwRCDNxDQ8W4BwOGYt
CORELOGIC_CLIENT_SECRET=SgLJyM0iIr81ZobI
CORELOGIC_BASE_URL=https://api-sbox.corelogic.asia
```

### Dependencies

#### Backend Dependencies
```json
{
  "axios": "^1.11.0",
  "express-validator": "^7.0.1",
  "node-cache": "^5.1.2"
}
```

## Installation & Setup

### 1. Backend Setup

```bash
cd server
npm install
cp env.example .env
# Update .env with your CoreLogic credentials
npm run dev
```

### 2. Frontend Setup

The frontend service is already integrated. No additional setup required.

### 3. Testing

```bash
cd server
node test-corelogic.js
```

## Integration Points

### Agricultural Hub Forms
- ✅ CropValuationForm
- ✅ OrchardValuationForm  
- ✅ VineyardValuationForm
- ✅ PastureValuationForm
- ✅ HorticultureValuationForm

### Property Management
- ✅ PropertyManager
- ✅ SpecializedAVMSection

### Valuation Analysis Forms
- ✅ All forms with address inputs

## Match Quality Levels

| Code | Type | Confidence | Description |
|------|------|------------|-------------|
| E | Exact Match | 95%+ | Perfect match to property |
| A | Alias Match | 90%+ | Alternative address format |
| P | Partial Match | 80%+ | Some address elements matched |
| F | Fuzzy Match | 70%+ | Approximate match |
| B | Building Level | 60%+ | Building identified |
| S | Street Level | 50%+ | Street identified |
| X | Postal Record | 30%+ | PO Box address |
| D | Duplicate | 0% | Duplicate found |
| N | No Match | 0% | No match found |
| M | Missing Elements | 0% | Insufficient data |

## Features

### Security
- API credentials stored securely on backend
- No direct API calls from frontend
- Rate limiting to prevent abuse
- Input validation and sanitization

### Performance
- Response caching (5-minute TTL)
- Retry logic with exponential backoff
- Request deduplication
- Optimized address formatting

### User Experience
- Real-time search with 500ms debounce
- Visual match quality indicators
- Confidence percentage display
- Auto-population of coordinates
- Professional error handling

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": "Address is required",
  "matchQuality": "no-match"
}
```

### Error Types
- **Validation Errors**: Invalid input format
- **Rate Limit Errors**: Too many requests
- **API Errors**: CoreLogic service issues
- **Network Errors**: Connection problems

## Monitoring & Analytics

### Service Statistics
```bash
GET /api/corelogic/stats
```

Returns:
- Cache hit/miss ratios
- Request counts
- Service configuration
- Performance metrics

### Health Check
```bash
GET /api/corelogic/health
```

Returns:
- Service status
- API connectivity
- Configuration validation

## Best Practices

### Address Formatting
- Use format: `[unitNumber] / [streetNumber] [streetName] [streetType] [suburb] [stateCode] [postcode]`
- Example: `1A/10 Smith St Smithville QLD 4000`
- Avoid abbreviations when possible

### Confidence Thresholds
- **Production**: 0.7+ (70% confidence)
- **Development**: 0.5+ (50% confidence)
- **Testing**: 0.0+ (any match)

### Caching Strategy
- Cache successful matches for 5 minutes
- Clear cache when needed: `DELETE /api/corelogic/cache`
- Monitor cache performance via stats endpoint

## Troubleshooting

### Common Issues

1. **"Rate limit exceeded"**
   - Wait 1 minute before retrying
   - Check if multiple requests are being made simultaneously

2. **"No suitable matches found"**
   - Try a more specific address
   - Check address formatting
   - Lower confidence threshold for testing

3. **"Service unavailable"**
   - Check backend server status
   - Verify CoreLogic API credentials
   - Check network connectivity

### Debug Mode

Enable debug logging:
```bash
DEBUG=corelogic:* npm run dev
```

## Support

For issues or questions:
- Check the health endpoint: `/api/corelogic/health`
- Review service statistics: `/api/corelogic/stats`
- Test with the provided test script: `node test-corelogic.js`

## License

Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
Licensed under MIT License - see LICENSE file for details.
Patent Protected: AU2025000001-AU2025000017
