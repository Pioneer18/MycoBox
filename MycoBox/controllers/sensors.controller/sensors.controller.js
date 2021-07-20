/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const { environmentModel } = require('../../globals/globals');
const { parse_sensor_data, validate_sensor_data } = require('../../utilities');
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../../python',
};

/**
 * DHT22 Temperature & humidity readings - internal & external
 * @param {Array} reply [h1,h2,h3,t1,t2,t3]
 */
const read_temp_humidity = async () => {
    PythonShell.run('temp.humidity.py', options, function (err, reply) {
        if (err) throw err;
        parse_sensor_data(reply)
        //validate_sensor_data(parsed)
        //console.log(parsed)
        // map values to the environment model
        return
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = async () => {
    PythonShell.run('temp.precise.py', options, function (err, reply) {
        if (err) throw err
        const split = parse_sensor_data(reply)
        console.log(split[1])
        console.log(split[3])
        return reply
    })
}

/**
 * CO2 readings from COZIR-A sensor
 * @param {Array} reply ["CO2 PPM = 536.0"]
 */
const read_co2 = async () => {
    PythonShell.run('co2/co2.py', options, function (err, reply) {
        if (err)
            throw err;
            const split = parse_sensor_data(reply)
            console.log(split[1])
            // set environment model utility

        return reply;
    });
}

/**
 * Weight readings from Esp8266 scale ** HTTP or Serial request
 * @param {Array} reply
 */
const read_scale = async () => {
    return ['weight: 45lbs']
}

/**
 * Infrared Temp readings - grow bags
 * @param {Array} reply
 */
const read_infrared = async () => {
    return ["irTemp: 24C"]
}

/**
 * Set Environment Model - return readings of every sensor group
 */
const set_environment_model = async () => {
    await read_temp_humidity()
    await read_precise_temp()
    await read_co2()
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
