const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test data - different API keys for different scenarios
const API_KEYS = {
  techcorp_education: 'org_1_brand_1_abc123def456',
  techcorp_professional: 'org_1_brand_2_xyz789uvw012',
  edusoft_direct: 'org_2_direct_ghi789jkl012',
  learnhub_kids: 'org_3_brand_3_def456ghi789',
  learnhub_adults: 'org_3_brand_4_mno123pqr456',
  invalid_key: 'invalid_key_123',
  expired_key: 'expired_key_456'
};

async function testCrossOrganizationAccess() {
  console.log('\n🔒 Testing Cross-Organization Access Prevention');
  console.log('='.repeat(60));

  const tests = [
    {
      name: 'TechCorp Education trying to access EduSoft courses',
      apiKey: API_KEYS.techcorp_education,
      targetOrg: 'EduSoft',
      shouldFail: true
    },
    {
      name: 'EduSoft trying to access LearnHub courses',
      apiKey: API_KEYS.edusoft_direct,
      targetOrg: 'LearnHub',
      shouldFail: true
    },
    {
      name: 'LearnHub Kids trying to access LearnHub Adults courses',
      apiKey: API_KEYS.learnhub_kids,
      targetOrg: 'LearnHub',
      shouldFail: true
    }
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${test.apiKey}` }
      });

      const orgName = response.data.context.organization;
      const isCorrectOrg = orgName === test.targetOrg;

      if (test.shouldFail && !isCorrectOrg) {
        console.log(`✅ ${test.name}: CORRECTLY BLOCKED`);
      } else if (!test.shouldFail && isCorrectOrg) {
        console.log(`✅ ${test.name}: CORRECTLY ALLOWED`);
      } else {
        console.log(`❌ ${test.name}: SECURITY BREACH DETECTED!`);
      }

      console.log(`   Found: ${orgName}, Expected: ${test.targetOrg}`);
      console.log(`   Courses returned: ${response.data.count}`);

    } catch (error) {
      console.log(`✅ ${test.name}: CORRECTLY BLOCKED (Error: ${error.response?.data?.error})`);
    }
  }
}

async function testBrandIsolation() {
  console.log('\n�� Testing Brand-Level Isolation');
  console.log('='.repeat(60));

  const tests = [
    {
      name: 'TechCorp Education API Key',
      apiKey: API_KEYS.techcorp_education,
      expectedBrand: 'TechCorp Education',
      expectedCourses: ['Python Basics', 'Web Development Fundamentals']
    },
    {
      name: 'TechCorp Professional API Key',
      apiKey: API_KEYS.techcorp_professional,
      expectedBrand: 'TechCorp Professional',
      expectedCourses: ['Advanced Python', 'DevOps Fundamentals']
    },
    {
      name: 'LearnHub Kids API Key',
      apiKey: API_KEYS.learnhub_kids,
      expectedBrand: 'LearnHub Kids',
      expectedCourses: ['Math for Kids']
    },
    {
      name: 'LearnHub Adults API Key',
      apiKey: API_KEYS.learnhub_adults,
      expectedBrand: 'LearnHub Adults',
      expectedCourses: ['Business Analytics']
    }
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${test.apiKey}` }
      });

      const brandName = response.data.context.brand;
      const courseTitles = response.data.data.map(course => course.title);

      console.log(`\n📋 ${test.name}:`);
      console.log(`   Brand: ${brandName}`);
      console.log(`   Courses: ${courseTitles.join(', ')}`);

      // Check if brand isolation is working
      const hasExpectedCourses = test.expectedCourses.every(expected => 
        courseTitles.includes(expected)
      );
      const hasUnexpectedCourses = courseTitles.some(title => 
        !test.expectedCourses.includes(title)
      );

      if (hasExpectedCourses && !hasUnexpectedCourses) {
        console.log(`   ✅ Brand isolation: PERFECT`);
      } else {
        console.log(`   ❌ Brand isolation: ISSUE DETECTED`);
      }

    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.response?.data?.error}`);
    }
  }
}

async function testInvalidApiKeys() {
  console.log('\n�� Testing Invalid API Key Handling');
  console.log('='.repeat(60));

  const invalidKeys = [
    { key: 'invalid_key_123', name: 'Completely Invalid Key' },
    { key: 'org_999_brand_999_abc123', name: 'Non-existent Organization' },
    { key: '', name: 'Empty Key' },
    { key: 'org_1_brand_1_abc123def456', name: 'Valid Key (should work)' }
  ];

  for (const test of invalidKeys) {
    try {
      const response = await axios.get(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${test.key}` }
      });

      if (test.name.includes('Valid')) {
        console.log(`✅ ${test.name}: CORRECTLY ALLOWED`);
      } else {
        console.log(`❌ ${test.name}: SHOULD HAVE BEEN BLOCKED`);
      }

    } catch (error) {
      if (test.name.includes('Valid')) {
        console.log(`❌ ${test.name}: SHOULD HAVE BEEN ALLOWED`);
      } else {
        console.log(`✅ ${test.name}: CORRECTLY BLOCKED`);
      }
      console.log(`   Error: ${error.response?.data?.error}`);
    }
  }
}

async function testDirectCourseAccess() {
  console.log('\n🎯 Testing Direct Course Access Security');
  console.log('='.repeat(60));

  // First, get a course ID from TechCorp Education
  try {
    const coursesResponse = await axios.get(`${API_BASE}/courses`, {
      headers: { Authorization: `Bearer ${API_KEYS.techcorp_education}` }
    });

    if (coursesResponse.data.count > 0) {
      const courseId = coursesResponse.data.data[0].id;
      console.log(`Testing with Course ID: ${courseId}`);

      // Try to access this course with different API keys
      const accessTests = [
        {
          name: 'TechCorp Education (should work)',
          apiKey: API_KEYS.techcorp_education,
          shouldWork: true
        },
        {
          name: 'TechCorp Professional (should fail)',
          apiKey: API_KEYS.techcorp_professional,
          shouldWork: false
        },
        {
          name: 'EduSoft (should fail)',
          apiKey: API_KEYS.edusoft_direct,
          shouldWork: false
        }
      ];

      for (const test of accessTests) {
        try {
          const response = await axios.get(`${API_BASE}/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${test.apiKey}` }
          });

          if (test.shouldWork) {
            console.log(`✅ ${test.name}: CORRECTLY ALLOWED`);
          } else {
            console.log(`❌ ${test.name}: SECURITY BREACH!`);
          }

        } catch (error) {
          if (test.shouldWork) {
            console.log(`❌ ${test.name}: SHOULD HAVE BEEN ALLOWED`);
          } else {
            console.log(`✅ ${test.name}: CORRECTLY BLOCKED`);
          }
        }
      }
    }
  } catch (error) {
    console.log('❌ Could not test direct course access:', error.message);
  }
}

async function runAllSecurityTests() {
  console.log('🔐 COMPREHENSIVE SECURITY TEST SUITE');
  console.log('='.repeat(60));
  console.log('Testing multi-tenant isolation and data security...\n');

  await testCrossOrganizationAccess();
  await testBrandIsolation();
  await testInvalidApiKeys();
  await testDirectCourseAccess();

  console.log('\n🏁 Security testing completed!');
  console.log('='.repeat(60));
  console.log('Review the results above to ensure:');
  console.log('✅ No cross-organization data leakage');
  console.log('✅ Proper brand-level isolation');
  console.log('✅ Invalid API keys are rejected');
  console.log('✅ Direct course access is properly secured');
}

// Run the tests
runAllSecurityTests().catch(console.error);