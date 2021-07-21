const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { createLogger, format, transports } = require('winston')
require('dotenv').config({ path: './myco.env' });

// Application Routers
const indexRouter = require('./MycoBox/routes/index');

// Winston Logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'sensor-logger' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
        new transports.File({ filename: 'sensors.log' })
    ]
});
// Allows JSON logging
logger.log({
    level: 'info',
    message: 'Pass an object and this works',
    additional: 'properties',
    are: 'passed along'
  });
  
  logger.info({
    message: 'Use a helper method if you want',
    additional: 'properties',
    are: 'passed along'
  });


// Server
var app = express();

// Mount Middleware
app.use(cors({ origin: process.env.BASE_URL })); // allow all cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Application Routers
app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
