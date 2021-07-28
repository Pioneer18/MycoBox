/**
 * Sensors Service
 */

/**
 * Parse incoming sensor data
 * @param {Array} reply h1,h2,h3,h4,temp1,temp2,
 * @returns 
 */
const parse_th_data = (reply) => {
    console.log(reply)
    const parsed = []
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    for(let i = 1; i < 16; i +=2) {
        parsed.push(data[i])
        validate_sensor_data(data[i])
        // set env variable
    }
    console.log(parsed)
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
    if (typeof data !== typeof 'string') console.error(`received temp/humidity value that is not a string, check the sensors! ${data}`)
    if (data === '') console.error(`received an empty value for temp/humidity, check the sensors! ${data}`)
    if (data == null || data == undefined) console.error(`uh oh, got a null or undefined sensor value, check the sensors! ${data}`)
}
module.exports = {
    parse_th_data,
    parse_pt_data,
    parse_co2_data
}