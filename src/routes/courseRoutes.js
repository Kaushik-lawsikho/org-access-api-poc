const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
const { getCourses, getCourseById, searchCourses } = require('../controllers/courseController');

router.use(authenticateApiKey);

// You can check these routes on GET /api/courses
router.get('/', getCourses);

router.get('/search', searchCourses);

router.get('/:id', getCourseById);

module.exports = router;