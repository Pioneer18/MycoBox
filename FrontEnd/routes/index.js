const router = require('express').Router()
const viewRoutes = require('./view')
const apiRoutes = require('./api')

router.use('/', viewRoutes)
router.use('/api_v1',apiRoutes)

module.exports = router