# Sustaino Pro OCR Server

Node.js OCR server for the Sustaino Pro property assessment platform.

## Features

- **PDF Processing**: Convert PDF documents to images using pdfjs-dist
- **OCR Text Extraction**: Extract text from images using Google Cloud Vision API
- **AI-Powered Parsing**: Parse extracted text using OpenAI GPT models
- **Multi-page Support**: Handle multi-page PDFs with page selection
- **File Upload**: Support for both image and PDF file uploads
- **Base64 Support**: Process base64 encoded images for compatibility
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Error Handling**: Comprehensive error handling and validation

## Prerequisites

- Node.js 18+ 
- Google Cloud Vision API key
- OpenAI API key

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your API keys:
   ```env
   GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_vision_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Using the Startup Script
```bash
node start.js
```

The server will start on port 3001 by default.

## API Endpoints

### Health Check
```
GET /health
```

### OCR Processing (File Upload)
```
POST /api/ocr/extract
Content-Type: multipart/form-data

Form data:
- file: Image or PDF file
- formType: Form type (rent-revision, ary, esg, etc.)
```

### OCR Processing (Base64)
```
POST /api/ocr/extract-base64
Content-Type: application/json

Body:
{
  "imageBase64": "base64_encoded_image",
  "fileBase64": "base64_encoded_pdf",
  "fileType": "application/pdf",
  "formType": "rent-revision"
}
```

## Supported Form Types

- `rent-revision`: Rent revision analysis
- `ary`: ARY valuation
- `esg`: ESG assessment
- `capitalization`: Capitalization analysis
- `netincome`: Net income analysis
- `childcare`: Childcare facilities
- `hospitality`: Hotels and hospitality
- `petrol-station`: Petrol stations
- `stadium`: Sports venues
- `dcf`: DCF analysis
- `deferred-management`: Retirement villages
- `crop`: Crop farming
- `pasture`: Pasture and livestock
- `orchard`: Orchard farming
- `horticulture`: Horticulture
- `vineyard`: Vineyard operations

## Response Format

### Single Page Response
```json
{
  "extractedText": "Extracted text...",
  "parsedData": {
    "currentRent": 50000,
    "marketRent": 55000,
    "lettableArea": 1000
  },
  "success": true
}
```

### Multi-page Response
```json
{
  "pages": [
    {
      "pageNumber": 1,
      "extractedText": "Extracted text...",
      "parsedData": { ... },
      "success": true
    }
  ],
  "totalPages": 3,
  "successfulPages": 2,
  "isMultiPage": true,
  "success": true
}
```

## Error Handling

The server provides detailed error messages for common issues:

- File size too large (413)
- Invalid file type (400)
- Missing API keys (500)
- OCR processing errors (400/500)
- AI parsing errors (400/500)

## Configuration

Environment variables can be configured in `.env`:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `GOOGLE_CLOUD_VISION_API_KEY`: Google Cloud Vision API key
- `OPENAI_API_KEY`: OpenAI API key
- `CORS_ORIGIN`: CORS origin (default: http://localhost:8080)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

## Development

### Project Structure
```
server/
├── services/
│   ├── pdfProcessor.js    # PDF to image conversion
│   ├── ocrService.js      # Google Cloud Vision integration
│   └── aiParser.js        # OpenAI integration
├── server.js              # Main server file
├── start.js               # Startup script
├── package.json           # Dependencies
└── README.md             # This file
```

### Adding New Form Types

1. Update the `getSystemPrompt()` method in `services/aiParser.js`
2. Add the form type to the supported types list
3. Update the frontend form type mapping if needed

## Troubleshooting

### Common Issues

1. **Server won't start**: Check that all required environment variables are set
2. **OCR fails**: Verify Google Cloud Vision API key is valid and has quota
3. **AI parsing fails**: Verify OpenAI API key is valid and has credits
4. **PDF processing fails**: Ensure pdfjs-dist and canvas are properly installed
5. **CORS errors**: Check CORS_ORIGIN setting matches your frontend URL

### Logs

The server provides detailed console logs for debugging:
- Request processing status
- OCR extraction results
- AI parsing results
- Error details

## License

Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
Licensed under MIT License - see LICENSE file for details
Patent Protected: AU2025000001-AU2025000019
