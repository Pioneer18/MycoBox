const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Application Routers
const indexRouter = require('./MycoBox/routes/index');


// Server
var app = express();

// Mount Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Application Routers
app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
