const request = require('supertest');
const app = require('../app');
const { createTestSetup } = require('./utils/testHelpers');

describe('API Integration Tests', () => {
  let testSetup;

  beforeAll(async () => {
    testSetup = await createTestSetup();
  });

  describe('Complete User Flow', () => {
    it('should complete full user registration and course creation flow', async () => {
      // 1. Register new user
      const userData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'IntegrationPass123!',
        firstName: 'Integration',
        lastName: 'Test',
        organizationId: testSetup.organization.id
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const { accessToken } = registerResponse.body.data.tokens;

      // 2. Get user profile
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body.data.user.email).toBe(userData.email);

      // 3. Create a course
      const courseData = {
        title: 'Integration Test Course',
        description: 'This is a test course for integration testing',
        content: 'This course content is for integration testing purposes and contains more than 20 characters',
        brandId: testSetup.brand.id,
        status: 'draft'
      };

      const courseResponse = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(courseData)
        .expect(201);

      expect(courseResponse.body.success).toBe(true);
      expect(courseResponse.body.data.title).toBe(courseData.title);

      // 4. Update the course
      const updateData = {
        status: 'published'
      };

      const updateResponse = await request(app)
        .put(`/api/courses/${courseResponse.body.data.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.data.status).toBe('published');

      // 5. Search for the course using API key
      const searchResponse = await request(app)
        .get('/api/courses/search?q=integration')
        .set('Authorization', `Bearer ${testSetup.apiKey.key}`)
        .expect(200);

      expect(searchResponse.body.success).toBe(true);
      expect(searchResponse.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Multi-tenant Isolation', () => {
    it('should maintain data isolation between organizations', async () => {
      // Create another organization
      const { createTestOrganization, createTestApiKey } = require('./utils/testHelpers');
      const otherOrg = await createTestOrganization({ name: 'Other Organization' });
      const otherApiKey = await createTestApiKey(otherOrg.id);

      // Try to access courses from other organization
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${otherApiKey.key}`)
        .expect(200);

      // Should not see courses from testSetup organization
      expect(response.body.data.length).toBe(0);
      expect(response.body.context.organization).toBe('Other Organization');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JWT tokens gracefully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired token');
    });

    it('should handle invalid API keys gracefully', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', 'Bearer invalid-api-key')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or inactive API key');
    });

    it('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ invalid: 'data' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
