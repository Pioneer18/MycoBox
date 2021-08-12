
const api = 'api_v1'

/**
 * GET: /api_v1/myco_box/environment_model
 * Returns all of the sensor readings, the current environment model 
 */
const readEnvironmentModel = async () => {
    // makeRequest('GET', `http://192.168.1.97:3000/${api}/sensors_controller/read_environment_model`)
    const response = await fetch(`http://192.168.1.97:3000/${api}/sensors_controller/read_environment_model`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://192.168.1.97:3000/',
            'Access-Control-Allow-Headers': '*'
        }
    })
    console.log(response.json) 
    return response.json()

}

export {
    readEnvironmentModel
}

// .then(response => {
//     results = response.json()
//     console.log('Here are the results')
//     console.log(results)
// })
// .then(data => console.log(data))

// const makeRequest = (method, url, data) => {
//     // create the XMLHTTP instance for creating Ajax call
//     let httpRequest = new XMLHttpRequest();
//     if (!httpRequest) {
//         alert('Error: Cannot create an XMLHTTP instance');
//         return false;
//     }
//     // Handle the HTTP Response
//     httpRequest.onreadystatechange = () => {
//         // process the server response here
//         if (httpRequest.readyState === XMLHttpRequest.DONE) {
//             // Everything is good, the response was received.
//             if (httpRequest.status === 200) {
//                 // Perfect!
//                 console.log('Below is the backend http response:')
//                 // console.log(httpRequest.responseText)
//                 console.log(httpRequest.response)
//                 console.log(JSON.stringify(httpRequest.response))
//                 console.log(JSON.stringify(httpRequest.responseText))
//             } else {
//                 // There was a problem with the request.
//                 // For example, the response may have a 404 (Not Found)
//                 // or 500 (Internal Server Error) response code.
//                 console.log('Some Kinda Error??')
//                 return
//             }
//         } else {
//             // Not ready yet.
//             console.log('Not Ready yet?')
//             return
//         }
//     }
//     httpRequest.open(method, url, true); // async true
//     httpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
//     httpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://192.168.1.97:3000/');
//     httpRequest.setRequestHeader('Content-Type', 'application/json');
//     httpRequest.send(data);
// }