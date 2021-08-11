const router = require('express').Router()


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
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard/dashboard')
})

module.exports = router;
