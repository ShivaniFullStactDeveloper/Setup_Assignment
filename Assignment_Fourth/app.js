const express = require('express');
const routes = require('./routes/index');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Parse JSON request body
app.use(express.json());

// Register API routes
app.use('/api', routes);

// Global error handler
app.use(errorMiddleware)

module.exports = app;
