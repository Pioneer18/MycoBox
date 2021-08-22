/**
 * Sensors Service
 */
const {globals} = require('../../globals/globals');

/**
 * Parse incoming dht22 sensor data
 * @param {Array} reply h1,h2,h3,h4,temp1,temp2,
 * @returns 
 */
const parse_th_data = (reply) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    for(let i = 1; i < 16; i +=2) {
        validate_th_data(data[i]) // probably should skip if not valid...
        set_dht22_values(i, data[i])
    }
    return
}

const parse_pt_data = (reply) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    console.log(data[1]);
    console.log(data[3]);
    globals.precise_temp_c = data[1]
    globals.precise_temp_f = data[3]
    return
}

const parse_co2_data = (reply) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    console.log('CO2 Data Below !!!!!!!!!')
    console.log(data)
    globals.co2 = data[1]
    return
}

/**
 * Validate parsed sensor data
 * @param {Array} data e.g. ['43.55', 44.25, 43.40]
 */
const validate_th_data = (data) => {
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
            globals.internal_humidity_1 = data
            console.log(`internal_humidity_1: ${globals.internal_humidity_1}`)
            break;
        case 3:
            globals.internal_humidity_2 = data
            console.log(`internal_humidity_2: ${globals.internal_humidity_2}`)
            break
        case 5:
            globals.internal_humidity_3 = data
            console.log(`internal_humidity_3: ${globals.internal_humidity_3}`)
            break
        case 7:
            globals.external_humidity = data
            console.log(`external_humidity: ${globals.external_humidity}`)
            break
        case 9:
            globals.internal_temp_1 = data
            console.log(`internal_temp_1: ${globals.internal_temp_1}`)
            break
        case 11:
            globals.internal_temp_2 = data
            console.log(`internal_temp_2: ${globals.internal_temp_2}`)
            break
        case 13:
            globals.internal_temp_3 = data
            console.log(`internal_temp_3: ${globals.internal_temp_3}`)
            break
        case 15:
            globals.external_temp = data
            console.log(`external_temp: ${globals.external_temp}`)
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