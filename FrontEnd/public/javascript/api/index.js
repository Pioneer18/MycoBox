/**
 * Route Controller AJAX Calls to the Backend Application
 */
class FrontEndApi {
    constructor() {
        let self = this;

        /**
         * POST: /api_v1/myco_box/start_process
         * @param {} config {proces: String, env: Object}
         */
        this.starProcess = function (config) {
            // create the XMLHTTP instance
            httpRequest = new XMLHttpRequest();

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
            httpRequest.setRequestHeader('Content-Type', 'application/json'); 
            httpRequest.open('GET','test.html', true); // async true
            httpRequest.send();
        };

        this.returnResponse = () => {
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
    }
}

export {FrontEndApi};