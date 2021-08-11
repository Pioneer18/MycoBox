const router = require('express').Router()
const viewRoutes = require('./view')
// apiRoutes

router.use(viewRoutes)
// use apiRoutes

module.exports = router