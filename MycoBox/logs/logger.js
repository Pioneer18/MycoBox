const { get } = require("../globals/globals")
const chalk = require('chalk');
const { test_calculations } = require("../utilities");
const { tests } = require("../cli_pid_calibrator");
const log = console.log;

/**
 * note: use seconds as the unit for the step tests/fopdt/PID controllers
 * note: (DLO), defined as the expected values for set point and major disturbances during normal operation
 * note: When the FOPDT dynamic model is fit to process data, the results describe how PV will respond to a change in CO via the model parameters. In particular:
 * Test Logger
 * Goal:
 * - Create an FOPDT model from the step test data; Kp, Tp, Өp
 * - FOPDT: are to describe the overall dynamic behavior of the process with an approximating model
 * - Why: differential equations relate 1 or more functions and their derivatives; quantities and their rates of chagne
 *      - the direction the PV moves given a change in CO
 *      - how far the PV ultimately travels for a given change in CO
 *      - how fast the PV moves as it heads toward its new steady state
 *      - how much delay occurs between when the CO changes and teh PV first begins to respond
 */
const test_logger = () => {
    // On first log: when file created
    // #1. get the start criteria value(s): where did the environment start from
    // #2. get the step override values (COs) & the initial; some tests begin with actuators running!
    // #3. get the total cycles (& total runtime)

    // ---------------------------------------------------------------------------------------------------------
    // #1. get the variables requested to be tracked for the test from the test config; temp, humidity, co2
    // #2. grab the 'tracked variables' from the env_state that was used for the latest em cycle
    // #3. grab the current total time and the dt
    // $4. print the tracked PV(s), the dt, and the current total time & cycle count
    

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
    get('test_config')
        .then((test_config) => test_calculations(test_config.dirname, tests, ))
}

module.exports = {
    test_logger,
}