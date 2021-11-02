const { get } = require("../globals/globals")
const chalk = require('chalk');
const { test_calculations } = require("../utilities");
const log = console.log;

/**
 * note: use seconds as the unit for the step tests/fopdt/PID controllers
 * note: (DLO), defined as the expected values for set point and major disturbances during normal operation
 * note: When the FOPDT dynamic model is fit to process data, the results describe how PV will respond to a change in CO via the model parameters. In particular:
 * Test Logger
 * Goal:
 * - Create an FOPDT model from the step test data; Kp, Tp, Өp
 * - FOPDT: are to describe the overall dynamic behavior of the process with an approximating model
 * - Why: differential equations relate 1 or more functions and their derivatives; quantities and their rates of change
 *      - the direction the PV moves given a change in CO
 *      - how far the PV ultimately travels for a given change in CO
 *      - how fast the PV moves as it heads toward its new steady state
 *      - how much delay occurs between when the CO changes and the PV first begins to respond
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
    const state = get_state()
    // File path where data is to be written
    // Here, we assume that the file to be in
    // the same location as the .js file
    var path = `./${dir}/${tests[count].title}.txt`;
    log(chalk.magentaBright('Path: ' + path))

    // Declare a buffer and write the
    // data in the buffer
    let buffer = new Buffer.from('temp dt: ' + state[0].temperature.dt + ' humidity: ' + state[0].humidity.dt + '\n');

    // The fs.open() method takes a "flag"
    // as the second argument. If the file
    // does not exist, an empty file is
    // created. 'a' stands for append mode
    // which means that if the program is
    // run multiple time data will be
    // appended to the output file instead
    // of overwriting the existing data.
    fs.open(path, 'a', function (err, fd) {
        log(chalk.magentaBright('fs open happening now'))
        // If the output file does not exists
        // an error is thrown else data in the
        // buffer is written to the output file
        if (err) {
            console.log('Cant open file');
        } else {
            log(chalk.magentaBright('no error opening file'))
            fs.write(fd, buffer, 0, buffer.length,
                null, function (err, writtenbytes) {
                    log(chalk.magentaBright('attempting to write file now'))
                    if (err) {
                        console.log('Cant write to file');
                    } else {
                        log('File should have been written to')
                    }
                })
        }
    })


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
    // get('test_config')
    //     .then((test_config) => test_calculations(test_config.dirname, test_config.tests, test_config.count))
}

const get_state = () => {
    return Promise.all([get('state[0]'), get('test_config'), get('environment_state')]).then(values => values);
}

module.exports = {
    test_logger,
}