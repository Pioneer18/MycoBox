/**
 * Validate Set Environement Results
 * @param {Array} temp_humidity [{'h1': n, ...'temp1': n,...}]
 * @param {Array} temp_precise ['Thermocouple Temperature: nC /nF']
 * @param {Array} co2 ["CO2 PPM: n"]
 * @param {} weight 
 * @param {Array} irTemp
 */
const validate_sensor_data = (data) => {
    for (let i =1; i < 12; i += 2) {
        console.log(data[i])
        if (typeof data[i] !== 'string') throw new Error(`Sensor-${i} has returned an invalid data type: ${typeof data[i]} - ${data[i]}`)
        if (data[i] === '0') throw new Error(`Sensor-${i} has returned: ${data[i]}`)
        if (typeof data[i] !== 'string') console.log('makin bacon pancakes')
    }
}

const parse_sensor_data = (reply) =>  JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')

module.exports = {
    validate_sensor_data,
    parse_sensor_data
}