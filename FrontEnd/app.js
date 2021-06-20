 var express = require('express');
 var path = require('path');
 var logger = require('morgan');
 
 // Application Routers
const indexRouter = require('./routes/index');
 
 // Server
 var app = express();
 
 // Mount Middleware
 app.use(logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, '/FrontEnd/public')));
 
 // Mount Application Routers
  app.use('/', indexRouter);
//  app.use('/users', usersRouter);
 
 module.exports = app;
 