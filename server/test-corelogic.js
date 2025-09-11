/**
 * CoreLogic Backend Service Test Script
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd. All Rights Reserved.
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Test script to verify CoreLogic backend service integration
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/corelogic';

async function testCoreLogicService() {
  console.log('🧪 Testing CoreLogic Backend Service...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Address Search (POST)
    console.log('2️⃣ Testing Address Search (POST)...');
    const searchResponse = await axios.post(`${BASE_URL}/search`, {
      address: '123 Collins Street Melbourne VIC 3000',
      clientName: 'Sustaino Pro Test',
      minConfidence: 0.7
    });
    console.log('✅ Address Search Result:', JSON.stringify(searchResponse.data, null, 2));
    console.log('');

    // Test 3: Address Search (GET)
    console.log('3️⃣ Testing Address Search (GET)...');
    const getSearchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: '456 Bourke Street Melbourne VIC 3000',
        clientName: 'Sustaino Pro Test',
        minConfidence: 0.7
      }
    });
    console.log('✅ GET Address Search Result:', JSON.stringify(getSearchResponse.data, null, 2));
    console.log('');

    // Test 4: Service Statistics
    console.log('4️⃣ Testing Service Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('✅ Service Stats:', JSON.stringify(statsResponse.data, null, 2));
    console.log('');

    // Test 5: Invalid Address Test
    console.log('5️⃣ Testing Invalid Address...');
    try {
      const invalidResponse = await axios.post(`${BASE_URL}/search`, {
        address: 'Invalid Address 12345',
        clientName: 'Sustaino Pro Test'
      });
      console.log('✅ Invalid Address Result:', JSON.stringify(invalidResponse.data, null, 2));
    } catch (error) {
      console.log('✅ Invalid Address Error (Expected):', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📊 CoreLogic Backend Service is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    process.exit(1);
  }
}

// Run tests
testCoreLogicService();
