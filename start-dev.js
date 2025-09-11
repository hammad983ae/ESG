#!/usr/bin/env node

/**
 * Sustaino Pro Development Startup Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * Patent Protected: AU2025000001-AU2025000019
 * 
 * Starts both frontend and backend servers for development
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Sustaino Pro Development Environment...\n');

// Start the OCR server
console.log('📡 Starting OCR Server on port 3001...');
const serverProcess = spawn('node', ['start.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[OCR Server] ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[OCR Server Error] ${data.toString().trim()}`);
});

// Start the frontend development server
console.log('🎨 Starting Frontend Development Server on port 8080...');
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe'
});

frontendProcess.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontendProcess.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  
  serverProcess.kill('SIGINT');
  frontendProcess.kill('SIGINT');
  
  setTimeout(() => {
    console.log('✅ Development servers stopped');
    process.exit(0);
  }, 2000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('\n✨ Development environment started!');
console.log('📊 Frontend: http://localhost:8080');
console.log('🔍 OCR Server: http://localhost:3001');
console.log('📋 Health Check: http://localhost:3001/health');
console.log('\nPress Ctrl+C to stop both servers\n');
