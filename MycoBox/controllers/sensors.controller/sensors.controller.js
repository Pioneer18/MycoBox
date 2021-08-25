/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const {get, set_environment_state} =require('../../globals/globals')
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
    PythonShell.run('temp.humidity.py', options, function (err, reply) {
        if (err) throw err;
        parse_th_data(reply) // validate and load into env model
        return
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = () => {
    PythonShell.run('temp.precise.py', options, function (err, reply) {
        if (err) throw err
        parse_pt_data(reply)
        return
    })
}

/**
 * CO2 readings from COZIR-A sensor
 * @param {Array} reply ["CO2 PPM = 536.0"]
 */
const read_co2 = () => {
    PythonShell.run('co2.py', options, function (err, reply) {
        if (err) throw err;
        parse_co2_data(reply)
        return
    });
}

/**
 * Weight readings from Esp8266 scale ** HTTP or Serial request
 * @param {Array} reply
 */
const read_scale = () => {
    return ['weight: 45lbs']
}

/**
 * Infrared Temp readings - grow bags
 * @param {Array} reply
 */
const read_infrared = () => {
    return ["irTemp: 24C"]
}

const set_timestamp = async () => {
    set_environment_state('timestamp', Date.now())
}

/**
 * Set Environment State
 */
const initialize_environment_state = () => {
    read_co2()
    read_temp_humidity()
    read_precise_temp()
    read_scale() // make this real
    read_infrared() // make this real
    set_timestamp() 
    return
}

/**
 * Read Environment Model
 */
const read_environment_state = async () => {
    const data = await get('environment_state');
    const env_state = await {
        timestamp: data.timestamp,
        internal_temp_1: data.internal_temp_1,
        internal_temp_2: data.internal_temp_2,
        internal_temp_3: data.internal_temp_3,
        precise_temp_c: data.precise_temp_c,
        precise_temp_f: data.precise_temp_f,
        external_temp: data.external_temp,
        internal_humidity_1: data.internal_humidity_1,
        internal_humidity_2: data.internal_humidity_2,
        internal_humidity_3: data.internal_humidity_3,
        external_humidity: data.external_humidity,
        co2: data.co2,
        weight: data.weight
    }
    return env_state;
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
