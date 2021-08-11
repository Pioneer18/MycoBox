const router = require('express').Router()
const viewRoutes = require('./view')

router.use('/', viewRoutes)

module.exports = router