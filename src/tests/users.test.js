const request = require('supertest');
const app = require('../app');
const { createTestSetup, createTestUser } = require('./utils/testHelpers');

describe('User Management Endpoints', () => {
  let testSetup;

  beforeAll(async () => {
    testSetup = await createTestSetup();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testSetup.user.email);
    });

    it('should fail without JWT token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+9876543210'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      expect(response.body.data.user.lastName).toBe(updateData.lastName);
    });

    it('should fail with invalid phone number', async () => {
      const updateData = {
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/change-password', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'TestPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!'
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail with wrong current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!'
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with mismatched passwords', async () => {
      const passwordData = {
        currentPassword: 'TestPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!'
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/dashboard', () => {
    it('should get dashboard data successfully', async () => {
      const response = await request(app)
        .get('/api/users/dashboard')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('stats');
      expect(response.body.data).toHaveProperty('recentCreated');
      expect(response.body.data).toHaveProperty('recentUpdated');
    });
  });

  describe('GET /api/users/search', () => {
    it('should search users successfully', async () => {
      // Create another user in the same organization
      await createTestUser(testSetup.organization.id, {
        email: 'another@example.com'
      });

      const response = await request(app)
        .get('/api/users/search?q=another')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
