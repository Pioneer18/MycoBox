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
const prompter = () => {

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
     * 8. Cycles / DLO Difference / Steady state? 
     * 9. how many cycles / what difference / ok
     * 9. set up another test?
     */
    const tempPV = (pv) => {
        if (pv === 'Temperature') return true
    }

    const humidityPV = (pv) => {
        if (pv === 'Humidity') return true
    }

    const co2PV = (pv) => {
        if (pv === 'CO2') return true
    }

    const dloReference = (reference) => {
        if (reference === 'below') return true
        if (reference === 'above') return false
    }

    const disturbances = (pv) => {
        if (pv === 'Temperature') {
            // hide AC & Heater
            return [
                { name: 'humidifier' },
                { name: 'intake' },
                { name: 'exhaust' },
                { name: 'circulation top' },
                { name: 'circulation bottom' },
            ]
        }
        if (pv === 'Humidity') {
            // hide humidifer
            return [
                { name: 'intake' },
                { name: 'exhaust' },
                { name: 'circulation top' },
                { name: 'circulation bottom' },
                { name: 'aircon' },
                { name: 'heater' },
            ]
        }
        if (pv === 'CO2') {
            // hide intake & exhaust
            return [
                { name: 'humidifier' },
                { name: 'circulation top' },
                { name: 'circulation bottom' },
                { name: 'aircon' },
                { name: 'heater' },
            ]
        }
    }

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
        // #2. Process Variable
        {
            type: 'list',
            name: 'process_var',
            message: 'Select a process variable (PV) to be tested',
            choices: [
                'Temperature',
                'Humidity',
                'CO2'
            ],
        },
        // #3. Above to Below OR Below to Above: Test Prep
        {
            type: 'list',
            name: 'start_reference',
            message: 'Will the PV begin below the DLO and move above it, or from above the DLO and move below it?',
            choices: [
                'above',
                'below'
            ]
        },
        // #4. DLO for the Process Variable: Test Prep
        {
            type: 'input',
            name: 'dlo',
            message: 'Enter a design level of operation PV for this test',
            validate(value, answers) {
                if (parseInt(value) > 0 || parseInt(value) < 0) {
                    if (answers['process_var'] === 'Temperature') { // determine lowest and highest C range for this
                        if (parseInt(value) >= 0 && parseInt(value) <= 35) return true
                        return 'Enter a value within 0 to 35 degrees Celsius'
                    }
                    if (answers['process_var'] === 'Humidity') {
                        if (parseInt(value) >= 35 && parseInt(value) <= 99) return true // maybe hard to reach 100%?
                        return 'Enter a value within 35 to 99% relative humidity'
                    }
                    if (answers['process_var'] === 'CO2') {
                        if (parseInt(value) > 150 && parseInt(value) < 18000) return true // idk about these ranges 😅
                        return 'Enter a value within 150 to 18,000 ppm'
                    }
                }
                return 'Enter a number'
            }
        },
        // #5. CO step %: How much to raise / drop CO % (or switch actuators ON/OFF)
        // raise ----------
        {
            type: 'input',
            name: 'humidifier_step',
            message: 'What percentage would you like to raise the Humidifier Output',
            when(answers) {
                return (dloReference(answers['start_reference']) && humidityPV(answers['process_var']))
            }

        },
        {
            type: 'list',
            name: 'heater_step',
            message: 'Would you like switch the Heater ON to raise the temperature?',
            choices: [
                'yes',
                'no'
            ],
            when(answers) {
                return (dloReference(answers['start_reference']) && tempPV(answers['process_var']))
            }

        },
        // drop ----------
        {
            type: 'input',
            name: 'humidifier_step',
            message: 'Select what percentage to drop the humidifier CO',
            when(answers) {
                return (!dloReference(answers['start_reference']) && humidityPV(answers['process_var']))
            }
        },
        {
            type: 'list',
            name: 'aircon_step',
            message: 'Switch airconditioner ON to lower the temperature? ',
            choices: [
                'yes',
                'no',
            ],
            when(answers) {
                return (!dloReference(answers['start_reference']) && tempPV(answers['process_var']))
            }
        },
        {
            type: 'list',
            name: 'ventilation_step',
            message: 'Select a mode of ventilation output for the test',
            choices: [
                'both',
                'intake',
                'exhaust'
            ],
            when(answers) {
                return (!dloReference(answers['start_reference']) && co2PV(answers['process_var']))
            }

        },
        {
            type: 'input',
            name: 'intake-exhaust_step',
            message: 'Select what percentage to raise the intake & exhaust CO',
            when(answers) {
                if (answers['ventilation_step'] && answers['ventilation_step'] === 'both') return true
            },
            validate(value) {
                if ((parseInt(value) > 0 || parseInt(value) <= 100)) return true
            }
        },
        {
            type: 'input',
            name: 'intake_step', // implies exhaust off
            message: 'Select what percentage to raise the intake CO',
            when(answers) {
                if (answers['ventilation_step'] && answers['ventilation_step'] === 'intake') return true
            },
            validate(value) {
                if ((parseInt(value) > 0 || parseInt(value) <= 100)) return true
            }
        },
        {
            type: 'input',
            name: 'exhaust_step', // implies intake off
            message: 'Select what percentage to raise the exhaust CO',
            when(answers) {
                if (answers['ventilation_step'] && answers['ventilation_step'] === 'exhaust') return true
            },
            validate(value) {
                if ((parseInt(value) > 0 || parseInt(value) <= 100)) return true
            }
        },
    ]

    const prompt_again = (answers) => {
        log(chalk.blue(answers['another_test']))
        if (answers['another_test'] == true) {
            return prompter()
        }
        return run_tests()
    }

    const submit_test = (answers) => {
        configuration = { ...configuration, ...answers }
        tests.push(configuration);
    }

    inquirer.prompt(questions)
        .then(answers => {
            log(chalk.blue(JSON.stringify(answers, null, '  ')));
            // add answers to configuration
            configuration = { ...answers }
            const nested_questions = [
                // #6. [OPTIONAL] Select Disturbances
                {
                    type: 'checkbox',
                    name: 'disturbances',
                    message: '[OPTIONAL] Select disturbances for the test',
                    choices: disturbances(answers['process_var'])
                },
                // #7. Select Disturbances' values
                {
                    type: 'input',
                    name: 'humidifier',
                    message: 'Select a CO percentage for the humidifier',
                    when(answers) {
                        if (answers['disturbances'].length > 0 && answers['disturbances'].includes('humidifier')) return true
                    }
                },
                {
                    type: 'input',
                    name: 'intake',
                    message: 'Select a CO percentage for the intake',
                    when(answers) {
                        if (answers['disturbances'].length > 0 && answers['disturbances'].includes('intake')) return true
                    }
                },
                {
                    type: 'input',
                    name: 'exhaust',
                    message: 'Select a CO percentage for the exhaust',
                    when(answers) {
                        if (answers['disturbances'].length > 0 && answers['disturbances'].includes('exhaust')) return true
                    }
                },
                // #8. select a terminator
                {
                    type: 'list',
                    name: 'test_terminator',
                    message: 'Select a test termination criteria',
                    choices: [
                        'cycles',
                        'dlo difference',
                        'steady state'
                    ]
                },
                // #9. quantify the terminator
                {
                    type: 'input',
                    name: 'cycles_limit',
                    message: 'Select a number of cycles for this test',
                    when(answers) {
                        if (answers['test_terminator'] === 'cycles') return true
                    }
                },
                {
                    type: 'input',
                    name: 'dlo_difference',
                    message: 'How many units past the DLO must the PV travel before the test terminates?',
                    when(answers) {
                        if (answers['test_terminator'] === 'dlo difference') return true
                    }
                },
                // #9. Another test?
                {
                    type: 'confirm',
                    name: 'another_test',
                    message: 'Do you want to add another test to the session? Click ENTER to answer NO, type `y` to answer YES',
                    default: false,
                }
            ];

            inquirer.prompt(nested_questions)
                .then(answers => {
                    log(chalk.green(JSON.stringify(answers, null, '  ')));
                    // add answers to configuration
                    submit_test(answers)
                    prompt_again(answers)
                })

        })
}

prompter()


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
                    // set the test env_config: anything...just to prevent an error (so there's a state value for PIDs that aren't even used yet still called)
                    set_environment_config(test_config)
                        .then(set_session_state('active_test_session', true) // Test Runner knows this test is getting started
                            .then(() => {
                                const test_config = map_test_config(config); // TODO: update for new test_config
                                set_overrides(test_config);
                                //TODO: CYCLES / DLO REFERENCE / STEADY STATE
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
    // has the things that I need changed? Yeah pretty sure, so figure that out!
    log(chalk.red(JSON.stringify(configuration, null, '  ')))
    // return {
    //     title: configuration.title,
    //     start_criteria: {
    //         tempDLO: configuration.tempDLO ? configuration.tempDLO : '',
    //         rhDLO: configuration.rhDLO ? configuration.rhDLO : '',
    //         co2DLO: configuration.co2DLO ? configuration.co2DLO : ''
    //     },
    //     overrides: {
    //         circulation_top: configuration.circulation_top ? configuration.circulation_top : '',
    //         circulation_bottom: configuration.circulation_bottom ? configuration.circulation_bottom : '',
    //         aircon: configuration.aircon ? configuration.aircon : '',
    //         heater: configuration.heater ? configuration.heater : '',
    //         humidifierOutput: configuration.humidifierOutput ? configuration.humidifierOutput : '',
    //         intakeOutput: configuration.intakeOutput ? configuration.intakeOutput : '',
    //         exhaustOutput: configuration.exhaustOutput ? configuration.exhaustOutput : '',
    //         lightOutput: configuration.lightOutput ? configuration.lightOutput : ''
    //     },
    //     cycles: configuration.cycles,
    // }
       return {
           title: configuration.title,
           // HOW TO Start --------------------
           // [#1] title: used by test (logger)
           // [#2, #3, #4] operation_level: process_var, start_reference, dlo, (test_preper, logger, calculations)
           // What TO RUN --------------------
           // [#5, #6] overrides: break down the CO, doesn't matter PV or Disturbance, what's gotta turn on? (what to run during the test)
           // HOW & WHEN TO END --------------------
           // [#7, #8] settings: { (when and how to end)
           //   - terminator: 
           //   - terminator_value:   
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