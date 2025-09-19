const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');
const orgRoutes = require('./routes/orgRoutes');
const { swaggerUi, swaggerUiOptions, swaggerDocument } = require('./config/swagger');
const { version } = require('os');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ 
        message: 'Organization Access API is running',
        version: '2.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            courses: '/api/courses',
            organization: '/api/org/info'
        }
    });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/org', orgRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const server = `Server is running on port ${PORT}`;
    console.log(server);
});

module.exports = app;