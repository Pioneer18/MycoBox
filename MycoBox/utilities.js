const { PythonShell } = require("python-shell");
const fs = require('fs');

const send_command = (command, mode) => {
    console.log("Sending Command:")
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: mode === 'TEST' ? '../python' : 'MycoBox/python',
        args: [command]
    };
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
 * CreateFile
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

module.exports = {
    send_command,
    timestamp,
    createDir,
    createTestFile,
    test_calculations
}