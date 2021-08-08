const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: './myco.env' });
console.log("Hello from MycoBox Server")
// Application Routers
const indexRouter = require('./MycoBox/routes/index');
console.log('Required Index Router')
// Server
var app = express();

// Mount Middleware
app.use(cors({ origin: process.env.BASE_URL })); // allow all cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.log("About to use IndexRouter")
// Mount Application Routers
app.use('/', indexRouter);
// app.use('/users', usersRouter);
console.log("MycoServer Seems to Have Started")
module.exports = app;
