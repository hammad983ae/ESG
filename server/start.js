#!/usr/bin/env node

/**
 * Sustaino Pro OCR Server Startup Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env file from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your API keys.');
  } else {
    console.log('⚠️  No .env file found. Please create one with your API keys.');
  }
}

// Load environment variables
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_CLOUD_VISION_API_KEY',
  'OPENAI_API_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease update your .env file with the required API keys.');
  process.exit(1);
}

// Start the server
console.log('🚀 Starting Sustaino Pro OCR Server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔑 API Keys: Configured');

require('./server');
