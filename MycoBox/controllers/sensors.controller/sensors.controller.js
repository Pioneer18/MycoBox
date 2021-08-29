/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const { get, set_environment_state } = require('../../globals/globals')
const {
    parse_th_data,
    parse_pt_data,
    parse_co2_data
} = require('../../services/sensors.service/sensors.service');
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: 'MycoBox/python',
};

/**
 * DHT22 Temperature & humidity readings - internal & external
 * @param {Array} reply [h1,h2,h3,t1,t2,t3]
 */
const read_temp_humidity = () => {
    return new Promise((resolve, reject) => {
        console.log('Reading the Temp & Humidity')
        PythonShell.run('temp.humidity.py', options, function (err, reply) {
            if (err) reject(err)
            parse_th_data(reply) // validate and load into env_state
                .then(resolve())
        })
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = () => {
    return new Promise((resolve, reject) => {
        console.log("Reading the Precise Temp")
        PythonShell.run('temp.precise.py', options, function (err, reply) {
            if (err) reject(err)
            parse_pt_data(reply)
                .then(resolve())
        })
    })
}

/**
 * CO2 readings from COZIR-A sensor
 * @param {Array} reply ["CO2 PPM = 536.0"]
 */
const read_co2 = () => {
    return new Promise((resolve, reject) => {
        console.log('Reading the CO2')
        PythonShell.run('co2.py', options, function (err, reply) {
            if (err) reject(err)
            parse_co2_data(reply)
                .then(resolve())
        });
    })
}

/**
 * Weight readings from Esp8266 scale ** HTTP or Serial request
 * @param {Array} reply
 */
const read_scale = () => {
    return new Promise((resolve, reject) => {
        console.log('Reading the Scale')
        resolve(['weight: 45lbs'])
    })
}

/**
 * Infrared Temp readings - grow bags
 * @param {Array} reply
 */
const read_infrared = () => {
    return new Promise((resolve, reject) => {
        resolve(["irTemp: 24C"])
    })
}

const set_timestamp = () => {
    return new Promise((resolve, reject) => {
        console.log('Setting the timestamp');
        console.log(typeof Date.now())
        set_environment_state('timestamp', Date.now())
            .then(resolve())
    })
}

/**
 * Set Environment State
 */
const initialize_environment_state = () => {
    return new Promise((resolve) => {
        console.log("METHOD CALL: initialize_environment_state")
        read_co2()
            .then(read_temp_humidity())
            .then(read_precise_temp())
            .then(read_scale())
            .then(read_infrared())
            .then(set_timestamp())
            .then(resolve(true))
            .catch(err => console.log(`Error Caught: initialize_environment: ${err}`))
    })
}

/**
 * Read Environment Model
 */
const read_environment_state = () => {
    new Promise((resolve) => {
        get('environment_state')
            .then(env_state => {
                return resolve({
                    timestamp: env_state.timestamp,
                    internal_temp_1: env_state.internal_temp_1,
                    internal_temp_2: env_state.internal_temp_2,
                    internal_temp_3: env_state.internal_temp_3,
                    precise_temp_c: env_state.precise_temp_c,
                    precise_temp_f: env_state.precise_temp_f,
                    external_temp: env_state.external_temp,
                    internal_humidity_1: env_state.internal_humidity_1,
                    internal_humidity_2: env_state.internal_humidity_2,
                    internal_humidity_3: env_state.internal_humidity_3,
                    external_humidity: env_state.external_humidity,
                    co2: env_state.co2,
                    weight: env_state.weight
                })
            })
    })
}

module.exports = {
    read_temp_humidity,
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    initialize_environment_state,
    read_environment_state
}
