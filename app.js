const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

module.exports = app;