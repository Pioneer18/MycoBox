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
     * 8. Cycles / dlo_reference / steady_state? 
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
                { name: 'circulation_top' },
                { name: 'circulation_bottom' },
            ]
        }
        if (pv === 'Humidity') {
            // hide humidifer
            return [
                { name: 'intake' },
                { name: 'exhaust' },
                { name: 'circulation_top' },
                { name: 'circulation_bottom' },
                { name: 'aircon' },
                { name: 'heater' },
            ]
        }
        if (pv === 'CO2') {
            // hide intake & exhaust
            return [
                { name: 'humidifier' },
                { name: 'circulation_top' },
                { name: 'circulation_bottom' },
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
                    name: 'terminator',
                    message: 'Select a test termination criteria',
                    choices: [
                        'cycles',
                        'dlo_reference',
                        'steady_state'
                    ]
                },
                // #9. quantify the terminator
                {
                    type: 'input',
                    name: 'cycles_limit',
                    message: 'Select a number of cycles for this test',
                    when(answers) {
                        if (answers['terminator'] === 'cycles') return true
                    }
                },
                {
                    type: 'input',
                    name: 'dlo_reference',
                    message: 'How many units past the DLO must the PV travel before the test terminates?',
                    when(answers) {
                        if (answers['terminator'] === 'dlo_reference') return true
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
                    submit_test(answers)
                    prompt_again(answers)
                })

        })
}

prompter()


/**
 * Run Tests
 * Todo:
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
                        if (session_state.active_test_session) live = true;
                        log(chalk.bold.yellow('INCREMENT TESTS'))
                        count++
                        // recall runTests
                        log(chalk.whiteBright('Recalling Run Tests'));
                        run_tests();
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
        log(chalk.magentaBright('Hello from Run Tests Outter Space!'))
    }
    else {
        log(chalk.magentaBright("All TESTS HAVE BEEN RAN"))
        return
    }
}

/**
 * NewTestSession (ok)
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
                                const test_config = map_test_config(config);
                                log(chalk.redBright(JSON.stringify(test_config, null, '  ')))
                                set_global_test_config(test_config);
                                set_overrides(test_config)

                                    // run test_preparation: // wait for env to reset / push the env to where it needs to be before next test
                                    // call environment manager: in test mode env counts it's loops and ends session on final loop
                                    .then(environment_manager('TEST'))//environment_manager('TEST')
                                    .then(resolve('Resolve After EM has fired'))
                            }))
                }
            })

    })
}

// set the globals.overrides for the current test (ok)
const set_overrides = (test_config) => {
    log('Test Config');
    log(test_config);
    return new Promise((resolve) => {
        try {
            const disturbances = test_config.disturbances;
            set_overrides_state('flag', true)
            // disturbances

            // circulation top
            if (disturbances.circulation_top === true) set_overrides_state('circulation_top', true)
            if (disturbances.circulation_top === '') set_overrides_state('circulation_top', false)
            // circulation bottom
            if (disturbances.circulation_bottom === true) set_overrides_state('circulation_bottom', true)
            if (disturbances.circulation_bottom === '') set_overrides_state('circulation_bottom', false)
            // aircon
            if (disturbances.aircon === true) set_overrides_state('aircon', true)
            if (test_config.co.name === 'aircon_step' && test_config.co.value === true) set_overrides_state('aircon', true)
            if (disturbances.aircon === '' || (test_config.co.name === 'aircon_step' && test_config.co.value === false)) set_overrides_state('aircon', false)
            // heater
            if (disturbances.heater === true) set_overrides_state('heater', true)
            if (test_config.co.name === 'heater_step' && test_config.co.value === true) set_overrides_state('heater', true)
            if (disturbances.heater === '' || (test_config.co.name === 'heater_step' && test_config.co.value === false)) set_overrides_state('heater', false)
            // humidifier
            if (typeof disturbances.humidifier === 'number') set_overrides_state('humidifier', disturbances.humidifier)
            if (test_config.co.name === 'humidifier_step' && typeof test_config.co.value === 'number') set_overrides_state('humidifier', test_config.co.value)
            // intake
            if (disturbances.intake !== '') set_overrides_state('intake', disturbances.intake)
            if (test_config.co.name === 'intake_step') set_overrides_state('intake', test_config.co.value)
            // exhaust
            if (disturbances.exhaust !== '') set_overrides_state('exhaust', disturbances.exhaust)
            if (test_config.co.name === 'exhaust_step') set_overrides_state('exhaust', test_config.co.value)
            // intake-exhaust
            if (test_config.co.name === 'intake-exhaust_step') {
                set_overrides_state('intake', test_config.co.value)
                set_overrides_state('exhaust', test_config.co.value)
            }
            get('overrides')
                .then(overrides => log(chalk.green(JSON.stringify(overrides, null, '  '))))
            resolve()
        } catch (err) {
            throw new Error("Failed to Set Overrides: " + err)
        }
    })
}

/**
 * maps the raw form array into a test_configuration
 * convert arrange test results into a test_config and convert number values to numbers
 * @param {*} configuration 
 * 
 */
const map_test_config = (configuration) => {
    log(chalk.red('Map Test Config'))
    // log(chalk.red(JSON.stringify(configuration, null, '  ')))

    const findCO = () => {
        if (configuration.aircon_step && configuration.aircon_step === 'yes') return { name: 'aircon_step', value: true }
        if (configuration.aircon_step && configuration.aircon_step === 'no') return { name: 'aircon_step', value: false }
        if (configuration.heater_step && configuration.heater_step === 'yes') return { name: 'heater_step', value: true }
        if (configuration.heater_step && configuration.heater_step === 'no') return { name: 'heater_step', value: false }
        if (configuration.humidifier_step) return { name: 'humidifier_step', value: parseInt(configuration.humidifier_step) }
        if (configuration.ventilation_step) {
            if (configuration.ventilation_step === 'both') return { name: 'intake-exhaust_step', value: configuration.ventilation_step }
            if (configuration.ventilation_step === 'intake') return { name: 'intake_step', value: configuration.intake_step }
            if (configuration.ventilation_step === 'intake') return { name: 'exhaust_step', value: configuration.exhaust_step }
        }

    }

    return {
        // HOW TO Start --------------------
        title: configuration.title,
        op_level: {
            process_var: configuration.process_var,
            start_reference: configuration.start_reference,
            dlo: parseInt(configuration.dlo)
        },
        // What TO RUN --------------------
        co: findCO(),
        disturbances: {
            circulation_top: configuration.disturbances.includes('circulation_top') ? true : '',
            circulation_bottom: configuration.disturbances.includes('circulation_bottom') ? true : '',
            aircon: configuration.disturbances.includes('aircon') ? true : '',
            heater: configuration.disturbances.includes('heater') ? true : '',
            humidifier: configuration.humidifier ? configuration.humidifier : '',
            intake: configuration.intake ? configuration.intake : '',
            exhaust: configuration.exhaust ? configuration.exhaust : '',
        },
        // HOW & WHEN TO END --------------------
        terminator: configuration.terminator,
        cycles_limit: configuration.cycles_limit ? parseInt(configuration.cycles_limit) : '',
        dlo_reference: configuration.dlo_reference ? configuration.dlo_reference : ''
    }

}

/**
 * Set Global Test Config
 * conditionally set the test_config (condition that the property is really there)
 */
const set_global_test_config = (test_config) => {
    log(chalk.bgYellowBright(test_config))
    // set co
    let trash;
    set_test_config('co_actuator', test_config.co.name);
    set_test_config('co_output', test_config.co.value);
    // set disturbances
    if (test_config.disturbances.length > 0) {
        test_config.disturbances.circulation_top !== '' ? set_test_config('circulation_top', test_config.disturbances.circulation_top) : trash = '';
        test_config.disturbances.circulation_bottom !== '' ? set_test_config('circulation_bottom', test_config.disturbances.circulation_bottom) : trash = '';
        test_config.disturbances.aircon !== '' ? set_test_config('aircon', test_config.disturbances.aircon) : trash = '';
        test_config.disturbances.heater !== '' ? set_test_config('heater', test_config.disturbances.heater) : trash = '';
        test_config.disturbances.humidifier !== '' ? set_test_config('humidifier', test_config.disturbances.humidifier) : trash = '';
        test_config.disturbances.intake !== '' ? set_test_config('intake', test_config.disturbances.intake) : trash = '';
        test_config.disturbances.exhaust !== '' ? set_test_config('exhaust', test_config.disturbances.exhaust) : trash = '';
    }
    // set op_level
    test_config.op_level.process_var === 'Temperature' ? set_test_config('Temperature', true) : trash = '';
    test_config.op_level.process_var === 'Humidity' ? set_test_config('Humidity', true) : trash = '';
    test_config.op_level.process_var === 'CO2' ? set_test_config('CO2', true) : trash = '';
    set_test_config('start_reference', test_config.op_level.start_reference);
    set_test_config('dlo', test_config.op_level.dlo);
    // terminators
    set_test_config('terminator', test_config.terminator);
    test_config.op_level.terminator === 'cycles' ? set_test_config('cycles_limit', test_config.cycles_limit) : trash = '';
    test_config.op_level.terminator === 'dlo_reference' ? set_test_config('dlo_refernce', test_config.dlo_refernce) : trash = '';
    test_config.op_level.terminator === 'steady_state' ? set_test_config('steady_state', true) : trash = '';
    get('test_config').then(config => log(chalk.green(JSON.stringify(config, null, '  '))))
}

/**
 * Create Test Suite Directory (ok)
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