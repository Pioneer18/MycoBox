
const api = 'api_v1'

/**
 * GET: /api_v1/myco_box/environment_model
 * Returns all of the sensor readings, the current environment model 
 */
const readEnvironmentModel = async () => {
    // makeRequest('GET', `http://192.168.1.97:3000/${api}/sensors_controller/read_environment_state`)
    const response = await fetch(`http://192.168.1.97:3000/${api}/sensors_controller/read_environment_state`, {
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
