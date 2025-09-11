#!/usr/bin/env node

/**
 * Delorenzo Property Group - Server Startup Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Enhanced server startup with health checks and monitoring
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const valuationApp = require('../app');
const databaseConfig = require('../config/database');

async function startServer() {
  try {
    console.log('🚀 Starting Delorenzo Property Group Valuation Backend...');
    console.log('='.repeat(60));
    
    // Display configuration
    console.log('📋 Configuration:');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Port: ${process.env.PORT || 3001}`);
    console.log(`   Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db'}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log('');

    // Start the application
    await valuationApp.start();

    // Display startup information
    console.log('');
    console.log('✅ Server started successfully!');
    console.log('='.repeat(60));
    console.log('🔗 Available endpoints:');
    console.log(`   Health Check: http://localhost:${process.env.PORT || 3001}/health`);
    console.log(`   API Status: http://localhost:${process.env.PORT || 3001}/api/status`);
    console.log(`   API Docs: http://localhost:${process.env.PORT || 3001}/api/docs`);
    console.log(`   Valuations API: http://localhost:${process.env.PORT || 3001}/api/valuations`);
    console.log('');
    console.log('📚 Supported valuation types:');
    console.log('   • ARY (All Risks Yield)');
    console.log('   • ESG-Adjusted ARY');
    console.log('   • Capitalization Rate Sensitivity');
    console.log('   • Net Income Approach');
    console.log('   • DCF Analysis');
    console.log('   • Comparable Sales');
    console.log('   • Summation Approach');
    console.log('   • Direct Comparison');
    console.log('   • Hypothetical Development');
    console.log('   • Hospitality & Commercial');
    console.log('   • Childcare Facilities');
    console.log('   • Petrol Stations');
    console.log('   • Sports Stadiums');
    console.log('   • Deferred Management');
    console.log('   • Comprehensive ESG');
    console.log('');
    console.log('🏢 Supported property types:');
    console.log('   • Residential, Commercial, Industrial, Retail, Office');
    console.log('   • Hospitality, Childcare, Petrol Station, Stadium');
    console.log('   • Agricultural, Mixed-Use, Other');
    console.log('');
    console.log('💡 To seed the database with sample data:');
    console.log('   npm run db:seed');
    console.log('');
    console.log('🧪 To run tests:');
    console.log('   npm test');
    console.log('');
    console.log('📖 For more information, see README.md');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
