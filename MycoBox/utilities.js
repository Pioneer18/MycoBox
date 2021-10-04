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

module.exports = {
    send_command,
    timestamp,
    createDir,
    createTestFile
}