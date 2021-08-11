import {makeRequest} from './index'
const api = 'api_v1'

/**
 * GET: /api_v1/myco_box/environment_model
 * Returns all of the sensor readings, the current environment model
 */
 const readEnvironmentModel = () => {
    makeRequest('GET', `${api}/sensors_controller/read_environment_model`)
}

export {
    readEnvironmentModel
}