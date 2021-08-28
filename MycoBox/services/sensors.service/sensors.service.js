/**
 * Sensors Service
 */
const { set_environment_state } = require('../../globals/globals');

/**
 * Parse incoming dht22 sensor data
 * @param {Array} reply h1,h2,h3,h4,temp1,temp2,
 * @returns 
 */
const parse_th_data = new Promise((resolve, reject) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    for (let i = 1; i < 16; i += 2) {
        validate_th_data(data[i]) // probably should skip if not valid...
        set_dht22_values(i, data[i])
    }
    return
})

const parse_pt_data = new Promise((resolve, reject) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    set_environment_state('precise_temp_c', data[1]);
    set_environment_state('precise_temp_f', data[3]);
    return
})

const parse_co2_data = new Promise((resolve, reject) => {
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    console.log('CO2 Data Below !!!!!!!!!')
    console.log(data)
    set_environment_state('co2', data[0]);
    return
})

/**
 * Validate parsed sensor data
 * @param {Array} data e.g. ['43.55', 44.25, 43.40]
 */
const validate_th_data = new Promise((resolve, reject) => {
    if (typeof data !== typeof 'string') reject(`received temp/humidity value that is not a string, check the sensors! ${data}`)
    if (data === '') reject(`received an empty value for temp/humidity, check the sensors! ${data}`)
    if (data == null || data == undefined) reject(`uh oh, got a null or undefined sensor value, check the sensors! ${data}`)
    resolve()
})

/**
 * Set dht22 values to environment model
 */
const set_dht22_values = new Promise((resolve, reject) => {
    switch (i) {
        case 1:
            await set_environment_state('internal_humidity_1', data);
            break;
        case 3:
            await set_environment_state('internal_humidity_2', data);
            break
        case 5:
            await set_environment_state('internal_humidity_3', data);
            break
        case 7:
            await set_environment_state('external_humidity', data);
            break
        case 9:
            await set_environment_state('internal_temp_1', data);
            break
        case 11:
            await set_environment_state('internal_temp_2', data);
            break
        case 13:
            await set_environment_state('internal_temp_3', data);
            break
        case 15:
            await set_environment_state('external_temp', data);
            break
        default:
            break;
    }
})

module.exports = {
    parse_th_data,
    parse_pt_data,
    parse_co2_data
}