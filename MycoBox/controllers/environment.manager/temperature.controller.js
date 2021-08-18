/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * #1) For the duration of a session, the system.controller continously calls its manage_environment() method,
 * which passes the environment state to the pid controllers (~ every 4 seconds)
 * #2) The PID Classes are defined in the service file for the controller, and the controller utilizes the PID class methods to
 * command the python child-processes running for each actuator.
 * #3) 
*/

const { s1r1_on, s1r1_off, s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');
const {TempPidController} = require('../../services/environment.manager/temperature.pid.service');

/**
 * Run PID:
 * Run the PID service with the latest measured value, and any configuration updates
 * @param kp weight for proprtional gain
 * @param ki weight for integral gain
 * @param kd weight for derivative gain
 * @param iLimit clamping limits for the integral; trigger flag
 */

/**
 * Override:
 * Purpose: Manually switch the acuator on or off if OVERRIDE is true
 * Description: Commands the selected actuator to turn on/off regardless of the global context (EnvModel, SystemStatus, ...)
 * @param {string, string} command {actuator: '', status: ''}
 */
override = async (command) => {
    switch (command.actuator) {
        case 'AC':
            if (command.status === 'ON') s1r1_on();
            if (command.status === 'OFF') s1r1_off();
            break;
        case 'HEATER':
            if (command.status === 'ON') s2r1_on();
            if (command.status === 'OFF') s2r1_off();
            break;

        default:
            break;
    }
}

module.exports = {
}


