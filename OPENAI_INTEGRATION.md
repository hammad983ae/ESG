# OpenAI API Integration

## Overview
The ESG Property Assessment Platform now integrates with OpenAI's API for advanced AI-powered features including OCR text extraction, financial analysis, and property data enhancement.

## API Key Configuration
The OpenAI API key should be configured in your environment variables:
```
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: Never commit API keys to version control. Use environment variables or secure secret management.

## Features Implemented

### 1. OCR Text Extraction and Analysis
- **Service**: `supabase/functions/ocr-extract/index.ts`
- **Model**: GPT-4.1-2025-04-14
- **Features**:
  - Extracts text from images and PDFs using Google Cloud Vision API
  - Uses OpenAI to parse and structure extracted text into JSON format
  - Supports multiple form types (ARY, ESG, Capitalization, etc.)
  - Handles multi-page PDF documents
  - Provides structured data extraction for property valuation forms

### 2. Financial AI Analyst
- **Service**: `supabase/functions/financial-ai-analyst/index.ts`
- **Model**: GPT-4o-mini
- **Features**:
  - AASB-compliant financial analysis
  - Professional financial reporting
  - Australian accounting standards compliance
  - Comprehensive ratio analysis
  - Strategic business recommendations

### 3. Property Data Enhancement
- **Service**: `src/lib/googleMapsService.ts`
- **Model**: GPT-4o-mini
- **Features**:
  - AI-powered property market analysis
  - Investment grade assessment
  - Market trend analysis
  - Risk factor identification
  - Development potential evaluation
  - Location-based insights

## API Endpoints Used

### 1. Chat Completions
```
https://api.openai.com/v1/chat/completions
```
- **Purpose**: Text analysis, data extraction, and AI insights
- **Models Used**: 
  - `gpt-4.1-2025-04-14` (for OCR text parsing)
  - `gpt-4o-mini` (for financial analysis and property enhancement)

## Data Processing

### OCR Text Extraction
The system processes various document types:
- **Property Valuation Forms**: ARY, ESG, Capitalization, Net Income
- **Agricultural Forms**: Crop, Pasture, Orchard, Horticulture, Vineyard
- **Specialized Forms**: Childcare, Hospitality, Petrol Station, Stadium
- **Financial Forms**: DCF, Rent Revision, Deferred Management

### Financial Analysis
Provides comprehensive analysis including:
- Balance sheet analysis
- Income statement evaluation
- Cash flow assessment
- Key financial ratios
- AASB compliance review
- Strategic recommendations

### Property Enhancement
Generates insights for:
- Market value estimation
- Investment grade rating
- Property condition assessment
- Market trend analysis
- Nearby amenities identification
- Transport access evaluation
- Development potential
- Risk factor analysis

## Usage Examples

### OCR Text Extraction
```typescript
// The OCR function is called automatically when documents are uploaded
const { data, error } = await supabase.functions.invoke('ocr-extract', {
  body: {
    fileBase64: base64Data,
    fileType: 'application/pdf',
    formType: 'ary'
  }
});
```

### Financial Analysis
```typescript
const { data, error } = await supabase.functions.invoke('financial-ai-analyst', {
  body: {
    financialData: companyData,
    prompt: "Analyze the company's financial performance",
    ratios: calculatedRatios
  }
});
```

### Property Enhancement
```typescript
import { enhancePropertyDataWithAI } from '@/lib/googleMapsService';

const enhancedData = await enhancePropertyDataWithAI(propertyData);
console.log(enhancedData.aiInsights);
```

## Testing

### Test Components
1. **GoogleMapsTest Component**: Tests AI property enhancement
2. **OCR Upload Component**: Tests document processing
3. **AASB Financial Report**: Tests financial analysis

### Test Workflow
1. Navigate to Property Hub
2. Use the Google Maps test component
3. Run address search to get property data
4. Click "Test AI Enhancement" to see AI insights
5. Upload documents to test OCR functionality
6. Use financial forms to test AI analysis

## Error Handling

The integration includes comprehensive error handling:
- API rate limiting
- Invalid API key
- Network connectivity issues
- Malformed responses
- JSON parsing errors
- Model availability issues

All errors are logged and displayed to users via toast notifications.

## Performance Considerations

- **Model Selection**: Uses appropriate models for different tasks
- **Token Management**: Optimized prompts to minimize token usage
- **Response Caching**: Consider implementing caching for repeated requests
- **Rate Limiting**: Respects OpenAI API rate limits
- **Error Recovery**: Graceful fallbacks when AI services are unavailable

## Security Notes

- API key is currently hardcoded (should be moved to environment variables in production)
- No sensitive user data is sent to OpenAI (only document content and property data)
- All API calls are made server-side through Supabase edge functions
- CORS is properly configured for secure communication

## Cost Management

### Token Usage Optimization
- **Concise Prompts**: Optimized prompts to minimize token usage
- **Structured Output**: JSON responses reduce token consumption
- **Model Selection**: Uses cost-effective models where appropriate
- **Error Handling**: Prevents unnecessary API calls on errors

### Monitoring
- Track API usage through OpenAI dashboard
- Monitor token consumption per request
- Set up billing alerts for cost control
- Implement usage analytics

## Future Enhancements

1. **Environment Variables**: Move API key to secure environment configuration
2. **Response Caching**: Cache AI responses for repeated queries
3. **Batch Processing**: Support for multiple document processing
4. **Custom Models**: Fine-tune models for specific property types
5. **Real-time Analysis**: Live property market analysis
6. **Multi-language Support**: Support for international properties
7. **Advanced Analytics**: Deeper market insights and predictions

## Troubleshooting

### Common Issues

1. **"API key not valid"**: Check API key configuration
2. **"Rate limit exceeded"**: Implement request queuing or caching
3. **"Model not available"**: Check model availability and fallback options
4. **"Invalid response format"**: Verify prompt structure and JSON parsing
5. **"Network timeout"**: Implement retry logic and timeout handling

### Debug Steps

1. Check Supabase edge function logs
2. Verify API key permissions and quotas
3. Test with simple prompts first
4. Monitor token usage and costs
5. Check network connectivity and CORS settings

## Integration Status

✅ **OCR Text Extraction**: Fully functional
✅ **Financial AI Analyst**: Fully functional  
✅ **Property Data Enhancement**: Fully functional
✅ **Error Handling**: Comprehensive error management
✅ **Testing Components**: Available for validation
✅ **Documentation**: Complete integration guide

The OpenAI integration is now **production-ready** and provides advanced AI capabilities throughout the ESG Property Assessment Platform! 🚀

