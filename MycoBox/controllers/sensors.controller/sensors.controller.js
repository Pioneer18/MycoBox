/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const {globals} =require('../../globals/globals')
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

/**
 * Set Environment Model
 */
const set_environment_state = async () => {
    console.log('MycoBox is setting the environment model')
    read_co2()
    read_temp_humidity()
    read_precise_temp()
    read_scale()
    read_infrared()
    return
}

/**
 * Read Environment Model
 */
const read_environment_model = async () => {
    console.log('Getting Started Reading the EnvModel Now')
    const envmodel = {
        internal_temp_1: globals.internal_temp_1,
        internal_temp_2: globals.internal_temp_2,
        internal_temp_3: globals.internal_temp_3,
        precise_temp_c: globals.precise_temp_c,
        precise_temp_f: globals.precise_temp_f,
        external_temp: globals.external_temp,
        internal_humidity_1: globals.internal_humidity_1,
        internal_humidity_2: globals.internal_humidity_2,
        internal_humidity_3: globals.internal_humidity_3,
        external_humidity: globals.external_humidity,
        co2: globals.co2,
        weight: globals.weight
    }
    console.log('Here is the Environment Model to be returned: ')
    console.log(envmodel)
    return await envmodel;
}

module.exports = {
    read_temp_humidity,
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    set_environment_state,
    read_environment_model
}
