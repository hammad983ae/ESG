#!/usr/bin/env node

/**
 * Delorenzo Property Group - Valuation Backend Startup Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Script to start the valuation backend server
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Delorenzo Property Group Valuation Backend...');
console.log('='.repeat(60));

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found. Please ensure the server is properly set up.');
  process.exit(1);
}

// Check if package.json exists in server directory
const packageJsonPath = path.join(serverDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Server package.json not found. Please run npm install in the server directory.');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(serverDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing server dependencies...');
  const installProcess = spawn('npm', ['install'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true
  });

  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting valuation backend server...');
  
  // Set environment variables
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.PORT = process.env.PORT || '3001';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/valuation_db';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Start the server
  const serverProcess = spawn('node', ['index.js'], {
    cwd: serverDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
    } else {
      console.log('✅ Server stopped gracefully');
    }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGTERM');
  });
}
