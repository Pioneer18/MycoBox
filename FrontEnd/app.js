var express = require('express');
var path = require('path');
var logger = require('morgan');

// Application Routers
const indexRouter = require('./routes/index');

// Server
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

// Mount Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount Application Routers
app.use('/', indexRouter);
//  app.use('/users', usersRouter);

module.exports = app;
