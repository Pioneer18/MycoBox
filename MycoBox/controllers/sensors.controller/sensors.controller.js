/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
// const { environmentModel } = require('../../globals/globals');
const {
    parse_th_data,
    validate_sensor_data,
    parse_pt_data,
    parse_co2_data
} = require('../../utilities');
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
        const parsed = parse_th_data(reply)
        validate_sensor_data(parsed)
        return {
            internal_humidity_1 = parsed[0],
            internal_humidity_2 = parsed[1],
            external_humidity = parsed[2],
            internal_temp_1 = parsed[3],
            internal_temp_2 = parsed[4],
            external_temp = parsed[5]
        }
    })
}

/**
 * MAX31855 Temperature - internal precise temp
 */
const read_precise_temp = async () => {
    PythonShell.run('temp.precise.py', options, function (err, reply) {
        if (err) throw err
        const parsed = parse_pt_data(reply)
        return {
            precise_temp_c = parsed[0],
            precise_temp_f = parsed[1]
        }
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
        const parsed = parse_co2_data(reply)
        return co2 = parsed
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
    const test = await read_temp_humidity()
    const test1 = await read_precise_temp()
    const test2 = await read_co2()
    // console.log(process.env.internal_humidity_1)
    // console.log(process.env.internal_humidity_2)
    // console.log(process.env.external_humidity)
    // console.log(process.env.internal_temp_1)
    // console.log(process.env.internal_temp_2)
    // console.log(process.env.external_temp)
    // console.log(process.env.co2)
    // console.log(process.env.precise_temp_c)
    // console.log(process.env.precise_temp_f)
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
