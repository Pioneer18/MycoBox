/**
 * Goal: One inquirer.prompt() and one dyncamic questions array
 * Notes: validate(value, answers); you can grab the previous answers
 */
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;

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
      { name: 'Temperature' },
      { name: 'Humidity' },
      { name: 'CO2' }
    ],
  },
  // #3. DLO for the Process Variable
  {
    type: 'input',
    name: 'dlo',
    message: 'Enter a design level of operation PV for this test',
    validate(value) {
      // TODO: Add range limits for temp, hum, co2
      if (parseInt(value) > 0 || parseInt(value) < 0) return true
      return 'Enter a number'
    }
  },
  // #4. Starting point
  {
    type: 'input',
    name: 'starting_point',
    message: 'Select a starting point PV that is at least 2 units above/below the DLO',
    validate(value, answers) {
      if ((parseInt(value) > 0 || parseInt(value) < 0)
        && Math.abs(parseInt(answers['dlo']) - parseInt(value)) > 2) return true
      return "Choose a starting point that is more than +/-2 units from the DLO"
    }
  },
  // #5. Switch OFF if new Steady State reached
  {
    type: 'confirm',
    name: 'steady_switch_off',
    message: 'Enter `y` if you`d like for the Test to end before the cycle limit when a new Steady State is detected',
    default: false
  },
  // #6. Computed Output for the Actuator
  {
    type: 'input',
    name: 'co',
    message: 'Please select an output percentage from 0 to 100 percent for the actuator',
    validate(value, answers) {
      // must be between 0 and 100
      // TODO: correlate each actuators range to a percentage
      if (parseInt(value) >= 0 && parseInt(value) <= 100) return true
      return 'Select an output percentage from 0 to 100'
    }
  }
]

inquirer.prompt(questions)
  .then(answers => {
    log(chalk.blue(JSON.stringify(answers, null, '  ')));
  })
