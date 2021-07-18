/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell')
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

}

/**
 * Infrared Temp readings - grow bags
 * @param {Array} reply
 */
const read_infrared = () => {

}

/**
 * Set Environment Model - return readings of every sensor group
 */
const set_environment_model = () => {
    //const temperature_humidity = read_temp_humidity()
    // const precise_temp = this.read_precise_temp()
    // const co2 = this.read_co2()
    // const weight = this.read_scale()
    // const irTemp = this.read_infrared()
    return {
        "Temperature_Humidity": read_temp_humidity(),
        "Temperature_Precise": read_precise_temp(),
        "CO2": read_co2(),
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
