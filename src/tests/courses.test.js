const request = require('supertest');
const app = require('../app');
const { createTestSetup, createTestCourse } = require('./utils/testHelpers');

describe('Course Management Endpoints', () => {
  let testSetup;

  beforeAll(async () => {
    testSetup = await createTestSetup();
  });

  describe('GET /api/courses (API Key Auth)', () => {
    it('should get courses with valid API key', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${testSetup.apiKey.key}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.context.organization).toBe(testSetup.organization.name);
    });

    it('should fail without API key', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/courses (JWT Auth)', () => {
    it('should create course with valid JWT token', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'Test course description',
        content: 'Test course content with more than 20 characters',
        brandId: testSetup.brand.id,
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(courseData.title);
      expect(response.body.data.status).toBe(courseData.status);
    });

    it('should fail with invalid course data', async () => {
      const courseData = {
        title: 'AB', // Too short
        description: 'Short' // Too short
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(courseData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail without JWT token', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'Test course description'
      };

      const response = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update course successfully', async () => {
      const course = await createTestCourse(testSetup.organization.id, {
        brandId: testSetup.brand.id,
        createdBy: testSetup.user.id,
        updatedBy: testSetup.user.id
      });

      const updateData = {
        title: 'Updated Course Title',
        status: 'published'
      };

      const response = await request(app)
        .put(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should fail to update non-existent course', async () => {
      const updateData = {
        title: 'Updated Course Title'
      };

      const response = await request(app)
        .put('/api/courses/99999')
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete course successfully', async () => {
      const course = await createTestCourse(testSetup.organization.id, {
        brandId: testSetup.brand.id,
        createdBy: testSetup.user.id,
        updatedBy: testSetup.user.id
      });

      const response = await request(app)
        .delete(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${testSetup.tokens.accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(course.id);
    });
  });

  describe('GET /api/courses/search', () => {
    it('should search courses successfully', async () => {
      await createTestCourse(testSetup.organization.id, {
        title: 'Python Programming',
        brandId: testSetup.brand.id
      });

      const response = await request(app)
        .get('/api/courses/search?q=python')
        .set('Authorization', `Bearer ${testSetup.apiKey.key}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should fail without search query', async () => {
      const response = await request(app)
        .get('/api/courses/search')
        .set('Authorization', `Bearer ${testSetup.apiKey.key}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
