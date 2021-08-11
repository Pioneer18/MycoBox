const router = require('express').Router()
const viewRoutes = require('./view')

router.use('/', viewRoutes)
router.use('/api_v1',apiRoutes)

module.exports = router