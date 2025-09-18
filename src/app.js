const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');
const orgRoutes = require('./routes/orgRoutes');
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
        version: '1.0.0',
        endpoints: {
            courses: '/api/courses',
            organization: '/api/org/info'
        }
    });
});

app.use('/api/courses', courseRoutes);
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