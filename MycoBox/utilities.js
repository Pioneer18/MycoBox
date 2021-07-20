/**
 * Validate Set Environement Results
 * @param {Array} temp_humidity [{'h1': n, ...'temp1': n,...}]
 * @param {Array} temp_precise ['Thermocouple Temperature: nC /nF']
 * @param {Array} co2 ["CO2 PPM: n"]
 * @param {} weight 
 * @param {Array} irTemp
 */
const validate_sensor_data = (data) => {
    for (const val in data) {
        console.log(data)
        console.log(val)
    }
}

const parse_sensor_data = (reply) =>  JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')

module.exports = {
    validate_sensor_data,
    parse_sensor_data
}