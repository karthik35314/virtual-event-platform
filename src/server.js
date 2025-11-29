const express = require('express');
const authRoutes = require('../routes/authRoutes.js');
const eventRoutes = require('../routes/eventRoutes.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use(errorHandler);

module.exports = app;
