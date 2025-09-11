#!/usr/bin/env node

/**
 * Sustaino Pro OCR Setup Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Interactive setup script for OCR functionality
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Sustaino Pro OCR Setup');
console.log('========================\n');

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found. Please ensure you\'re in the project root.');
  process.exit(1);
}

// Check if server package.json exists
const serverPackageJson = path.join(serverDir, 'package.json');
if (!fs.existsSync(serverPackageJson)) {
  console.error('❌ Server package.json not found. Please ensure the server directory is properly set up.');
  process.exit(1);
}

console.log('📦 Installing server dependencies...');
try {
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });
  console.log('✅ Server dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install server dependencies:', error.message);
  process.exit(1);
}

// Check if .env file exists in server directory
const envPath = path.join(serverDir, '.env');
const envExamplePath = path.join(serverDir, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env file from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
  } else {
    console.log('⚠️  No env.example file found. Creating basic .env file...');
    const basicEnv = `# OCR Server Configuration
PORT=3001
NODE_ENV=development

# Google Cloud Vision API
GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_vision_api_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🔧 Configuration Required:');
console.log('========================');
console.log('Please update the following in server/.env:');
console.log('');
console.log('1. GOOGLE_CLOUD_VISION_API_KEY - Get from Google Cloud Console');
console.log('   https://console.cloud.google.com/apis/credentials');
console.log('');
console.log('2. OPENAI_API_KEY - Get from OpenAI Platform');
console.log('   https://platform.openai.com/api-keys');
console.log('');

// Check if API keys are configured
const envContent = fs.readFileSync(envPath, 'utf8');
const hasGoogleKey = envContent.includes('your_google_cloud_vision_api_key_here') === false;
const hasOpenAIKey = envContent.includes('your_openai_api_key_here') === false;

if (hasGoogleKey && hasOpenAIKey) {
  console.log('✅ API keys appear to be configured');
} else {
  console.log('⚠️  Please update your API keys in server/.env before running the server');
}

console.log('\n🚀 Quick Start Commands:');
console.log('=======================');
console.log('');
console.log('1. Start OCR server only:');
console.log('   npm run server:dev');
console.log('');
console.log('2. Start frontend only:');
console.log('   npm run dev');
console.log('');
console.log('3. Start both servers:');
console.log('   npm run dev:full');
console.log('');
console.log('4. Test OCR server:');
console.log('   curl http://localhost:3001/health');
console.log('');

console.log('📚 Documentation:');
console.log('================');
console.log('See server/README.md for detailed setup instructions');
console.log('');

console.log('✨ Setup complete! You can now start the development servers.');
console.log('');
