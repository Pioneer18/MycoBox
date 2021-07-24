/**
 * Controller Utilities
 */

const { parse } = require("dotenv")

/**
 * Parse incoming sensor data
 * @param {Array} reply e.g. [h1={43.55} h2={44.25} h3={43.40}] => ["43.55", "44.25", "43.40"]
 * @returns 
 */
const parse_th_data = (reply) => {
    const parsed = []
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    for(let i = 1; i < 13; i +=2) {
        parsed.push(data[i])
    }
    return parsed
}

const parse_pt_data = (reply) => {
    const parsed = []
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    parsed.push(data[1])
    parsed.push(data[3])
    return parsed
}

const parse_co2_data = (reply) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    return data[1]
}

/**
 * Validate parsed sensor data
 * @param {Array} data e.g. ['43.55', 44.25, 43.40]
 */
const validate_sensor_data = (data) => {
    for (const i in data) {
        if ((typeof data[i]) !== 'string') throw new Error(`Sensor-${i} has returned an invalid data type: ${typeof data[i]} - ${data[i]}`)
        if (data[i] == '0') throw new Error(`Sensor-${i} has returned: ${data[i]}`)
    }
}
module.exports = {
    validate_sensor_data,
    parse_th_data,
    parse_pt_data,
    parse_co2_data
}