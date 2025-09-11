#!/usr/bin/env node

/**
 * Delorenzo Property Group - Valuation Backend Server
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Main entry point for the valuation backend server
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const valuationApp = require('./app');

// Load environment variables
require('dotenv').config();

// Start the server
async function startServer() {
  try {
    console.log('🚀 Starting Delorenzo Property Group Valuation Backend...');
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db'}`);
    
    await valuationApp.start();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
