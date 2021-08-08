const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

// Application Routers
const indexRouter = require('./routes/index');

// Server
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Mount Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount Application Routers
app.use('/', indexRouter);
//  app.use('/users', usersRouter);

module.exports = app;
