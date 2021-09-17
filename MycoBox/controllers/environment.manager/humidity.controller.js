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
const {HumidityPidController} = require("../../services/environment.manager/humidity.pid.service")

/**
 * Create HumidityPidController config
 */
 const humidity_pid_controller_config = (measured, env_config, pid_state) => {
    console.log('Method Call: temp_pid_controller_config')
    const config = {
        settings: {
            kp: 1,
            ki: 0.005,
            kd: 0.005,
            iLimit: {
                min: 0,
                max: 300
            }
        },
        pid_state: {
            integralOfError: pid_state.integralOfError,
            lastError: pid_state.lastError,
            lastTime: pid_state.lastTime,
        },
        incoming_report: {
            setPoint: env_config.humidity,
            measured: measured.humidity
        }
    }
    return config
}
/**
 * Update Humidity:
 * run the PID service with the latest measured value, and any configuration updates
 * @param {
 *  settings: {
 *    kp,
 *    ki,
 *    kd,
 *    iLimit  
 *  },
 *  previousReport: {
 *    integralOfError,
 *    lastError,
 *    lastTime
 *  }
 *  incomingReport: {
 *    setPoint,
 *    measured
 *  } 
 * } config 
 */
const update_humidity = (config) => {
    // initialize the controller
    const humidityController = new HumidityPidController(config);
    // update the actuator
    const value = humidityController.update();
    console.log('The Humidity Calculated Update Value')
    console.log(value);
    set_pid_state('humidity', humidityController.report())
    // humidity_actuator_controller(value)
    return value
}
// process the update value into an appropriate Dimmer Value (convert 1 - 450 to a percentage)
// Send the Command with the Dimmer value; e.g. "H 300"
// Use the relay to turn the Humidifier on or Off when appropriate


// Right NOW, just test sending a command to the raspi_to_mega.py file and turning the dimmer
// on correctly. And focus on making the single shot communication between arduino and raspi work
// this is fundamental functionality to using the dimmers
const send_command = (command) => {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '../../python',
        args: [command]
    };
    PythonShell.run('raspi.to.mega.py', options, function (err, reply) {
        if (err) throw err;
        console.log(reply)
    })
}

send_command('H 110');

module.exports = {
    humidity_pid_controller_config,
    update_humidity,
    send_command
}