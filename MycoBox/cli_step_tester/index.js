/* This is the Main script that prompts the user for the following:
*   - how many tests
    - restartCriteria:
        - humidity, temperature, co2
        note: must define restart threshold for at lest one process variable
*   - fill out each test please:
        Test #1
            - actuators:
                - H value
                - I value
                - E value
                - L value
                - C On/Off
            - number of read cycles:
        .
        .
        .
        Test #n
           - actuators:
                - H value
                - I value
                - E value
                - L value
                - C On/Off
            - number of read cycles:            
*/

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

/**
 * First Prompter
 * 1. for each selected environment variable generate a prompt for the min and max starting value
 * 2. map the answers to the configuration
 */
const prompt_configuration = () => {

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
            ]
        }
    ];

    inquirer.prompt(questions)
        .then(answers => {
            // add a new object to configuration for this test
            configuration.title = answers.title;
            let questions = [];
            log(chalk.white('\nDebug 1'));
            log(chalk.white('\nanswers 1'));
            log(chalk.white(JSON.stringify(answers, null, '  ')));
            // Ask for the Maximum starting value of each selected variable
            answers.env_variables.forEach(variable => {
                if (variable === 'Temperature') {
                    questions.push({
                        type: 'input',
                        message: 'Please enter the maximum temperautre in Celsisus acceptable for starting the test',
                        name: 'tempMinimum',
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
                        name: 'rhMinimum',
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
                        name: 'co2Minimum',
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
                log(chalk.white('Debug 2'));
                log(chalk.white("--------------------------------"))
                log(chalk.white("answers"))
                log(chalk.white(JSON.stringify(answers, null, '  ')))
                log(chalk.white("configuration"))
                log(chalk.yellow(JSON.stringify(configuration, null, '  ')))
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
                                { name: 'circulation' },
                                { name: 'aircon' },
                                { name: 'heater' },
                                { name: 'light' },
                            ]
                        }
                    ]
                    inquirer.prompt(questions)
                        .then(answers => {
                            let questions = []
                            log(chalk.white("\nDebug 3"));
                            log(chalk.white("--------------------------------"))
                            log(chalk.white("answers"))
                            log(chalk.white(JSON.stringify(answers, null, '  ')))
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
                            })

                            return questions
                        })
                        .then(questions => {
                            inquirer.prompt(questions)
                                .then(answers => {
                                    configuration = { ...configuration, ...answers }
                                    log(chalk.white("\nDebug 4"))
                                    log(chalk.yellow(JSON.stringify(configuration, null, '  ')))

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
                                                return prompt_configuration()
                                            }
                                            log(chalk.bold.blueBright(JSON.stringify(tests, null, '  ')))
                                            return configuration
                                        })
                                })
                        })

                })
        })
}

prompt_configuration()


/**
 * function ask() {
  inquirer.prompt(questions).then((answers) => {
    output.push(answers.tvShow);
    if (answers.askAgain) {
      ask();
    } else {
      console.log('Your favorite TV Shows:', output.join(', '));
    }
  });
}
 */


/**
 * Run Tests
 * Steps:
 * - Set the overrides_config (no env_config because we're overriding and sending specific actuator outputs)
 * - Update the environment state: make sure the sensors are working
 * - Start the Session: set the state as 'active_session'
 * - start the environment_manager // TODO: add step to em to check for overrides
 * - em will apply overrieds and report the sensor data
 * NOTE:
 * - the em needs to run in TEST MODE:
 *      - em uses override_config
 *      - session ends after given number of em cycles
 *      - report readings to a test log folder/ file per test
 *      
 */
const run_tests = () => {

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