const axios = require('axios');
const { createTestSetup } = require('./src/tests/utils/testHelpers');

const API_BASE = 'http://localhost:3000/api';

class APIValidator {
  constructor() {
    this.testSetup = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async setup() {
    try {
      console.log('🔧 Setting up test environment...');
      this.testSetup = await createTestSetup();
      console.log('✅ Test environment ready');
    } catch (error) {
      console.error('❌ Failed to setup test environment:', error);
      throw error;
    }
  }

  async runTest(name, testFn) {
    try {
      console.log(`\n🧪 Testing: ${name}`);
      await testFn();
      console.log(`✅ ${name} - PASSED`);
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ ${name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testServerHealth() {
    const response = await axios.get('http://localhost:3000/');
    if (response.status !== 200) {
      throw new Error('Server not responding');
    }
    if (!response.data.message.includes('Organization Access API')) {
      throw new Error('Invalid server response');
    }
  }

  async testSwaggerDocs() {
    const response = await axios.get('http://localhost:3000/api-docs/');
    if (response.status !== 200) {
      throw new Error('Swagger docs not accessible');
    }
  }

  async testUserRegistration() {
    const userData = {
      name: 'API Test User',
      email: 'apitest@example.com',
      password: 'ApiTest123!',
      firstName: 'API',
      lastName: 'Test',
      organizationId: this.testSetup.organization.id
    };

    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    
    if (response.status !== 201) {
      throw new Error('Registration failed');
    }
    
    if (!response.data.success || !response.data.data.tokens.accessToken) {
      throw new Error('Invalid registration response');
    }
  }

  async testUserLogin() {
    const loginData = {
      email: this.testSetup.user.email,
      password: 'TestPassword123!'
    };

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    
    if (response.status !== 200) {
      throw new Error('Login failed');
    }
    
    if (!response.data.success || !response.data.data.tokens.accessToken) {
      throw new Error('Invalid login response');
    }
  }

  async testCourseCRUD() {
    // Create course
    const courseData = {
      title: 'API Validation Course',
      description: 'Course for API validation testing',
      content: 'This course content is for API validation testing purposes',
      brandId: this.testSetup.brand.id,
      status: 'draft'
    };

    const createResponse = await axios.post(
      `${API_BASE}/courses`,
      courseData,
      { headers: { Authorization: `Bearer ${this.testSetup.tokens.accessToken}` } }
    );

    if (createResponse.status !== 201) {
      throw new Error('Course creation failed');
    }

    const courseId = createResponse.data.data.id;

    // Update course
    const updateData = { status: 'published' };
    const updateResponse = await axios.put(
      `${API_BASE}/courses/${courseId}`,
      updateData,
      { headers: { Authorization: `Bearer ${this.testSetup.tokens.accessToken}` } }
    );

    if (updateResponse.status !== 200) {
      throw new Error('Course update failed');
    }

    // Get course
    const getResponse = await axios.get(
      `${API_BASE}/courses/${courseId}`,
      { headers: { Authorization: `Bearer ${this.testSetup.apiKey.key}` } }
    );

    if (getResponse.status !== 200) {
      throw new Error('Course retrieval failed');
    }

    // Delete course
    const deleteResponse = await axios.delete(
      `${API_BASE}/courses/${courseId}`,
      { headers: { Authorization: `Bearer ${this.testSetup.tokens.accessToken}` } }
    );

    if (deleteResponse.status !== 200) {
      throw new Error('Course deletion failed');
    }
  }

  async testUserProfile() {
    const response = await axios.get(
      `${API_BASE}/users/profile`,
      { headers: { Authorization: `Bearer ${this.testSetup.tokens.accessToken}` } }
    );

    if (response.status !== 200) {
      throw new Error('Profile retrieval failed');
    }

    if (!response.data.success || !response.data.data.user) {
      throw new Error('Invalid profile response');
    }
  }

  async testCourseSearch() {
    const response = await axios.get(
      `${API_BASE}/courses/search?q=test`,
      { headers: { Authorization: `Bearer ${this.testSetup.apiKey.key}` } }
    );

    if (response.status !== 200) {
      throw new Error('Course search failed');
    }

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error('Invalid search response');
    }
  }

  async testMultiTenantIsolation() {
    // Create another organization
    const { createTestOrganization, createTestApiKey } = require('./src/tests/utils/testHelpers');
    const otherOrg = await createTestOrganization({ name: 'Isolation Test Org' });
    const otherApiKey = await createTestApiKey(otherOrg.id);

    // Try to access courses from other organization
    const response = await axios.get(
      `${API_BASE}/courses`,
      { headers: { Authorization: `Bearer ${otherApiKey.key}` } }
    );

    if (response.status !== 200) {
      throw new Error('API key authentication failed');
    }

    // Should not see courses from testSetup organization
    if (response.data.data.length > 0) {
      throw new Error('Multi-tenant isolation failed - cross-organization data leakage');
    }
  }

  async testErrorHandling() {
    // Test invalid JWT
    try {
      await axios.get(
        `${API_BASE}/users/profile`,
        { headers: { Authorization: 'Bearer invalid-token' } }
      );
      throw new Error('Should have failed with invalid JWT');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error('Invalid JWT error handling failed');
      }
    }

    // Test invalid API key
    try {
      await axios.get(
        `${API_BASE}/courses`,
        { headers: { Authorization: 'Bearer invalid-api-key' } }
      );
      throw new Error('Should have failed with invalid API key');
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error('Invalid API key error handling failed');
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Validation');
    console.log('='.repeat(50));

    await this.setup();

    await this.runTest('Server Health Check', () => this.testServerHealth());
    await this.runTest('Swagger Documentation', () => this.testSwaggerDocs());
    await this.runTest('User Registration', () => this.testUserRegistration());
    await this.runTest('User Login', () => this.testUserLogin());
    await this.runTest('Course CRUD Operations', () => this.testCourseCRUD());
    await this.runTest('User Profile Management', () => this.testUserProfile());
    await this.runTest('Course Search', () => this.testCourseSearch());
    await this.runTest('Multi-tenant Isolation', () => this.testMultiTenantIsolation());
    await this.runTest('Error Handling', () => this.testErrorHandling());

    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 API Validation Results');
    console.log('='.repeat(50));
    
    this.results.tests.forEach(test => {
      const status = test.status === 'PASSED' ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total: ${this.results.passed + this.results.failed}`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All API validations passed!');
      console.log('🚀 Your API is ready for production!');
    } else {
      console.log('\n💥 Some validations failed. Please check the errors above.');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new APIValidator();
  validator.runAllTests().catch(console.error);
}

module.exports = APIValidator;
