/**
 * API Routes
 */
const configRouter = require('./configuration.routes.js')
const dashboardRouter = require('./dashboard.routes.js')
const router = require('express').Router()

router.use('/', configRouter)
router.use('/', dashboardRouter)

module.exports = router