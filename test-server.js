/**
 * Quick Server Test Script
 */

const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Server Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await testEndpoint('/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response: ${health.body.substring(0, 100)}...\n`);

    // Test 2: CoreLogic health
    console.log('2️⃣ Testing CoreLogic health endpoint...');
    const corelogicHealth = await testEndpoint('/api/corelogic/health');
    console.log(`Status: ${corelogicHealth.status}`);
    console.log(`Response: ${corelogicHealth.body}\n`);

    // Test 3: CoreLogic search
    console.log('3️⃣ Testing CoreLogic search endpoint...');
    const search = await testEndpoint('/api/corelogic/search', 'POST', {
      address: '123 Collins Street Melbourne VIC 3000',
      clientName: 'Test Client'
    });
    console.log(`Status: ${search.status}`);
    console.log(`Response: ${search.body.substring(0, 200)}...\n`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
