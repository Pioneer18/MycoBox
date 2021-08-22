const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: './myco.env' });

// Application Routers
const indexRouter = require('./MycoBox/routes/index');

// Server
var app = express();

// Mount Middleware
app.use(cors({ origin: globals.BASE_URL })); // allow all cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Application Routers
app.use('/', indexRouter);
console.log("MycoServer has started")
module.exports = app;
