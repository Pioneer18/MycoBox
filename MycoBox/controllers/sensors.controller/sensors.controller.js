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
const read_temp_humidity = async () => {
    PythonShell.run('temp.humidity.py', options, function (err, reply) {
        if (err)
            throw err;
        console.log(reply)
        return reply;
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = async () => {
    PythonShell.run('temp.precise.py', options, function (err, reply) {
        if (err) throw err
        console.log(reply)
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
            console.log(reply)
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
    const temp_humidity = await read_temp_humidity()
    const temp_precise = await read_precise_temp()
    const co2 = await read_co2()
    console.log(JSON.parse(temp_humidity))
    console.log(temp_precise)
    console.log(co2)
}

module.exports = {
    read_temp_humidity,
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    set_environment_model
}
