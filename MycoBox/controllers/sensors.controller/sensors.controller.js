/**
 * Sensors Controller
 */
const { PythonShell } = require('python-shell');
const { get, set_environment_state } = require('../../globals/globals')
const {
    parse_pt_data,
    parse_co2_data,
    read_mega_data
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
const mega_temp_humidity = () => {
    let mega = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: 'MycoBox/python',
        args: ["D 5"] // Read All Sensors
    };
    console.log("Mega: Args")
    return new Promise((resolve, reject) => {
        console.log(__dirname)
        console.log(__filename)
        PythonShell.run('raspi.to.mega.py', mega, function (err, reply) {
            if (err) reject(err)
            console.log('Should be reading mega data...')
            if (!reply) {
                // setTimeout(() => {
                //     mega_temp_humidity()
                // }, 13000);
            }
            read_mega_data(reply)
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
        // make bluetooth request
        // make serial request
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
const update_environment_state = () => {
    return new Promise((resolve) => {
        console.log("METHOD CALL: update_environment_state")
        read_co2()
            .then(read_precise_temp())
            .then(read_scale())
            .then(read_infrared())
            .then(set_timestamp())
            .then(mega_temp_humidity().then(resolve))
    })
}

/**
 * Read Environment Model
 */
const read_environment_state = () => {
    return new Promise((resolve) => {
        get('environment_state')
            .then(env_state => {
                return resolve({
                    timestamp: env_state.timestamp,
                    internal_temp_1: env_state.internal_temp_1,
                    internal_temp_2: env_state.internal_temp_2,
                    internal_temp_3: env_state.internal_temp_3,
                    internal_temp_c: ((parseFloat(env_state.internal_temp_1)) + (parseFloat(env_state.internal_temp_2)) + (parseFloat(env_state.internal_temp_3)) + (parseFloat(env_state.precise_temp_c))) / 4,
                    precise_temp_f: env_state.precise_temp_f,
                    external_temp: env_state.external_temp,
                    internal_humidity_1: env_state.internal_humidity_1,
                    internal_humidity_2: env_state.internal_humidity_2,
                    internal_humidity_3: env_state.internal_humidity_3,
                    internal_humidity: ((parseFloat(env_state.internal_humidity_1)) + (parseFloat(env_state.internal_humidity_2)) + (parseFloat(env_state.internal_humidity_3))) / 3,
                    external_humidity: env_state.external_humidity,
                    co2: env_state.co2,
                    weight: env_state.weight
                })
            })
    })
}

const clean_environment_state = (env_state) => {
    console.log('env_state before vvvvvvvvvvvvvvvvvvvvvvvvvv')
    console.log(env_state)
    for (x in env_state) {
        if (typeof env_state[x] === 'number') {
            env_state[x] = Math.round((env_state[x] + Number.EPSILON) * 100) / 100;
            console.log(env_state[x]);
        }
    }
    console.log('env_state after ^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    return env_state
}

module.exports = {
    read_precise_temp,
    read_co2,
    read_scale,
    read_infrared,
    update_environment_state,
    read_environment_state
}
