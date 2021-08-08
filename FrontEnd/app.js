const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();
console.log('Hello from Frontend App')
// Application Routers
const indexRouter = require('./routes/index');
console.log('Required Frontend Routes?')
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
console.log('About to use Frontend IndexRouter')
// Mount Application Routers
app.use('/', indexRouter);
//  app.use('/users', usersRouter);
console.log('Fronten Routes Mounted')
module.exports = app;
