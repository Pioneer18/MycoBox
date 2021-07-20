/**
 * Validate Set Environement Results
 * @param {Array} temp_humidity [{'h1': n, ...'temp1': n,...}]
 * @param {Array} temp_precise ['Thermocouple Temperature: nC /nF']
 * @param {Array} co2 ["CO2 PPM: n"]
 * @param {} weight 
 * @param {Array} irTemp
 */


const parse_sensor_data = (reply) =>  JSON.stringify(reply[0].match(/[^{}]+(?=\})/g)).split('"')

module.exports = {
    
    parse_sensor_data
}