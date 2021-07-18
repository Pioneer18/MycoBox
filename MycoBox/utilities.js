/**
 * Validate Set Environement Results
 * @param {Array} temp_humidity [{'h1': n, ...'temp1': n,...}]
 * @param {Array} temp_precise ['Thermocouple Temperature: nC /nF']
 * @param {Array} co2 ["CO2 PPM: n"]
 * @param {} weight 
 * @param {Array} irTemp
 */
const validate_set_environment = async (
    temp_humidity,
    temp_precise,
    co2,
    weight,
    irTemp
) => {
    // temp_humidity
    console.log(temp_humidity)
    // temp_precise
    console.log(temp_precise)
    // co2
    console.log(co2)
    // weight
    console.log(weight)
    // irTemp
    console.log(irTemp)
    return
}

module.exports = {
    validate_set_environment,
}