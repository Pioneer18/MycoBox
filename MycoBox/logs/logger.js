const { get } = require("../globals/globals")
const chalk = require('chalk');
const log = console.log;

/**
 * Test Logger
 */
const test_logger = () => {
    // get the variables requested to be tracked for the test from the test config; temp, humidity, co2
    // get the start criteria value(s)
    // get the override values (if any)    

    /**
     *  Raw Data                              
     * | Temp | Humidity | CO2 |
     *   25      45         435
     * ...
     * ...
     * ...
     * Actuators
     * humidifier | Intake | Exhaust | Aircon | Heater | CircTop | CircBottom | Light
     *     ON         ON      ON         OFF      OFF      OFF         OFF       OFF
     */

    // call test_calcultions on the last cycle

}

module.exports = {
    test_logger,
}