var express = require('express');
var router = express.Router();

/* Start Process */
router.post('/', function(req, res, next) {
  res.send({msg: 'Hello from MycoBox'});
});

module.exports = router;
