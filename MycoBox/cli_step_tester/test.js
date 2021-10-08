/**
 * Goal: One inquirer.prompt() and one dyncamic questions array
 * Notes: validate(value, answers); you can grab the previous answers
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
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;

// Question Flow Control Functions

const prompter = () => {
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


  inquirer.prompt(questions)
    .then(answers => {
      log(chalk.blue(JSON.stringify(answers, null, '  ')));
      // add answers to test config

      // ask next questions
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
            if (answers[disturbances] && answers[disturbances].includes('humidifier')) return true
          }
        },
        {
          type: 'input',
          name: 'intake',
          message: 'Select a CO percentage for the intake',
          when(answers) {
            if (answers[disturbances] && answers[disturbances].includes('intake')) return true
          }
        },
        {
          type: 'input',
          name: 'exhaust',
          message: 'Select a CO percentage for the exhaust',
          when(answers) {
            if (answers[disturbances] && answers[disturbances].includes('exhaust')) return true
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
        // #10. Another test?
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
          add_to_config(answers)
          prompt_again(answers)
        })

    })
}

const prompt_again = (answers) => {
  if (answers.anotherTest.toLowerCase() === 'y' || answers.anotherTest.toLowerCase() === 'yes') {
    return prompt_test_configs()
  }

  return run_tests()
}

const add_to_config = (answers) => {
  configuration = { ...configuration, ...answers }
  tests.push(configuration);
}
