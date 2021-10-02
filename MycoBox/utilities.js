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
                console.log("Humidifier Command Never Received Response")
            }
            console.log(reply)
            resolve()
        })
    })
}

module.exports = { send_command }