var express = require('express');
var router = express.Router();

/* GET home page. */
// just place the name of the view you want to render
router.get('/', function(req, res, next) {
  res.render('test');
});

module.exports = router;
