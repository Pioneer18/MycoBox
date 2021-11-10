const { get, set_test_variables } = require("../globals/globals")
const chalk = require('chalk');
const { test_calculations } = require("../utilities");
const log = console.log;
const fs = require('fs')
const Tc = 1; // moderate time constant

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
    get_state()
        .then((state) => {
            // File path
            log(chalk.blueBright(JSON.stringify(state, null, '  ')))
            var path = `./${state[1].dirname}/${state[1].tests[state[1].count].title}.txt`;

            let buffer;
            let data = '';
            let intro = '';
            let arr = [];
            const internal_temp = (((parseFloat(state[2].internal_temp_1)) + (parseFloat(state[2].internal_temp_2)) + (parseFloat(state[2].internal_temp_3)) + (parseFloat(state[2].precise_temp_c))) / 4).toFixed(2);
            const internal_humidity = (((parseFloat(state[2].internal_humidity_1)) + (parseFloat(state[2].internal_humidity_2)) + (parseFloat(state[2].internal_humidity_3))) / 3).toFixed(2);
            const pv = currentPv(state[1], internal_humidity, internal_temp);
            const et = elapsedTime(state[1].tests[0].process_var, state[3], state[0])
            // const internal_co2 = ...

            log(chalk.redBright(`Cycles Count: ${state[1].cycles_count}`))
            // Test Config, init env state, actuators log
            if (state[1].cycles_count === 1) {
                intro = new Buffer.from(
                    '\n\n' +
                    'Test Config:' +
                    '\n-------------------------------------------\n' +
                    'Process Variable: ' + state[1].tests[0].process_var + '\n' +
                    'Design Level of Operation: ' + state[1].tests[0].dlo + '\n' +
                    'Disturbances: ' + state[1].tests[0].disturbances + '\n' +
                    'Termination Method: ' + state[1].tests[0].terminator + '\n' +
                    // 'Termination Details: ' + state[1].tests[0].cycles_limit !== "" ? state[1].tests[0].cycles_limit :  'Dlo reference or SS' +  
                    '\nInitial Environment State:' +
                    '\n-------------------------------------------\n' +
                    'Internal Temperature: ' + internal_temp + '\n' +
                    'Internal Humidity: ' + internal_humidity + '\n' +
                    'CO2: ' + state[2].co2 + '\n' +
                    '\nActuators Config:' +
                    '\n-------------------------------------------\n' +
                    // process the test_config into active actuators
                    '\n\n'
                );
                log(chalk.blueBright.bold(intro))
                // if last cycle, then run calculations
                // Fit a FOPDT dynamic model to Process Data
                // #1. compute the Process Gain
                // #2. compute the Time Constant
                // #3. compute the Dead Time 
                // #4. compute the Controller Gain
                // #5. compute the Reset Time
                // #6. compute the Derivative Time
                // use the model parameters to complete the design and tuning
            }

            // Raw Data Logs
            data = new Buffer.from('temp: ' + internal_temp + '| humidity: ' + internal_humidity + '| CO2: ' + '| "" ' + '| T-DT: ' + state[0].temperature.dt + '| H-DT: ' + state[0].humidity.dt + '| C-DT: ' + ' "" ' + '\n');
            log(chalk.blueBright.bold(data))

            // log the intro data with the raw data
            if (intro !== '') {
                arr.push(intro)
                arr.push(data)
                buffer = new Buffer.concat(arr);
                log(chalk.blueBright.bold(buffer))
            }
            // log raw data only
            else {
                buffer = data;
            }
            // run the calculations
            if (state[1].cycles_count === 0) {
                const { Kp, Tp, θp } = calculateFopdtParameters(initPv, finalPv, initCo, co_output, stepPoint, pvArray);
                log(chalk.greenBright('FOPDT PARMETERS\n', Kp, '\n', Tp, '\n', θp, '\n'))
                const { Kc, Td, Ti } = calculateGains(Kp, Tp, θp);
                log(chalk.redBright('GAINS\n', Kc, '\n', Td, '\n', Ti, '\n'))
            }


            // The fs.open() method takes a "flag" as the second argument. If the file does not exist, an empty file is created. 
            // 'a' stands for append mode which means that if the program is run multiple time data will be appended to the output file instead
            // of overwriting the existing data.
            fs.open(path, 'a', function (err, fd) {
                log(chalk.magentaBright('fs open happening now'))
                // If the output file does not exists an error is thrown else data in the buffer is written to the output file
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
        })


    /**
     * TEST CONFIG
     * process variable:
     * design level of operation:
     * disturbances: [element: value, ... ]
     * termination method: 
     * termination details:
     * ----------------------------------------------------------------------------------------
     * INITIAL ENV STATE
     * - internal temp
     * - internal humidity
     * - co2
     * ----------------------------------------------------------------------------------------
     * ACTUATORS CONFIG
     * humidifier | Intake | Exhaust | Aircon | Heater | CircTop | CircBottom | Light
     *     ON         ON      ON         OFF      OFF      OFF         OFF       OFF
     * ----------------------------------------------------------------------------------------
     * RAW DATA LOGS                              
     * Temp | Humidity | CO2 | T-DT |  H-DT | C-DT
     *    25       45      435    15     15.1   15.3
     * ...
     * ...
     * ...
     */

    // call test_calcultions on the last cycle
    // get('test_config')
    //     .then((test_config) => test_calculations(test_config.dirname, test_config.tests, test_config.count))
}

const get_state = () => {
    return Promise.all([get('pid_state'), get('test_config'), get('environment_state'), get('test_variables')]).then(values => values);
}

/**
 * Use the dynamic data from the DLO to calculate FOPDT parameters
 * @param {*} initPv 
 * @param {*} finalPv 
 * @param {*} initCo this is provided by the pre-tester
 * @param {*} co_output 
 * @param {*} stepPoint point in time the CO was stepped
 * @param {*} pvArray arrray of process variable and time objects
 * @returns { Kp, Tp, θp }
 */
const calculateFopdtParameters = (initPv, finalPv, initCo, co_output, stepPoint, pvArray) => {
    /**
     * finalPv - initPV / co_output - initCO
     * @param {*} initPv the initial PV
     * @param {*} finalPv the final PV
     * @param {*} initCo the initial CO
     * @param {*} co_output the final CO
     */
    const calculateProcessGain = (initPv, finalPv, initCo, co_output) => {
        // compute stuffs
        return 'process Gain'
    }
    /**
     * find the repsonse moment of the PV
     * calculate PV = initPV + 0.63(finalPv - initPV)
     * find the time that correlates closes to the 63% PV
     * subtract from the 63PV time the response moment and return this
     * @param {*} initPv the initial PV 
     * @param {*} finalPv the final PV
     * @param {*} pvArray array of all PV and elapsed time pairs
     */
    const calculateTimeConstant = (initPv, finalPv, pvArray) => {
        // compute stuffs
        return 'time constant'
    }

    /**
     * Find when PV makes a noticeable change in value
     * subtract this point in time from the stepPoint
     * @param {*} stepPoint point in time the CO was stepped
     * @param {*} pvArray array of all PV and elapsed time pairs
     */
    const calculateDeadtime = (stepPoint, pvArray) => {
        return 'dead time'
    }

    return {
        Kp: calculateProcessGain(initPv, finalPv, initCo, co_output),
        Tp: calculateTimeConstant(initPv, finalPv, pvArray),
        θp: calculateDeadtime(stepPoint, pvArray)
    }
}

/**
 * 
 * @param {*} Kp Process Gain
 * @param {*} Tp Time Constant
 * @param {*} θp Dead Time 
 * @returns 
 */
const calculateGains = (Kp, Tp, θp) => {

    /**
    * 1/Kp (Tp + 0.5θp / Tc + 0.5θp ) 
    */
    const controllerGain = (Kp, θp, Tc) => {
        return 'controller gain'
    }

    /**
     * Tp + 0.5θp
     */
    const resetTime = (Tp, θp) => {
        return 'reset time'
    }

    /**
     * θp / 2Tp + θp
     */
    const derivativeTime = (Tp, θp) => {
        return 'derivative time'
    }

    return {
        Kc: controllerGain(Kp, Tp, Tc),
        Ti: resetTime(Tp, θp),
        Td: derivativeTime(Tp, θp)
    }

}

/**
 * push current PV and elapsed time as a tuple to the pvArray
 * @param {*} PV 
 * @param {*} elpasedTime 
 */
const pushToPvArray = (PV, elpasedTime) => {

}

const currentPv = (test_config, internal_humidity, internal_temp) => {
    let pv;
    test_config.tests[0].process_var === "Humidity" ? pv = internal_humidity : pv = '';
    test_config.tests[0].process_var === "Temperature" ? pv = internal_temp : pv = '';
    return pv
}

/**
 * sum the process variable's dt
 * @param {number} dt current dt for the pv
 * @param {string} process_var
 */
const elapsedTime = (process_var, test_variables, pid_state) => {
    log(chalk.magentaBright(`Logging Elapsed Time\nPV: ${process_var}\nTest Variables: ${JSON.stringify(test_variables, null, ' ')}\nPid State: ${JSON.stringify(pid_state, null, ' ')}`))
    if (process_var === "Temperature") {
        log(chalk.magentaBright(`Temperature: ${test_variables.elapsedTime + pid_state.temperature.dt}`))
        // add temp dt to the elapsed time
        set_test_variables('elapsedTime', (test_variables.elapsedTime + pid_state.temperature.dt))
        return test_variables.elapsedTime + pid_state.temperature.dt
    }
    if (process_var === "Humidity") {
        log(chalk.magentaBright(`Humidity: ${test_variables.elapsedTime + pid_state.humidity.dt}`))
        // add humidity dt to the elapsed time
        set_test_variables('elapsedTime', (test_variables.elapsedTime + pid_state.humidity.dt))
        return test_variables.elapsedTime + pid_state.humidity.dt
    }
    // if (process_var === "CO2") {
    //    
    // }

}

/**
 * Find where the PV makes a clear change
 * Return the approximate moment the PV clearly begins to respond to the change in CO
 * @param {*} initPV the intial PV
 * @param {*} pvArray array of all PV and elapsed time pairs
 */
const findReponseMoment = (initPV, pvArray) => {

}

//TC is set for 'moderate performance': Tc is the larger of 1*Tp or 8·Өp

module.exports = {
    test_logger,
}