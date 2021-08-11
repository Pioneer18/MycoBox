import { makeRequest } from "./index";

const api = '/api_v1'

/**
 * POST: /api_v1/myco_box/start_process
 * @param {} config {proces: String, env: Object}
 * Starts a new session with the given configuration
 */
const newSession = (process, config) => {
    // create the XMLHTTP instance
    makeRequest('POST', `${api}/system_controller/start_session`, JSON.stringify({ process, config })) // add a content-type param
};

export {
    newSession
}