#!/usr/bin/env node

/**
 * Test script to verify Railway deployment readiness
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Railway deployment readiness...\n');

// Test 1: Check if server files exist
console.log('1. Checking server files...');
const serverFiles = [
  'server/server.js',
  'server/package.json',
  'server/services/corelogicService.js',
  'server/routes/corelogicRoutes.js'
];

let allFilesExist = true;
serverFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 2: Check package.json scripts
console.log('\n2. Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.scripts.start) {
  console.log(`   ✅ Start script: ${packageJson.scripts.start}`);
} else {
  console.log('   ❌ No start script found');
  allFilesExist = false;
}

// Test 3: Check Railway configuration
console.log('\n3. Checking Railway configuration...');
if (fs.existsSync('railway.json')) {
  console.log('   ✅ railway.json exists');
} else {
  console.log('   ❌ railway.json missing');
  allFilesExist = false;
}

if (fs.existsSync('Procfile')) {
  console.log('   ✅ Procfile exists');
} else {
  console.log('   ❌ Procfile missing');
  allFilesExist = false;
}

// Test 4: Check server dependencies
console.log('\n4. Checking server dependencies...');
const serverPackageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
const requiredDeps = ['express', 'cors', 'mongoose', 'dotenv'];
let depsOk = true;

requiredDeps.forEach(dep => {
  if (serverPackageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep}: ${serverPackageJson.dependencies[dep]}`);
  } else {
    console.log(`   ❌ ${dep} - MISSING`);
    depsOk = false;
  }
});

// Test 5: Check environment variables
console.log('\n5. Checking environment variables...');
const envExample = fs.readFileSync('server/env.example', 'utf8');
const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'SESSION_SECRET'];
let envOk = true;

requiredEnvVars.forEach(envVar => {
  if (envExample.includes(envVar)) {
    console.log(`   ✅ ${envVar} in env.example`);
  } else {
    console.log(`   ❌ ${envVar} - MISSING from env.example`);
    envOk = false;
  }
});

// Summary
console.log('\n📊 Deployment Readiness Summary:');
console.log('================================');

if (allFilesExist && depsOk && envOk) {
  console.log('✅ READY FOR RAILWAY DEPLOYMENT!');
  console.log('\nNext steps:');
  console.log('1. Set environment variables in Railway dashboard');
  console.log('2. Connect MongoDB database');
  console.log('3. Deploy!');
} else {
  console.log('❌ NOT READY - Fix the issues above first');
}

console.log('\n🔧 Required Railway Environment Variables:');
console.log('NODE_ENV=production');
console.log('PORT=3001');
console.log('MONGODB_URI=your-mongodb-uri');
console.log('SESSION_SECRET=your-secret-key');
console.log('JWT_SECRET=your-jwt-secret');
