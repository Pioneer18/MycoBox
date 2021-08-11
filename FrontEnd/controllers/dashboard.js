/**
 * Handle HTTP Requests for the Dashboard
 */
const axios = require('axios')


module.exports = {
    test: () => {
        console.log('hey from the other Dashboard controller')
        return 'hey from the other Dashboard controller'
    }
}