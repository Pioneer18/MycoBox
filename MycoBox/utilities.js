const { PythonShell } = require("python-shell");
const fs = require('fs');
const { getter } = require("./globals/globals");
const chalk = require("chalk");
const { s8r2_on, s8r2_off, s2r1_on, s2r1_off, s6r2_off, s3r1_on, s3r1_off, s4r1_on, s4r1_off, s5r2_on, s5r2_off, s7r2_off, s7r2_on, s6r2_on, s1r1_off } = require("./cli_control_panel/relay");
const { greenBright } = require("chalk");
const { resolve } = require("path");
const log = console.log;

// cli_pid_calibrator/index.js calls this function in TEST mode
const send_command = (command, mode) => {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: mode === 'TEST' ? '../python' : 'MycoBox/python',
        args: [command]
    };
    log(chalk.bgBlack.whiteBright('Sending Command'))
    log(chalk.bgBlack.whiteBright(JSON.stringify(options, null, '  ')))
    return new Promise((resolve) => {
        PythonShell.run('dimmer.command.py', options, function (err, reply) {
            if (err) throw err;
            if (!reply) {
                console.log("Command Never received a response")
            }
            console.log(reply)
            resolve()
        })
    })
}

/**
 * Shutdown: Turn of all relays and end current sesssion
 */

/**
 *  Send Overrides: Send all override commands and flip corresponding relays
 */

/**
 * Create Timestamp
 */
const timestamp = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hh = today.getHours();
    const mm = today.getMinutes();
    const ss = today.getSeconds();

    return MM + '.' + dd + '.' + yyyy + '_' + hh + '.' + mm + '.' + ss;
}

/**
 * CreateDirectory
 */
const createDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        return true;
    }
}

/**
 * CreateFile with the initial test data
 * #1. DLO -> SP // adjust the prompt to ask for the DLO
 * #2. COi -> the initial could be something greater than 0, but likely 0
 * #3. COs -> the stepped computed output
 * #4. percent change in computed output
 * #5. the cycles count
 * #6. disturbances: circulation, ac, intake, exhaust (any actuator not related to selected PV for the test)
 * #7. print the top row for the logs:
 *     temp | humidity | co2 | dt | t | CO
 */
const createTestFile = (dir, tests, count) => {
    if (!fs.existsSync(`./${dir}/${tests[count].title}`)) {
        fs.writeFileSync(`./${dir}/${tests[count].title}.txt`, `${tests[count].title}: LOGS`)
    }
}

/**
 * NOTE: logger calls this on the final cycle log
 * Step Test Calculations: Run these on the calculated data after the session has made it's final log
 * #1. Kp: 
 *  - Kp describes the direction PV moves and how far it travels in response to a change in CO. It is based on the difference in steady state values. The path or length of time the PV takes to get to its new steady state does not enter into the Kp calculation.
 *  - Kp is computed as| Kp = (final pv - start pv) / total change in CO
 * #2. Tp:
 *  - In general terms, the time constant, Tp, describes how fast the PV moves in response to a change in the CO
 *  a. Determine ΔPV, the total change that is going to occur in PV, computed as “final minus initial steady state”
 *  b. Compute the value of the PV that is 63% of the total change that is going to occur, or “initial steady state PV + 0.63(ΔPV)”
 *  c. Note the time when the PV passes through the 63% point of “initial steady state PV + 0.63(ΔPV)”
 *  d. Subtract from it the time when the “PV starts a clear response” to the step change in the CO
 *  e. The passage of time from step 4 minus step 3 is the process time constant, Tp.
 *  notes: so need to grab dt somehow, and know how much time has passed between each reading to do this calculation
 * #3. Dp:
 *  a. Locate the point in time when the “PV starts a clear response” to the step change in the CO
 *  b. Locate the point in time when the CO was stepped from its original value to its new value.
 *  c. Dead time, Өp, is the difference in time of step 1 minus step 2.
 */
const test_calculations = () => {

}

/**
 * read the globals.overrides
 * switch the appropriate realys and send the set commands
 */
const send_overrides = () => {

    // .then(() => send_command("H 1", mode))
    // .then(() => send_command("E 1", mode))
    // .then(() => send_command("I 1", mode))
    // .then(() => send_command("L 1", mode))

    const overrides = getter('overrides');
    log(chalk.red('Send Overrides:'))
    log(chalk.redBright(JSON.stringify(overrides, null, '  ')));
    // loop overrides, switch boolean relays, switch edge dimmer and send commands
    return new Promise((resolve) => {
        if (overrides.flag) {
            // turn on the edge dimmer
            s5r2_on()
            // circulation top
            if (overrides.circulation_top !== false) {
                s8r2_on();
            }
            if (overrides.circulation_top === false) {
                s8r2_off();
            }
            // circulation bottom
            if (overrides.circulation_bottom === true) {
                s7r2_on();
            }
            if (overrides.circulation_bottom === false) {
                s7r2_off();
            }
            // aircon
            if (overrides.aircon === true) {
                s2r1_on();
            }
            if (overrides.aircon === false) {
                s2r1_off();
            }
            // heater
            if (overrides.heater === true) {
                s6r2_on()
                s3r1_on();
            }
            if (overrides.heater === false) {
                s6r2_off();
                s3r1_off();
            }
            // humidifier
            if (overrides.humidifier !== false) {
                // send_command('H 220', 'TEST').then(() => resolve())
                s4r1_on();
            }
            if (overrides.humidifier === false) {
                s4r1_off();
            }
            // intake
            if (overrides.intake !== false) {
                log(chalk.bgBlack.green('Sending Intake Command'))
                send_command('I 200', 'TEST').then(() => resolve())
            }
            // exhaust 
            resolve()
        }
        if (!overrides.flag) {
            // turn off the overrides
            log(chalk.magenta('Switching Off All Overrides'))
            s1r1_off()
            s2r1_off()
            s3r1_off()
            s4r1_off()
            s8r2_off()
            s7r2_off()
            s6r2_off()
            s5r2_off()
            resolve()
        }
    })
}

const send_all_commands = () => {

    return new Promise((resolve) => {
        send_command("H 1", 'TEST')
            .then(() => send_command("E 1", 'TEST'))
            .then(() => send_command("I 1", 'TEST'))
            .then(() => send_command("L 1", 'TEST'))
            .then(() => resolve())
    })
}

/**
 * create command for arduino
 */
const create_command = (actuator, value) => {

}

/**
 * From Step/Bump Test to FOPDT to Tuned Controller
 * ------------------------------------------------
 * 
 * 
 * 
 * 
 * 
 * step 4: The three FOPDT model parameters are used in correlations to compute controller tuning values
 * - Internal Model Control Tuning:
 * 
 */

module.exports = {
    send_command,
    timestamp,
    createDir,
    createTestFile,
    test_calculations,
    send_overrides,
    send_all_commands
}