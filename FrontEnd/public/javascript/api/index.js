/**
 * Send Controller AJAX Calls to the Backend Application
 */
class FrontEndApi {
    constructor() {

        this.api = '/api_v1';

        /**
         * POST: /api_v1/myco_box/start_process
         * @param {} config {proces: String, env: Object}
         * Starts a new session with the given configuration
         */
        this.newSession = (process, config) => {
            // create the XMLHTTP instance
            this.makeRequest('POST',`http://192.168.1.97:3000${this.api}/system_controller/start_process`, JSON.stringify({process, config})) // add a content-type param
        };

        /**
         * GET: /api_v1/myco_box/environment_model
         * Returns all of the sensor readings, the current environment model
         */
        this.environmentModel = () => {
            this.makeRequest('GET', `http://192.168.1.97:3000${this.api}/sensors_controller/environment_model`)
        }

        this.makeRequest = (method, url, data) => {
            // create the XMLHTTP instance
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
                        console.log(httpRequest.responseText);
                    } else {
                        // There was a problem with the request.
                        // For example, the response may have a 404 (Not Found)
                        // or 500 (Internal Server Error) response code.
                    }
                } else {
                    // Not ready yet.
                }
            }
            httpRequest.open(method, url, true); // async true
            httpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
            httpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://192.168.1.97:3000/'); 
            httpRequest.setRequestHeader('Content-Type', 'application/json'); 
            httpRequest.send(data);
        }
    }
}

export {FrontEndApi};