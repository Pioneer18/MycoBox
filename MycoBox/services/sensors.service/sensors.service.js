/**
 * Sensors Service
 */
const { set_environment_state } = require('../../globals/globals');

/**
 * Parse incoming dht22 sensor data
 * @param {Array} reply h1,h2,h3,h4,temp1,temp2,
 * @returns 
 */
const read_mega_data = (reply) => {
    if (!reply) throw new Error('No reply from Mega')
    const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
    return new Promise((resolve) => {
        for (let i = 1; i < 16; i += 2) {
            validate_th_data(data[i])
                .then(set_dht22_values(i, data[i]))
                .then(resolve())
                .catch()
        }
        resolve()
    });
}

const parse_pt_data = (reply) => {
    console.log("Parsing PT Data:")
    return new Promise((resolve) => {
        const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
        console.log('moving through parse pt data')
        console.log(data)
        set_environment_state('precise_temp_c', data[1])
            .then(set_environment_state('precise_temp_f', data[3]))
            .then(resolve())
            .catch()
    })
}

const parse_co2_data = (reply) => {
    return new Promise((resolve) => {
        const data = JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')
        console.log('CO2 Data Below !!!!!!!!!')
        console.log(data)
        set_environment_state('co2', data[0])
            .then(resolve())
            .catch(err => console.log(`Error Caught: parse_co2_dta: ${err}`))
    })
}

/**
 * Validate parsed sensor data
 * @param {Array} data e.g. ['43.55', 44.25, 43.40]
 */
const validate_th_data = (data) => {
    // console.log("METHOD CALL: validate_th_data")
    // console.log(data)
    return new Promise((resolve, reject) => {
        if (typeof data !== typeof 'string') reject(`received temp/humidity value that is not a string, check the sensors! ${data}`)
        if (data === '') reject(`received an empty value for temp/humidity, check the sensors! ${data}`)
        if (data == null || data == undefined) reject(`uh oh, got a null or undefined sensor value, check the sensors! ${data}`)
        resolve()
    })
}

/**
 * Set dht22 values to environment model
 */
const set_dht22_values = (i, data) => {
    return new Promise((resolve) => {
        switch (i) {
            case 1:
                set_environment_state('internal_humidity_1', data).then(resolve());
                break
            case 3:
                set_environment_state('internal_humidity_2', data).then(resolve());
                break
            case 5:
                set_environment_state('internal_humidity_3', data).then(resolve());
                break
            case 7:
                set_environment_state('external_humidity', data).then(resolve());
                break
            case 9:
                set_environment_state('internal_temp_1', data).then(resolve());
                break
            case 11:
                set_environment_state('internal_temp_2', data).then(resolve());
                break
            case 13:
                set_environment_state('internal_temp_3', data).then(resolve());
                break
            case 15:
                set_environment_state('external_temp', data).then(resolve());
                break
            default:
                console.log('set_dht22_values: Default')
                break
        }
    })
}

module.exports = {
    parse_pt_data,
    parse_co2_data,
    read_mega_data
}