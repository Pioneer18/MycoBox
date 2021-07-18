/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const { environmentModel } = require('../../globals/globals');
const { validate_set_environment } = require('../../utilities');
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../../python',
    // args: ['value1', 'value2', 'value3']
};


/**
 * DHT22 Temperature & humidity readings - internal & external
 * @param {Array} reply []
 */
const read_temp_humidity = () => {
    PythonShell.run('temp.humidity.py', options, function (err, reply) {
        if (err) throw err
        console.log('reply: %j', reply)
        return reply
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = () => {
    PythonShell.run('temp.precise.py', options, function (err, reply) {
        if (err) throw err
        console.log('reply: %j', reply)
        return reply
    })
}

/**
 * CO2 readings from COZIR-A sensor
 * @param {Array} reply ["CO2 PPM = 536.0"]
 */
const read_co2 = () => {
    PythonShell.run('co2.py', options, function (err, reply) {
        if (err) throw err
        console.log('reply: %j', reply)
        return reply
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
    const temp_humidity = read_temp_humidity()
    const temp_precise = read_precise_temp()
    const co2 = read_co2()
    const weight = read_scale()
    const irTemp = read_infrared()
    // validate the results
    validate_set_environment(temp_humidity,temp_precise, co2, weight, irTemp)
    // map results to the global object
    return {
        "Temperature_Humidity": temp_humidity,
        "Temperature_Precise": temp_precise,
        "CO2": co2,
    }
}

module.exports = {
    read_temp_humidity,
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    set_environment_model
}
