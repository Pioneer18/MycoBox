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
     *  Raw Data                Kp                Actuators
     * | Temp | Humidity | CO2 | tKp | hKp | cKp | humidifier | Intake | Exhaust | Aircon | Heater | CircTop | CircBottom | Light
     *   25      45         435   -     -     -        ON         ON      ON         OFF      OFF      OFF         OFF       OFF
     */
}

module.exports = {
    test_logger,
}