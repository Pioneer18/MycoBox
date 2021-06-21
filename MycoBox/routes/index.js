var express = require('express');
var router = express.Router();

/* Start Process */
router.post('/', function(req, res, next) {
  res.send(JSON.stringify({msg: 'response from mycobox'}));
});

module.exports = router;
