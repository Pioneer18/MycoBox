/**
 * Sensors Controller
 */
const fs = require('fs')
const { PythonShell } = require('python-shell');
const {
    parse_th_data,
    parse_pt_data,
    parse_co2_data
} = require('../../services/sensors.service/sensors.service');
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../../python',
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
    PythonShell.run('co2/co2.py', options, function (err, reply) {
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
 * Set Environment Model - return readings of every sensor group
 */
const set_environment_model = () => {
    read_temp_humidity()
    read_precise_temp()
    read_scale()
    read_infrared()
    return
}

module.exports = {
    read_temp_humidity,
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    set_environment_model
}
