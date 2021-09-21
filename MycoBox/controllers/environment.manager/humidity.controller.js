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
const { set_pid_state, get, set_actuator_state } = require('../../globals/globals');
const { HumidityPidController } = require("../../services/environment.manager/humidity.pid.service")
const { s3r1_on, s3r1_off, s5r2_on, s5r2_off } = require('../../cli_control_panel/relay');

let placeholder = false;

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
    console.log(config)
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
// Right now this will return a raw pid update value, no wrapper logic applied; e.g. normalizing to the AC phase module's fan speeds scale
const update_humidity = (config) => {
    return new Promise((resolve) => {  // initialize the controller
        const humidityController = new HumidityPidController(config);
        // update the actuator
        const value = humidityController.update();
        console.log('The Humidity Calculated Update Value')
        console.log(value);
        set_pid_state('humidity', humidityController.report())
        humidity_actuator_controller(value)
        resolve(value)
    })
}
// process the update value into an appropriate Dimmer Value (convert 1 - 450 to a percentage)
const normalize_update = () => {

}
// Use the relay to turn the Humidifier on or Off when appropriate (pid indicates this? nah...controller logic )
const humidity_actuator_controller = () => {
    return new Promise((resolve) => {
        send_command("H 125")
            .then(() => {
                s5r2_on()
                setTimeout(() => {
                    resolve();
                }, 4000);
            })
    })
}
// Send the Command with the Dimmer value; e.g. "H 300"
const send_command = (command) => {
    console.log("Sending Humidifier Command: ---------------------------")
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: 'MycoBox/python',
        args: [command]
    };
    return new Promise((resolve) => {
        PythonShell.run('raspi.to.mega.py', options, function (err, reply) {
            if (err) throw err;
            console.log("Reply From the Humidifier Command")
            console.log(reply)
            // set the state to active or off 
            // if (!placeholder) {
            //     console.log("Switching the Fan on Now!")
            //     s5r2_on();
            //     placeholder = true;
            // }
            resolve()
        })
    })
}
module.exports = {
    humidity_pid_controller_config,
    update_humidity,
    send_command
}