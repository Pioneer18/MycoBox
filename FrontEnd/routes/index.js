var express = require('express');
var path = require('path');
var router = express.Router();

const rootPath = "/home/pi/RootCulture/FrontEnd/public/javascript/views"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(rootPath + "configuration.html");
});

module.exports = router;
