/**
 * Send Controller AJAX Calls to the Backend Application
 */


const api = '/api_v1'

/**
 * POST: /api_v1/myco_box/start_process
 * @param {} config {proces: String, env: Object}
 * Starts a new session with the given configuration
 */
const newSession = (process, config) => {
    // create the XMLHTTP instance
    makeRequest('POST', `http://192.168.1.97:3000${api}/system_controller/start_process`, JSON.stringify({ process, config })) // add a content-type param
};

/**
 * GET: /api_v1/myco_box/environment_model
 * Returns all of the sensor readings, the current environment model
 */
const readEnvironmentModel = () => {
    makeRequest('GET', `http://192.168.1.97:3000${api}/sensors_controller/read_environment_model`)
}


const makeRequest = (method, url, data) => {
    // create the XMLHTTP instance for creating Ajax call
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Error: Cannot create an XMLHTTP instance');
        return false;
    }
    // Handle the HTTP Response
    httpRequest.onreadystatechange = () => {
        // process the server response here
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            // Everything is good, the response was received.
            if (httpRequest.status === 200) {
                // Perfect!
                console.log('Below is the backend http response:')
                // console.log(httpRequest.responseText)
                console.log(httpRequest.response)
                console.log(JSON.parse(httpRequest.response))
            } else {
                // There was a problem with the request.
                // For example, the response may have a 404 (Not Found)
                // or 500 (Internal Server Error) response code.
                console.log('Some Kinda Error??')
                return
            }
        } else {
            // Not ready yet.
            console.log('Not Ready yet?')
            return
        }
    }
    httpRequest.open(method, url, true); // async true
    httpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://192.168.1.97:3000/');
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(data);
}

export {
    newSession,
    readEnvironmentModel
}
