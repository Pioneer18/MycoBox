/**
 * Sensors Service
 */

/**
 * Parse incoming dht22 sensor data
 * @param {Array} reply h1,h2,h3,h4,temp1,temp2,
 * @returns 
 */
const parse_th_data = (reply) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    for(let i = 1; i < 16; i +=2) {
        validate_sensor_data(data[i]) // probably should skip if not valid...
        set_dht22_values(i, data[i])
    }
    return
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

/**
 * Set dht22 values to environment model
 */
const set_dht22_values = (i, data) => {
    switch (i) {
        case 1:
            process.env.internal_humidity_1 = data
            console.log(`internal_humidity_1: ${process.env.internal_humidity_1}`)
            break;
        case 3:
            process.env.internal_humidity_2 = data
            console.log(`internal_humidity_2: ${process.env.internal_humidity_2}`)
            break
        case 5:
            process.env.internal_humidity_3 = data
            console.log(`internal_humidity_3: ${process.env.internal_humidity_3}`)
            break
        case 7:
            process.env.external_humidity = data
            console.log(`external_humidity: ${process.env.external_humidity}`)
            break
        case 9:
            process.env.internal_temp_1 = data
            console.log(`internal_temp_1: ${process.env.internal_temp_1}`)
            break
        case 11:
            process.env.internal_temp_2 = data
            console.log(`internal_temp_2: ${process.env.internal_temp_2}`)
            break
        case 13:
            process.env.internal_temp_3 = data
            console.log(`internal_temp_3: ${process.env.internal_temp_3}`)
            break
        case 15:
            process.env.external_temp = data
            console.log(`external_temp: ${process.env.external_temp}`)
            break
        default:
            break;
    }
}
module.exports = {
    parse_th_data,
    parse_pt_data,
    parse_co2_data
}