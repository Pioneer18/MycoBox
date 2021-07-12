const inquirer = require('inquirer')
const chalk = require('chalk')
const log = console.log;
let firstRun = true;

/**
 * MycoBox CLI Overrides:
 * Purpose: Program for controling each actuator's override switch, but may become cli application
 * for starting and controlling a MycoBox Session! Yep, even with the internet down or no electronic
 * device besides the MycoBox itself, if you have a keyboard you can run a session and still locally
 * log all session data. It can be uploaded later (auto) or stored on the external memory (SSD)
 */
const MycoCLI = () => {
    // Welcome
    if(firstRun === true){log(chalk.green(`======================================================================
                        Welcome to MycoBox CLI
======================================================================
MycoBox CLI is used for:
  1) Controlling each actuator's override switch
  2) Interfacing with MycoBox's sensors
  * this program will grow to control starting and managing a mycobox session
  
To give a commend select a relay and add _ON or OFF;
e.g. S1R1_ON will turn on the 1st switch of Relay #1

RELAY #1
- S1R1    
- S2R1
- S3R1
- S4R1

RELAY #2
- S1R2
- S2R2
- S3R2
- S4R2
- S5R2
- S6R2
- S7R2
- S8R2
`
    ))
}
    // Prompt user for command
    inquirer
        .prompt([
            {
                name: 'COMMAND:',
                type: 'input',
                message: chalk.white('Please enter a Command'),
                validate: (value) => {
                    if (value === "EXIT") process.exit();
                    if (value === 'S1R1_ON' ||
                        value == 'S1R1_OFF' ||
                        value == 'S2R1_ON' ||
                        value == 'S2R1_OFF' ||
                        value == 'S3R1_ON' ||
                        value == 'S3R1_OFF' ||
                        value == 'S4R1_ON' ||
                        value == 'S4R1_OFF' ||
                        value == 'S1R2_ON' ||
                        value == 'S1R2_OFF' ||
                        value == 'S2R2_ON' ||
                        value == 'S2R2_OFF' ||
                        value == 'S3R2_ON' ||
                        value == 'S3R2_OFF' ||
                        value == 'S4R2_ON' ||
                        value == 'S4R2_OFF' ||
                        value == 'S5R2_ON' ||
                        value == 'S5R2_OFF' ||
                        value == 'S6R2_ON' ||
                        value == 'S6R2_OFF' ||
                        value == 'S7R2_ON' ||
                        value == 'S7R2_OFF' ||
                        value == 'S8R2_ON' ||
                        value == 'S8R2_OFF') return true;
                    log(chalk.red('Please enter a valid command'))
                    return false;
                }
            }
        ]).then((answer) => {
            firstRun = false;
            log(chalk.blue(JSON.stringify(answer)));
            MycoCLI();
        });
    // execute command
    // log results to console



}

// Start the program
MycoCLI();