/**
 * Delorenzo Property Group - Valuation Backend Application
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Main Express application for valuation backend services
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import configurations and services
const databaseConfig = require('./config/database');
const valuationRoutes = require('./routes/valuationRoutes');
const corelogicRoutes = require('./routes/corelogicRoutes');
const avmRoutes = require('./routes/avmRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

class ValuationApp {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:8080',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan('combined'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Session configuration
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'delorenzo-valuation-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db',
        touchAfter: 24 * 3600 // lazy session update
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Request ID middleware
    this.app.use((req, res, next) => {
      req.requestId = req.headers['x-request-id'] || 
        Math.random().toString(36).substr(2, 9);
      res.setHeader('X-Request-ID', req.requestId);
      next();
    });
  }

  /**
   * Setup application routes
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await databaseConfig.healthCheck();
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: dbHealth,
          version: '1.0.0'
        });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error.message
        });
      }
    });

    // API status endpoint
    this.app.get('/api/status', (req, res) => {
      res.json({
        success: true,
        message: 'Delorenzo Property Group Valuation API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          valuations: '/api/valuations',
          health: '/health',
          docs: '/api/docs'
        }
      });
    });

    // API documentation endpoint
    this.app.get('/api/docs', (req, res) => {
      res.json({
        success: true,
        message: 'API Documentation',
        version: '1.0.0',
        endpoints: {
          'POST /api/valuations': 'Create a new valuation',
          'GET /api/valuations': 'Get all valuations for a user',
          'GET /api/valuations/:id': 'Get valuation by ID',
          'PUT /api/valuations/:id': 'Update valuation',
          'DELETE /api/valuations/:id': 'Delete valuation',
          'PATCH /api/valuations/:id/archive': 'Archive valuation',
          'POST /api/valuations/:id/share': 'Share valuation',
          'GET /api/valuations/search': 'Search valuations',
          'GET /api/valuations/stats': 'Get valuation statistics',
          'POST /api/valuations/export': 'Export valuations',
          'GET /api/valuations/types': 'Get supported valuation types',
          'POST /api/corelogic/search': 'Search property addresses',
          'GET /api/avm/origination/current/:propertyId': 'Get current origination AVM',
          'GET /api/avm/consumer/band/current/:propertyId': 'Get current consumer band AVM',
          'GET /api/avm/consumer/history/:propertyId': 'Get consumer AVM history',
          'GET /api/avm/origination/history/:propertyId': 'Get origination AVM history',
          'GET /api/avm/date/:propertyId/:valuationDate': 'Get AVM for specific date',
          'POST /api/avm/live/origination/:propertyId': 'Get live origination AVM',
          'POST /api/avm/live/consumer/:propertyId': 'Get live consumer AVM',
          'POST /api/avm/live/consumer/band/:propertyId': 'Get live consumer band AVM',
          'GET /api/avm/report/consumer/:propertyId': 'Get AVM consumer report',
          'GET /api/avm/report/origination/:propertyId': 'Get AVM origination report',
          'GET /api/avm/stats': 'Get AVM service statistics',
          'GET /api/weather/image': 'Get weather image URL',
          'GET /api/weather/agricultural/:lat/:lon': 'Get agricultural weather chart',
          'GET /api/weather/meteogram/:lat/:lon': 'Get standard meteogram',
          'GET /api/weather/weekly/:lat/:lon': 'Get weekly forecast',
          'GET /api/weather/solar/:lat/:lon': 'Get solar meteogram',
          'GET /api/weather/sounding/:lat/:lon': 'Get atmospheric sounding',
          'GET /api/weather/agricultural-data/:lat/:lon': 'Get comprehensive agricultural weather data',
          'GET /api/weather/stats': 'Get weather service statistics',
          'POST /api/weather/clear-cache': 'Clear weather cache',
          'GET /api/weather/health': 'Weather service health check'
        },
        supportedValuationTypes: [
          'ary', 'esg-ary', 'capitalization-sensitivity', 'net-income',
          'esg-capitalization', 'esg-comparable-sales', 'cap-net-income',
          'summation', 'direct-comparison', 'hypothetical-development',
          'hospitality', 'childcare', 'comprehensive-esg', 'petrol-station',
          'deferred-management', 'dcf', 'stadium'
        ],
        supportedPropertyTypes: [
          'residential', 'commercial', 'industrial', 'retail', 'office',
          'hospitality', 'childcare', 'petrol-station', 'stadium',
          'agricultural', 'mixed-use', 'other'
        ]
      });
    });

    // Mount valuation routes
    this.app.use('/api/valuations', valuationRoutes);
    
    // Mount CoreLogic routes
    this.app.use('/api/corelogic', corelogicRoutes);
    
    // Mount AVM routes
    this.app.use('/api/avm', avmRoutes);
    
    // Mount Weather routes
    this.app.use('/api/weather', weatherRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
      });
    });
  }

  /**
   * Setup error handling middleware
   */
  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Global error handler:', error);

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          success: false,
          message: `${field} already exists`,
          field: field
        });
      }

      // MongoDB connection error
      if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
        return res.status(503).json({
          success: false,
          message: 'Database connection error',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
        });
      }

      // Default error response
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        requestId: req.requestId
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  /**
   * Start the server
   */
  async start() {
    try {
      // Connect to MongoDB
      await databaseConfig.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );

      // Create database indexes
      await databaseConfig.createIndexes();

      // Start HTTP server
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Valuation API server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`📚 API docs: http://localhost:${this.port}/api/docs`);
        console.log(`🔗 API status: http://localhost:${this.port}/api/status`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown
   */
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      try {
        // Stop accepting new connections
        this.server.close(async () => {
          console.log('🔌 HTTP server closed');
          
          // Close database connection
          await databaseConfig.disconnect();
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        });
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  /**
   * Get Express app instance
   */
  getApp() {
    return this.app;
  }

  /**
   * Get server instance
   */
  getServer() {
    return this.server;
  }
}

// Create and export app instance
const valuationApp = new ValuationApp();

module.exports = valuationApp;
