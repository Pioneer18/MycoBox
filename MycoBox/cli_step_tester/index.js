/**
 * PID Controller Calibrator
 */
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;
const { get, set_overrides_state, set_session_state, set_environment_config, getter, set_test_config } = require('../globals/globals');
const { environment_manager } = require('../services/system.service/system.service');
const { test_config } = require('./resources');
const fs = require('fs');
const { timestamp, createDir, createTestFile } = require('../utilities');
// Intro Description
log(chalk.black.bgYellow('Environment Manager Step Tester'))
log(chalk.white("================================================================================================"))
log(chalk.yellow("The Step Tester Wizard will prompt you to configure one or multiple tests for this session.\n"
    + "Once you've created and submitted the tests you would like to run, the Step Tester will begin the session.\n"
    + "Each session has a " + chalk.italic.blue("Session Report") + " directory with a file for each test it ran.\n"
    + "Session Reports are saved in the " + chalk.italic.blue("SessionReports") + " directory in the MycoBox directory.\n"
    + chalk.white("==============================================================================================\n")
    + "Steps to Creating a Test:\n"
    + "#1. Title\n"
    + "#2. Starting Criteria: Which variables have a required starting range?\n"
    + "#3. What's the range for each of the selected variables?\n"
    + "#4. Which Actuators will be running?\n"
    + "#5. What is the output value for each selected actuator: 1 - 410\n"
    + "#6. How many read cycles for the test?\n"
    + "#6. Would you like to add another test to the session?\n"
))

const tests = []; // the array of tests to be ran
let count = 0; // the current test being tested
let live = false; // indicates if there is an active test
let dirCreated = false; // indicates the tests directory has been created
let dir; // the directory all of the test logs will be written to

/**
 * Prompt User to create tests amd push them into the tests array
 */
const prompt_test_configs = () => {

    // Test Configuration
    let configuration = {};

    /**
     * Questions
     * 1. Title?
     * 2. Which Environment Variable is the Measured Process Variable for this test?
     *  - you only get one...yeah like humidity for the humidifier PID, temp for the Temperature PID
     *  - the file records all three env variables, but indicates which is the PV for the test
     * 3. Starting from below or above the DLO?
     * 4. What is the DLO?
     * 5. CO step %?
     * 6. Will any of these disturbances be running? (don't show CO actuator)
     * 7. CO of the selected disturbances?
     * 8. how many cycles?
     * 9. set up another test?
     */
    const questions = [
        // #1. Title
        {
            type: 'input',
            name: 'title',
            message: 'Enter a title (filename) for this test',
            validate(value) {
                if (typeof value === 'string' && value.length > 5) return true
                return 'Please enter a longer title'
            }
        },
        // #2. Measured Process Variable (TODO:This should likely be a list)
        {
            type: 'checkbox',
            message: 'Select the measured process variable',
            name: 'process_var',
            choices: [
                { name: 'Temperature' },
                { name: 'Humidity' },
                { name: 'CO2' }
            ],
            validate(choices) {
                log(chalk.blackBright('Choices'))
                log(chalk.blackBright(choices))
                if (choices.length === 1) return true
            }
        }
    ];

    inquirer.prompt(questions)
        .then(answers => {
            // make the title filename firendly
            configuration.title = answers.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let questions = [];
            // #3. DLO for the selected PV
            answers.process_var.forEach(variable => {
                if (variable === 'Temperature') {
                    questions.push({
                        type: 'input',
                        message: 'Enter the design level of operation for the temperature in degrees Celsius',
                        name: 'tempDLO',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 0 && parseInt(value) <= 35)) return true
                            return 'Please choose a value larger than 0 and less than 35 degrees C'
                        }
                    })
                }
                if (variable === 'Humidity') {
                    questions.push({
                        type: 'input',
                        message: 'Enter the design level of operation for the Relative Humidity as a percentage',
                        name: 'rhDLO',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 10 && parseInt(value) <= 100)) return true
                            return 'Please choose a value larger than 0 and less than 35 degrees C'
                        }
                    })
                }
                if (variable === 'CO2') {
                    questions.push({
                        type: 'input',
                        message: 'Enter the design level of operation for the CO2 in ppm',
                        name: 'co2DLO',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 200 && parseInt(value) <= 20000)) return true
                            return 'Please choose a value larger than 199 and less than 20001 ppm'
                        }
                    })
                }
            })
            return questions
        })
        .then(questions => {
            inquirer.prompt(questions).then(answers => {
                configuration = { ...configuration, ...answers }
                return answers
            })
                .then(answers => {
                    log(chalk.green(JSON.stringify(answers, null, '  ')));
                    /**
                     * Max allowed starting PV (look at the previous answer, select make temp,hum,co2 accordingly)
                     */
                    const questions = [
                        // #4. Maxed allowed starting point (start criteria)
                        {
                            type: "input",
                            message: "Select a starting PV for the test that is at least 2 units above or below the DLO",
                            name: "PVi", // initial PV
                            validate(value) {
                                // if (value && (parseInt(value) < configuration))
                            }
                        }
                    ]
                })


                // put this at the 10'th level deep
                .then(() => {
                    const questions = [
                        // #10. Disturbance Actuators
                        {
                            type: 'checkbox',
                            message: 'Select the disturbances that will be active during the test',
                            name: 'disturbances',
                            choices: [
                                { name: 'humidifier' },
                                { name: 'intake' },
                                { name: 'exhaust' },
                                { name: 'circulation top' },
                                { name: 'circulation bottom' },
                                { name: 'aircon' },
                                { name: 'heater' },
                                { name: 'light' },
                            ]
                        }
                    ]
                    inquirer.prompt(questions)
                        .then(answers => {
                            let questions = []
                            // #11. disturbance CO values
                            answers.disturbances.forEach(actuator => {
                                if (actuator === 'humidifier') {
                                    questions.push({
                                        type: 'input',
                                        name: 'humidifierOutput',
                                        message: 'Please enter the output value for the humidifier; an integer between 1 - 320',
                                        validate(value) {
                                            if (value && (parseInt(value) >= 1 && parseInt(value) <= 320)) return true
                                            return "Please enter a value between 1 and 320"
                                        }
                                    })
                                }
                                if (actuator === 'intake') {
                                    questions.push({
                                        type: 'input',
                                        name: 'intakeOutput',
                                        message: 'Please enter the output value for the intake fan; an integer between 1 - 350',
                                        validate(value) {
                                            if (value && (parseInt(value) >= 1 && parseInt(value) <= 350)) return true
                                            return "Please enter a value between 1 and 350"
                                        }
                                    })
                                }
                                if (actuator === 'exhaust') {
                                    questions.push({
                                        type: 'input',
                                        name: 'exhaustOutput',
                                        message: 'Please enter the output value for the exhaust fan; an integer between 1 - 350',
                                        validate(value) {
                                            if (value && (parseInt(value) >= 1 && parseInt(value) <= 350)) return true
                                            return "Please enter a value between 1 and 350"
                                        }
                                    })
                                }
                                if (actuator === 'light') {
                                    questions.push({
                                        type: 'input',
                                        name: 'lightOutput',
                                        message: 'Please enter the output value for the light; an integer between 1 - 410',
                                        validate(value) {
                                            if (value && (parseInt(value) >= 1 && parseInt(value) <= 410)) return true
                                            return "Please enter a value between 1 and 410"
                                        }
                                    })
                                }
                                if (actuator === 'circulation top') {
                                    configuration.circulation_top = true;
                                }
                                if (actuator === 'circulation bottom') {
                                    configuration.circulation_bottom = true;
                                }
                                if (actuator === 'aircon') {
                                    configuration.aircon = true;
                                }
                                if (actuator === 'heater') {
                                    configuration.heater = true;
                                }
                            })

                            return questions
                        })
                        .then(questions => {
                            inquirer.prompt(questions)
                                .then(answers => {
                                    configuration = { ...configuration, ...answers }

                                    const questions = [
                                        // #12. Number of Cycles 
                                        {
                                            type: 'input',
                                            name: 'cycles',
                                            message: 'Please enter the number of Environment Manager Cycles for this test',
                                            validate(value) {
                                                if (value && parseInt(value) > 0 && parseInt(value) < 51) return true
                                                return "Please enter a value greater than 0 and less than 51"
                                            }
                                        },
                                        // #13. Create another test?
                                        {
                                            type: 'confirm',
                                            name: 'anotherTest',
                                            message: 'Do you want to add another test to the session? Click ENTER to answer NO, type `y` to answer YES',
                                            default: false,
                                        },
                                    ]
                                    inquirer.prompt(questions)
                                        .then(answers => {
                                            /**
                                             * Add another Test or Start the Session
                                             * - Ask if user will enter another test
                                                - if yes: recall promptcreate and push current test to global tests array
                                                - if no: push test and go to run session step
                                             */
                                            configuration = { ...configuration, ...answers }
                                            tests.push(configuration);
                                            if (answers.anotherTest.toLowerCase() === 'y' || answers.anotherTest.toLowerCase() === 'yes') {
                                                return prompt_test_configs()
                                            }

                                            return run_tests()
                                        })
                                })
                        })

                })
        })
}

prompt_test_configs()


/**
 * Run Tests
 * Todo:
 * 1. put logsDirName into ENV (private folder on my pc)
 * 2. put mode vars, LIVE & TEST, into resources file
 * 3. put createDir and createFile methods into utilities
 * 4. create checkDirCreated method
 */
const run_tests = () => {
    log(chalk.bold.cyan(JSON.stringify(tests, null, '  ')))
    // create test dir
    createTestSuiteDir()
    log(chalk.red(`count: ${count} test.length: ${tests.length}`));
    if (count < tests.length) {
        if (!live) {
            // create test file: with the initial data
            createTestFile(dir, tests, count)
            // set test_config filename & dirname
            set_test_config('dirname', dir)
            set_test_config('filename', `./${dir}/${tests[count].title}.txt`)
            // start test session
            newTestSession(tests[count])
                .then(() => {
                    setTimeout(() => {
                        let session_state = getter('session_state');
                        log(chalk.greenBright(`Current Session State`));
                        log(chalk.greenBright(session_state));
                        if (session_state.active_test_session) live = true;
                        log(chalk.bold.yellow('INCREMENT TESTS'))
                        count++
                        // recall runTests
                        log(chalk.whiteBright('Recalling Run Tests'));
                        run_tests();
                        console.log('Run Tests Normally would Break the Loop Right Ducking Here')

                    }, 10000);
                })
        }
        if (live) {
            setTimeout(() => {
                log(chalk.grey('Checking if the Test Has Ended Yet'))
                let session_state = getter('session_state');
                // if test still active recall run tests
                if (session_state.active_test_session) run_tests()
                // if session has ended
                if (!session_state.active_test_session) {
                    // turn live off
                    live = false;
                    run_tests()
                }
            }, 15000);
        }
        // wait for the acitve_test_session to be set
        console.log('Hello from Run Tests Outer Space!')
    }
    else {
        console.log("All TESTS HAVE BEEN RAN, YA PLEB!")
        return
    }
}

/**
 * NewTestSession
 */
const newTestSession = (config) => {
    return new Promise((resolve) => {
        get('session_state')
            .then(state => {
                if (!state.active_test_session) {
                    // set the test env_config: anything...just to prevent an error
                    set_environment_config(test_config)
                        .then(set_session_state('active_test_session', true)
                            .then(() => {
                                const test_config = map_test_config(config);
                                set_overrides(test_config);
                                // run test_preparation: // wait for env to reset / push the env to where it needs to be before next test
                                set_test_config('cycles_limit', parseInt(test_config.cycles))
                                    // call environment manager: in test mode env counts it's loops and ends session on final loop
                                    .then(environment_manager('TEST'))//environment_manager('TEST')
                                    .then(resolve('Resolve After EM has fired'))
                            }))
                }
            })

    })
}


// set the globals.overrides for the current test
const set_overrides = (test_config) => {
    console.log('Test Config');
    console.log(test_config);
    return new Promise((resolve) => {
        try {
            for (const actuator in test_config.overrides) {
                if (test_config.overrides[actuator] === '') {
                    continue
                }
                if (actuator.localeCompare('circulation_top') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('circulation_bottom') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('aircon') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('heater') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('humidifierOutput') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('intakeOutput') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('exhaustOutput') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                if (actuator.localeCompare('lightOutput') === 0) {
                    set_overrides_state(actuator, test_config.overrides[actuator])
                    continue
                }
                console.log("An Invalid Override was provided");
                console.log("The Invalid Actuator: " + actuator)
                console.log(actuator === 'circulation_top')
                console.log(actuator.localeCompare('circulation_top'))
                console.log(typeof actuator)

            }
            resolve()
        } catch (err) {
            throw new Error("Failed to Set Overrides!")
        }
    })
}

/**
 * maps the raw form array into a test_configuration
 * @param {*} configuration 
 * 
 */
const map_test_config = (configuration) => {
    // map the test configuration object
    return {
        title: configuration.title,
        start_criteria: {
            tempDLO: configuration.tempDLO ? configuration.tempDLO : '',
            rhDLO: configuration.rhDLO ? configuration.rhDLO : '',
            co2DLO: configuration.co2DLO ? configuration.co2DLO : ''
        },
        overrides: {
            circulation_top: configuration.circulation_top ? configuration.circulation_top : '',
            circulation_bottom: configuration.circulation_bottom ? configuration.circulation_bottom : '',
            aircon: configuration.aircon ? configuration.aircon : '',
            heater: configuration.heater ? configuration.heater : '',
            humidifierOutput: configuration.humidifierOutput ? configuration.humidifierOutput : '',
            intakeOutput: configuration.intakeOutput ? configuration.intakeOutput : '',
            exhaustOutput: configuration.exhaustOutput ? configuration.exhaustOutput : '',
            lightOutput: configuration.lightOutput ? configuration.lightOutput : ''
        },
        cycles: configuration.cycles,
    }

}

/**
 * Create Test Suite Directory
 */
const createTestSuiteDir = () => {
    try {
        if (!dirCreated) {
            dir = `../../../EM_LOGS/${timestamp()}`;
            log(chalk.blueBright(dir))
            dirCreated = createDir(dir);
            // set_test_config('dirname', dir)
        }
    } catch (err) {
        throw new Error('Error creating Directory: ' + err);
    }

}

/**
 * Post Test
 * steps:
 * - print test report to user
 *      - number of tests
 *      - list each test with duration, start point, end point, and file location
 *      - prompt to run another suite of tests or quit
 */

/**
 * Cancel Current Session
 */