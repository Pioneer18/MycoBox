const { PythonShell } = require("python-shell");

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

module.exports = { send_command }