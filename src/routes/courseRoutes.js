const express = require('express');
const { authenticateApiKey } = require('../middleware/auth');
const { getCourses, getCourseById, searchCourses, createCourse, updateCourse, deleteCourse, restoreCourse, getCoursesByStatus } = require('../controllers/courseController');
const { authenticateJWT } = require('../middleware/jwtAuth');
const { validate, validateQuery, courseSchemas } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateApiKey);

// You can check these routes on GET /api/courses
router.get('/', getCourses);
router.get('/status/:status', getCoursesByStatus)
router.get('/search',validateQuery(courseSchemas.search), searchCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateJWT, validate(courseSchemas.create), createCourse);
router.put('/:id', authenticateJWT, validate(courseSchemas.update), updateCourse);
router.delete('/:id', authenticateJWT, deleteCourse);
router.post('/:id/restore', authenticateJWT, restoreCourse);

module.exports = router;