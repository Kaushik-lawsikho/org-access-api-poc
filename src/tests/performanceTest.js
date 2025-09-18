const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const API_KEY = 'org_1_brand_1_abc123def456';

async function performanceTest() {
  console.log('⚡ Performance Test Starting...\n');

  const testCases = [
    { name: 'Organization Info', endpoint: '/org/info' },
    { name: 'Get All Courses', endpoint: '/courses' },
    { name: 'Search Courses', endpoint: '/courses/search?q=python' }
  ];

  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);
    
    const startTime = Date.now();
    const requests = [];
    
    // Make 10 concurrent requests
    for (let i = 0; i < 10; i++) {
      requests.push(
        axios.get(`${API_BASE}${test.endpoint}`, {
          headers: { Authorization: `Bearer ${API_KEY}` }
        })
      );
    }

    try {
      await Promise.all(requests);
      const endTime = Date.now();
      const avgTime = (endTime - startTime) / 10;
      
      console.log(`✅ ${test.name}: ${avgTime.toFixed(2)}ms average response time`);
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
  }

  console.log('\n🏁 Performance test completed!');
}

performanceTest();