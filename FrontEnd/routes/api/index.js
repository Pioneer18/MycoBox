/**
 * API Routes
 */
const router = require('express').Router()
const api = '/api_v1'

/** 
 * Dashboard: New Session
*/
router.post(`${api}/system_controller/start_process`,async () => {
    try {

    } catch (err) {
        console.log(`Error: ${err}`)
    }
})

/** 
 * Dashboard: read Current Environment Model
*/
router.get(`${api}/sensors_controller/read_environment_model`,async () => {
    try {

    } catch (err) {
        console.log(`Error: ${err}`)
    }
})
