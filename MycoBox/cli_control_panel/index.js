const inquirer = require('inquirer')
const chalk = require('chalk')
const log = console.log;
let firstRun = true;
const relay = require('./relay');
const { bgRed } = require('chalk');
const { s4r1_on, s4r1_off } = require('./relay');

/**
 * MycoBox CLI Overrides:
 * Purpose: Program for controling each actuator's override switch, but may become cli application
 * for starting and controlling a MycoBox Session! Yep, even with the internet down or no electronic
 * device besides the MycoBox itself, if you have a keyboard you can run a session and still locally
 * log all session data. It can be uploaded later (auto) or stored on the external memory (SSD)
 */
const MycoCLI = () => {
    // Welcome
    if (firstRun === true) {
        log(chalk.green(`======================================================================
                        Welcome to MycoBox CLI
======================================================================
MycoBox CLI is used for:
  1) Controlling each actuator's override switch
  2) Interfacing with MycoBox's sensors
  * this program will grow to control starting and managing a mycobox session
  
To give a command select a relay and add _0 or _1 to switch it ON or OFF; 0 = ON , 1 = OFF
e.g. S1R1_0 will turn on the 1st switch of Relay #1

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
                name: 'command:',
                type: 'input',
                message: chalk.white('Please enter a Command'),
                validate: (value) => {
                    if (value === "EXIT") process.exit();
                    if (value === 'S1R1_0' ||
                        value == 'S1R1_1' ||
                        value == 'S2R1_0' ||
                        value == 'S2R1_1' ||
                        value == 'S3R1_0' ||
                        value == 'S3R1_1' ||
                        value == 'S4R1_0' ||
                        value == 'S4R1_1' ||
                        value == 'S1R2_0' ||
                        value == 'S1R2_1' ||
                        value == 'S2R2_0' ||
                        value == 'S2R2_1' ||
                        value == 'S3R2_0' ||
                        value == 'S3R2_1' ||
                        value == 'S4R2_0' ||
                        value == 'S4R2_1' ||
                        value == 'S5R2_0' ||
                        value == 'S5R2_1' ||
                        value == 'S6R2_0' ||
                        value == 'S6R2_1' ||
                        value == 'S7R2_0' ||
                        value == 'S7R2_1' ||
                        value == 'S8R2_0' ||
                        value == 'S8R2_1') return true;
                    log(chalk.red('Please enter a valid command'))
                    return false;
                }
            }
        ]).then((command) => {
            firstRun = false;
            let cmnd = JSON.stringify(command).slice(13, 19);
            if (cmnd === 'S1R1_0') {
                log(chalk.bgRed('S1R1_0: Turn Relay 1 Switch 1 ON'))
                relay.s1r1_on()
            }
            if (cmnd === 'S1R1_1') {
                log(chalk.bgRed('S1R1_1: Turn Relay 1 Switch 1 OFF'))
                relay.s1r1_off()
            }
            if (cmnd === 'S2R1_0') {
                log(chalk.bgRed('S2R1_0: Turn Relay 1 Switch 2 ON'))
                relay.s2r1_on()
            }
            if (cmnd === 'S2R1_1') {
                log(chalk.bgRed('S2R1_1: Turn Relay 1 Switch 2 OFF'))
                relay.s2r1_off()
            }
            if (cmnd === 'S3R1_0') {
                log(chalk.bgRed('S3R1_0: Turn Relay 1 Switch 3 ON'))
                relay.s3r1_on()
            }
            if (cmnd === 'S3R1_1') {
                log(chalk.bgRed('S3R1_1: Turn Relay 1 Switch 3 OFF'))
                relay.s3r1_off()
            }
            if (cmnd === 'S4R1_0') {
                log(chalk.bgRed('S4R1_0: Turn Relay 1 Switch 4 ON'))
                s4r1_on()
            }
            if (cmnd === 'S4R1_1') {
                log(chalk.bgRed('S4R1_1: Turn Relay 1 Switch 4 OFF'))
                s4r1_off()
            }
            if (cmnd === 'S1R2_0') {
                log(chalk.bgRed('S1R2_0: Turn Relay 2 Switch 1 ON'))
                relay.s1r2_on()
            }
            if (cmnd === 'S1R2_1') {
                log(chalk.bgRed('S1R2_1: Turn Relay 2 Switch 1 OFF'))
                relay.s1r2_off()
            }
            if (cmnd === 'S2R2_0') {
                log(chalk.bgRed('S2R2_0: Turn Relay 2 Switch 2 ON'))
                relay.s2r2_on()
            }
            if (cmnd === 'S2R2_1') {
                log(chalk.bgRed('S2R2_1: Turn Relay 2 Switch 2 OFF'))
                relay.s2r2_off()
            }
            if (cmnd === 'S3R2_0') {
                log(chalk.bgRed('S3R2_0: Turn Relay 2 Switch 3 ON'))
                relay.s3r2_on()
            }
            if (cmnd === 'S3R2_1') {
                log(chalk.bgRed('S3R2_1: Turn Relay 2 Switch 3 OFF'))
                relay.s3r2_off()
            }
            if (cmnd === 'S4R2_0') {
                log(chalk.bgRed('S4R2_0: Turn Relay 2 Switch 4 ON'))
                relay.s4r2_on()
            }
            if (cmnd === 'S4R2_1') {
                log(chalk.bgRed('S4R2_1: Turn Relay 2 Switch 4 OFF'))
                relay.s4r2_off()
            }
            if (cmnd === 'S5R2_0') {
                log(chalk.bgRed('S5R2_0: Turn Relay 2 Switch 5 ON'))
                relay.s5r2_on()
            }
            if (cmnd === 'S5R2_1') {
                log(chalk.bgRed('S5R2_1: Turn Relay 2 Switch 5 OFF'))
                relay.s5r2_off()
            }
            if (cmnd === 'S6R2_0') {
                log(chalk.bgRed('S6R2_0: Turn Relay 2 Switch 6 ON'))
                relay.s6r2_on()
            }
            if (cmnd === 'S6R2_1') {
                log(chalk.bgRed('S6R2_1: Turn Relay 2 Switch 6 OFF'))
                relay.s6r2_off()
            }
            if (cmnd === 'S7R2_0') {
                log(chalk.bgRed('S7R2_0: Turn Relay 2 Switch 7 ON'))
                relay.s7r2_on()
            }
            if (cmnd === 'S7R2_1') {
                log(chalk.bgRed('S7R2_1: Turn Relay 2 Switch 7 OFF'))
                relay.s7r2_off()
            }
            if (cmnd === 'S8R2_0') {
                log(chalk.bgRed('S8R2_0: Turn Relay 2 Switch 8 ON'))
                relay.s8r2_on()
            }
            if (cmnd === 'S8R2_1') {
                log(chalk.bgRed('S8R2_1: Turn Relay 2 Switch 8 OFF'))
                relay.s8r2_off()
            }

            MycoCLI();
        });
    // execute command
    // log results to console



}

const COMMANDS = {
    EXIT: 'EXIT',
    S1R1_ON: 'S1R1_0',
    S1R1_OFF: 'S1R1_1',
    S2R1_ON: 'S2R1_0',
    S2R1_OFF: 'S2R1_1',
    S3R1_ON: 'S3R1_0',
    S3R1_OFF: 'S3R1_1',
    S4R1_ON: 'S4R1_0',
    S4R1_OFF: 'S4R1_1',
    S1R2_ON: 'S1R2_0',
    S1R2_OFF: 'S1R2_1',
    S2R2_ON: 'S2R2_0',
    S2R2_OFF: 'S2R2_1',
    S3R2_ON: 'S3R2_0',
    S3R2_OFF: 'S3R2_1',
    S4R2_ON: 'S4R2_0',
    S4R2_OFF: 'S4R2_1',
    S5R2_ON: 'S5R2_0',
    S5R2_OFF: 'S5R2_1',
    S6R2_ON: 'S6R2_0',
    S6R2_OFF: 'S6R2_1',
    S7R2_ON: 'S7R2_0',
    S7R2_OFF: 'S7R2_1',
    S8R2_ON: 'S8R2_0',
    S8R2_OFF: 'S8R2_1',
}

// Start the program
MycoCLI();