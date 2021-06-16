var express = require('express');
const { path } = require('../app');
var router = express.Router();

/* GET home page. */
// just place the name of the view you want to render
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

module.exports = router;
