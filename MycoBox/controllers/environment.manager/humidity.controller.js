/**
 * Humidifier PID Controller
 * -------------------------
 * This controller calculates a PID udpate value to be sent to the Mega controlled Dimmer for the Humidifier Fan
 * It passes it's command to the raspi_to_mega.py file. Humidifier Command will start with an 'H' and end with a
 * value (The error will need to be translated to an appropriate Dimmer value)
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 */

const { PythonShell } = require("python-shell")

// Create a HumidityPidController 
// Generate a config for the controller
// Use the controller's udpate method to get an upadte value
// process the update value into an appropriate Dimmer Value (convert 1 - 450 to a percentage)
// Send the Command with the Dimmer value; e.g. "H 300"
// Use the relay to turn the Humidifier on or Off when appropriate


// Right NOW, just test sending a command to the raspi_to_mega.py file and turning the dimmer
// on correctly. And focus on making the single shot communication between arduino and raspi work
// this is fundamental functionality to using the dimmers
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../../python',
};
const send_command = (command) => {
    console.log('Current Directory:')
    console.log(__dirname)
    PythonShell.run('temp.humidity.py', options, function (err, reply) {
        if (err) throw err;
        console.log('Hello, World!')
        console.log(reply)
    })
}

send_command("H 25");