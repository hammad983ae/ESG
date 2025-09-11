/**
 * Sustaino Pro - OCR Server
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Node.js OCR server for property document processing
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
require('dotenv').config();

const pdfProcessor = require('./services/pdfProcessor');
const ocrService = require('./services/ocrService');
const aiParser = require('./services/aiParser');

// Valuation backend imports
const Valuation = require('./models/ValuationModel');
const valuationService = require('./services/valuationService');
const valuationController = require('./controllers/valuationController');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sustaino_pro', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    error: 'Too many requests from this IP, please try again later.',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Ensure CORS headers are set even for rate limit responses
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      success: false
    });
  }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Additional CORS middleware to ensure headers are set for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Additional security and performance middleware
app.use(compression()); // Compress all responses
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS attacks
app.use(hpp()); // Prevent http param pollution

// Mock authentication middleware for valuation endpoints
app.use('/api/valuations', (req, res, next) => {
  req.user = { _id: '60d5ec49f8c7a4001c8e4d1a' }; // Mock user ID
  next();
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Sustaino Pro Unified Server',
    version: '1.0.0',
    features: ['OCR Processing', 'Valuation Management', 'MongoDB Integration', 'CoreLogic AVM', 'Market Insights'],
    endpoints: {
      ocr: '/api/ocr/extract',
      valuation: '/api/valuations',
      corelogic: '/api/corelogic',
      avm: '/api/avm',
      marketInsights: '/api/market-insights',
      health: '/health'
    }
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      server: 'Sustaino Pro Unified Server',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      features: {
        ocr: {
          enabled: true,
          endpoints: ['/api/ocr/extract', '/api/ocr/extract-base64']
        },
        valuation: {
          enabled: true,
          endpoints: ['/api/valuations', '/api/valuations/search', '/api/valuations/stats']
        },
        corelogic: {
          enabled: true,
          endpoints: ['/api/corelogic/search']
        },
        avm: {
          enabled: true,
          endpoints: ['/api/avm/origination/current', '/api/avm/consumer/band/current', '/api/avm/consumer/history', '/api/avm/origination/history', '/api/avm/date', '/api/avm/live/origination', '/api/avm/live/consumer', '/api/avm/live/consumer/band', '/api/avm/report/consumer', '/api/avm/report/origination', '/api/avm/stats']
        },
        marketInsights: {
          enabled: true,
          endpoints: ['/api/market-insights/auction/summaries', '/api/market-insights/auction/results', '/api/market-insights/auction/details', '/api/market-insights/census/statistics', '/api/market-insights/census/summary', '/api/market-insights/statistics/timeseries', '/api/market-insights/charts/census', '/api/market-insights/charts/timeseries', '/api/market-insights/stats']
        },
        database: {
          type: 'MongoDB',
          connected: mongoose.connection.readyState === 1
        }
      }
    }
  });
});

// OCR processing endpoint
app.post('/api/ocr/extract', upload.single('file'), async (req, res) => {
  try {
    const { formType } = req.body;
    
    if (!formType) {
      return res.status(400).json({
        error: 'Missing formType parameter',
        success: false
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        success: false
      });
    }

    console.log(`Processing ${req.file.originalname} for form type: ${formType}`);

    let imagesToProcess = [];
    const isPdf = req.file.mimetype === 'application/pdf';

    if (isPdf) {
      console.log('Processing PDF file...');
      try {
        imagesToProcess = await pdfProcessor.processPdfToImages(req.file.buffer);
        console.log(`PDF converted to ${imagesToProcess.length} images`);
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError.message);
        return res.status(400).json({
          error: pdfError.message,
          success: false,
          suggestion: 'Please convert your PDF to images (JPG/PNG) and upload them instead, or install ImageMagick/GraphicsMagick for PDF support.'
        });
      }
    } else {
      console.log('Processing image file...');
      imagesToProcess = [req.file.buffer.toString('base64')];
    }

    // Process each image through OCR
    const allResults = [];
    const isMultiPage = imagesToProcess.length > 1;

    for (let i = 0; i < imagesToProcess.length; i++) {
      const imageBase64 = imagesToProcess[i];
      const pageNumber = isMultiPage ? i + 1 : null;

      console.log(`Processing ${isMultiPage ? `page ${pageNumber}` : 'image'}...`);

      try {
        // Extract text using Google Cloud Vision API
        const extractedText = await ocrService.extractText(imageBase64);
        
        if (!extractedText) {
          console.warn(`No text found in ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
          continue;
        }

        console.log(`Extracted text length from ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, extractedText.length);

        // Parse the extracted text using AI
        const parsedData = await aiParser.parseFormData(extractedText, formType);

        if (!parsedData || Object.keys(parsedData).length === 0) {
          console.warn(`No structured data extracted from ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
          continue;
        }

        console.log(`Successfully parsed data from ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, parsedData);

        // Store result for this page/image
        allResults.push({
          pageNumber: pageNumber,
          extractedText: extractedText.substring(0, 500) + '...', // Truncate for response
          parsedData: parsedData,
          success: true
        });

      } catch (pageError) {
        console.error(`Error processing ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, pageError);
        
        allResults.push({
          pageNumber: pageNumber,
          extractedText: '',
          parsedData: {},
          success: false,
          error: pageError.message
        });
      }
    }

    // Check if we have any successful results
    const successfulResults = allResults.filter(result => result.success);
    
    if (successfulPages.length === 0) {
      return res.status(400).json({
        error: 'No text could be extracted from any page/image',
        success: false
      });
    }

    // Prepare response based on whether it's multi-page or single image
    if (isMultiPage) {
      // For multi-page documents, return array of results
      return res.json({
        pages: allResults.map(result => ({
          pageNumber: result.pageNumber,
          extractedText: result.extractedText,
          parsedData: result.parsedData,
          success: result.success,
          error: result.error || null
        })),
        totalPages: imagesToProcess.length,
        successfulPages: successfulPages.length,
        isMultiPage: true,
        success: true
      });
    } else {
      // For single images, maintain backward compatibility
      const singleResult = allResults[0];
      return res.json({
        extractedText: singleResult.extractedText,
        parsedData: singleResult.parsedData,
        success: singleResult.success,
        error: singleResult.error || null
      });
    }

  } catch (error) {
    console.error('Error in OCR extraction:', error);
    
    let errorMessage = error.message || 'An unexpected error occurred';
    let statusCode = 500;
    
    if (error.message.includes('File too large')) {
      errorMessage = 'File too large. Please use a file smaller than 10MB.';
      statusCode = 413;
    } else if (error.message.includes('Invalid file type')) {
      errorMessage = 'Invalid file type. Only image and PDF files are allowed.';
      statusCode = 400;
    } else if (error.message.includes('PDF processing error')) {
      errorMessage = `PDF processing error: ${error.message}`;
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      success: false
    });
  }
});

// Base64 OCR processing endpoint (for compatibility with existing frontend)
app.post('/api/ocr/extract-base64', async (req, res) => {
  try {
    const { imageBase64, fileBase64, fileType, formType, images } = req.body;
    
    console.log('Received request:', {
      hasImageBase64: !!imageBase64,
      hasFileBase64: !!fileBase64,
      hasImages: !!images,
      imagesLength: images?.length || 0,
      formType: formType
    });
    
    if (!formType) {
      return res.status(400).json({
        error: 'Missing formType parameter',
        success: false
      });
    }

    let base64Data = null;
    let isPdf = false;
    let imagesToProcess = [];

    if (images && Array.isArray(images) && images.length > 0) {
      // New multi-page format from client-side PDF processing
      imagesToProcess = images;
      console.log(`Processing ${images.length} images from client-side PDF processing`);
    } else if (fileBase64) {
      base64Data = fileBase64;
      isPdf = fileType === 'application/pdf' || base64Data.substring(0, 20).includes('JVBERi');
    } else if (imageBase64) {
      base64Data = imageBase64;
    } else {
      return res.status(400).json({
        error: 'Missing required input: provide either imageBase64, fileBase64, or images array',
        success: false
      });
    }

    console.log(`Processing base64 data for form type: ${formType}, isPdf: ${isPdf}`);

    // Process images if not already set from client-side processing
    if (imagesToProcess.length === 0) {
      if (isPdf) {
        console.log('Processing PDF from base64...');
        try {
          const pdfBuffer = Buffer.from(base64Data, 'base64');
          imagesToProcess = await pdfProcessor.processPdfToImages(pdfBuffer);
          console.log(`PDF converted to ${imagesToProcess.length} images`);
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError.message);
          return res.status(400).json({
            error: pdfError.message,
            success: false,
            suggestion: 'Please convert your PDF to images (JPG/PNG) and upload them instead, or install ImageMagick/GraphicsMagick for PDF support.'
          });
        }
      } else {
        console.log('Processing image from base64...');
        imagesToProcess = [base64Data];
      }
    }

    // Process each image through OCR
    const allResults = [];
    const isMultiPage = imagesToProcess.length > 1;

    // First, extract text from all pages
    for (let i = 0; i < imagesToProcess.length; i++) {
      const imageBase64 = imagesToProcess[i];
      const pageNumber = isMultiPage ? i + 1 : null;

      console.log(`Extracting text from ${isMultiPage ? `page ${pageNumber}` : 'image'}...`);

      try {
        // Extract text using OpenAI Vision API
        const extractedText = await ocrService.extractText(imageBase64);
        
        if (!extractedText) {
          console.warn(`No text found in ${isMultiPage ? `page ${pageNumber}` : 'image'}`);
          allResults.push({
            pageNumber: pageNumber,
            extractedText: '',
            success: false,
            error: 'No text found'
          });
          continue;
        }

        console.log(`Extracted text length from ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, extractedText.length);

        // Store result for this page/image (text only for now)
        allResults.push({
          pageNumber: pageNumber,
          extractedText: extractedText,
          success: true
        });

      } catch (pageError) {
        console.error(`Error processing ${isMultiPage ? `page ${pageNumber}` : 'image'}:`, pageError);
        
        allResults.push({
          pageNumber: pageNumber,
          extractedText: '',
          success: false,
          error: pageError.message
        });
      }
    }

    // Filter successful extractions
    const successfulPages = allResults.filter(result => result.success);
    
    if (successfulPages.length === 0) {
      return res.status(400).json({
        error: 'No text could be extracted from any page/image',
        success: false
      });
    }

    // Now use bulk AI processing for all successful pages
    let finalParsedData = {};
    
    if (isMultiPage && successfulPages.length > 1) {
      console.log(`Using bulk AI processing for ${successfulPages.length} pages...`);
      try {
        finalParsedData = await aiParser.parseBulkFormData(successfulPages, formType);
        console.log('Bulk AI processing completed successfully');
      } catch (bulkError) {
        console.error('Bulk AI processing failed, falling back to individual processing:', bulkError);
        // Fallback to individual processing
        for (const page of successfulPages) {
          try {
            const parsedData = await aiParser.parseFormData(page.extractedText, formType);
            if (parsedData && Object.keys(parsedData).length > 0) {
              // Merge data (last wins for conflicts)
              finalParsedData = { ...finalParsedData, ...parsedData };
            }
          } catch (parseError) {
            console.error(`Failed to parse page ${page.pageNumber}:`, parseError);
          }
        }
      }
    } else {
      // Single page or fallback
      console.log('Using individual AI processing...');
      try {
        finalParsedData = await aiParser.parseFormData(successfulPages[0].extractedText, formType);
      } catch (parseError) {
        console.error('Individual AI processing failed:', parseError);
        return res.status(400).json({
          error: 'Failed to parse extracted text',
          success: false
        });
      }
    }

    // Update results with final parsed data
    allResults.forEach(result => {
      if (result.success) {
        result.parsedData = finalParsedData;
        result.extractedText = result.extractedText.substring(0, 500) + '...'; // Truncate for response
      }
    });

    // Prepare response based on whether it's multi-page or single image
    if (isMultiPage) {
      // For multi-page documents, return array of results
      return res.json({
        pages: allResults.map(result => ({
          pageNumber: result.pageNumber,
          extractedText: result.extractedText,
          parsedData: result.parsedData,
          success: result.success,
          error: result.error || null
        })),
        totalPages: imagesToProcess.length,
        successfulPages: successfulPages.length,
        isMultiPage: true,
        success: true
      });
    } else {
      // For single images, maintain backward compatibility
      const singleResult = allResults[0];
      return res.json({
        extractedText: singleResult.extractedText,
        parsedData: singleResult.parsedData,
        success: singleResult.success,
        error: singleResult.error || null
      });
    }

  } catch (error) {
    console.error('Error in base64 OCR extraction:', error);
    
    res.status(500).json({
      error: error.message || 'An unexpected error occurred',
      success: false
    });
  }
});

// Valuation API Routes
app.use('/api/valuations', require('./routes/valuationRoutes'));

// CoreLogic API Routes
app.use('/api/corelogic', require('./routes/corelogicRoutes'));

// AVM API Routes
app.use('/api/avm', require('./routes/avmRoutes'));

// Market Insights API Routes
app.use('/api/market-insights', require('./routes/marketInsightsRoutes'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large. Please use a file smaller than 10MB.',
        success: false
      });
    }
  }
  
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sustaino Pro Unified Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 OCR endpoints:`);
  console.log(`   - File upload: http://localhost:${PORT}/api/ocr/extract`);
  console.log(`   - Base64: http://localhost:${PORT}/api/ocr/extract-base64`);
  console.log(`💰 Valuation endpoints:`);
  console.log(`   - CRUD: http://localhost:${PORT}/api/valuations`);
  console.log(`   - Search: http://localhost:${PORT}/api/valuations/search`);
  console.log(`   - Stats: http://localhost:${PORT}/api/valuations/stats`);
  console.log(`📈 API Status: http://localhost:${PORT}/api/status`);
});

module.exports = app;
