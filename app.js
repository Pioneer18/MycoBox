var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Application Routers


// Server
var app = express();

// Mount Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Application Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
