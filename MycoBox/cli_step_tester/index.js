/**
 * Once the user has entered the test configuration, start the test session
 * - run an actual session
 * - pass in a configuration with overrides for the actuators for each test
 * - note: setup the newSession to apply overrides to the environment manager controllers' output
 * - keep a count of the number of readings completed
 * - end the session when the required number of readings are completed for the current test
 * - note: the main test runner should pass an updated session_config to end the session
 * - move on to the next test and begin the pre-test stage, then start the test when that's done
 * - when all tests are completed end the session and give the report to the user
 */
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;
const { } = require('../cli_control_panel/relay');
const { get, set_overrides_state, set_session_state, set_environment_config, getter } = require('../globals/globals');
const { environment_manager } = require('../services/system.service/system.service');
const { test_config } = require('./resources');
const fs = require('fs');
const { timestamp } = require('../utilities');

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

const tests = [];
let count = 0;
let live = false;
let dirCreated = false;
let dir;

/**
 * Prompt User to create tests amd push them into the tests array
 */
const prompt_test_configs = () => {

    // Test Configuration
    let configuration = {};

    /**
     * First Questions
     * 1. Title
     * 2. Which Environment Variables are being tested
     */
    const questions = [
        {
            type: 'input',
            name: 'title',
            message: 'Please enter a title for this test',
            validate(value) {
                if (typeof value === 'string' && value.length > 5) return true
                return 'Please enter a longer title'
            }
        },
        {
            type: 'checkbox',
            message: 'Select which environment variables are being tested',
            name: 'env_variables',
            choices: [
                { name: 'Temperature' },
                { name: 'Humidity' },
                { name: 'CO2' }
            ],
            validate(choices) {
                log(chalk.blackBright('Choices'))
                log(chalk.blackBright(choices))
                if (choices.length > 0) return true
            }
        }
    ];

    inquirer.prompt(questions)
        .then(answers => {
            // add a new object to configuration for this test
            configuration.title = answers.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let questions = [];
            // Ask for the Maximum starting value of each selected variable
            answers.env_variables.forEach(variable => {
                if (variable === 'Temperature') {
                    questions.push({
                        type: 'input',
                        message: 'Please enter the maximum temperautre in Celsisus acceptable for starting the test',
                        name: 'tempMaximum',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 0 && parseInt(value) <= 35)) return true
                            return 'Please choose a value larger than 0 and less than 35 degrees C'
                        }
                    })
                }
                if (variable === 'Humidity') {
                    questions.push({
                        type: 'input',
                        message: 'Please enter the maximum Relative Humidity acceptable for starting the test',
                        name: 'rhMaximum',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 10 && parseInt(value) <= 100)) return true
                            return 'Please choose a value larger than 0 and less than 35 degrees C'
                        }
                    })
                }
                if (variable === 'CO2') {
                    questions.push({
                        type: 'input',
                        message: 'Please enter the maximum CO2 ppm acceptable for starting the test',
                        name: 'co2Maximum',
                        validate(value) {
                            if (value = '' || value === undefined || (parseInt(value) >= 200 && parseInt(value) <= 20000)) return true
                            return 'Please choose a value larger than 199 and less than 20001 degrees C'
                        }
                    })
                }
            })
            return questions
        })
        .then(questions => {
            /**
             * Second Prompter
             * 1. ask the follow up qualifying questions
             * 2. map the answers to the configuration
             */
            inquirer.prompt(questions).then(answers => {
                configuration = { ...configuration, ...answers }
            })
                .then(() => {
                    const questions = [
                        {
                            type: 'checkbox',
                            message: 'Please select which actuators to run during the test',
                            name: 'actuators',
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
                            // for each actuator ask the output value will be
                            answers.actuators.forEach(actuator => {
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
                                        {
                                            type: 'input',
                                            name: 'cycles',
                                            message: 'Please enter the number of Environment Manager Cycles for this test',
                                            validate(value) {
                                                if (value && parseInt(value) > 0 && parseInt(value) < 51) return true
                                                return "Please enter a value greater than 0 and less than 51"
                                            }
                                        },
                                        {
                                            type: 'confirm',
                                            name: 'anotherTest',
                                            message: 'Do you want to add another test to the session? Click ENTER to answer YES, type NO to decline',
                                            default: true,
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
                                            if (answers.anotherTest === true) {
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
 *      
 */
const run_tests = () => {
    log(chalk.bold.cyan(JSON.stringify(tests, null, '  ')))
    log(chalk.cyan('Running each test in the tests array'))
    // create directory for test log files
    if (!dirCreated) {
        log(chalk.redBright(__dirname));
        dir = `../../../EM_LOGS/${timestamp()}`;
        log(chalk.blueBright(dir))
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            dirCreated = true;
        }
    }

    log(chalk.red(`count: ${count} test.length: ${tests.length}`));
    if (count < tests.length) {
        if (!live) {
            //===============================================================
            // create file for test
            console.log(tests[count].title)
            if (!fs.existsSync(`../../../EM_LOGS/${dir}/${tests[count].title}`)) {
                fs.appendFileSync(tests[count].title, tests[count].title + ' Logs:', function(err) {
                    if (err) throw new Error('Error Creating Test File for ' + tests[count].title)
                    console.log('Test File for ' + tests[count].title + ' has been created')
                })
            }
            // ===============================================================
            newTestSession(tests[count])
                .then(() => {
                    setTimeout(() => {
                        let session_state = getter('session_state');
                        console.log(`Here's ya DUCKIN' SESSION STATE!!!!!!!!!!!`);
                        console.log(session_state);
                        if (session_state.active_test_session) live = true;
                        // wait till test has completed
                        // while (live) {
                        //     setTimeout(() => {
                        //         console.log('****************************************** Checking If the Test is still Active ******************************************')
                        //         session_state = getter('session_state');
                        //         // if the test has ended
                        //         if (!session_state.active_test_session) live = false;
                        //     }, 60000);
                        // }
                        // increment count after test complete
                        log(chalk.bold.yellow('FIRST TEST RUNNING: INCREMENT'))
                        count++
                        // recall runTests
                        run_tests();
                        console.log('Run Tests Normally would Break the Loop Right Ducking Here')

                    }, 10000);
                })
        }
        if (live) {
            setTimeout(() => {
                console.log('Checking if the Test Has Ended Yet')
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
                                set_session_state('cycles_limit', parseInt(test_config.cycles))
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
                    console.log('Blank Overried Received')
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
            tempMaximum: configuration.tempMaximum ? configuration.tempMaximum : '',
            rhMaximum: configuration.rhMaximum ? configuration.rhMaximum : '',
            co2Maximum: configuration.co2Maximum ? configuration.co2Maximum : ''
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