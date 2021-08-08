var express = require('express');
var router = express.Router();
/**
 * GET Home page
 */


/** 
 * GET Configuration page. 
 */
router.get('/', function (req, res, next) {
  res.render('configuration/configuration')
});

/**
 * GET Dashboard page
 */
router.get('/', function(req, res, next) {
  res.render('dashboard/dashboard')
})

module.exports = router;
