var express = require('express');
var router = express.Router();

/* Start Process */
router.post('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send('Hello from MycoBox');
});

module.exports = router;
