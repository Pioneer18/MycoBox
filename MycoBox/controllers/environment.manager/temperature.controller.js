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


// import realy controls
const { s1r1_on, s1r1_off, s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');

/**
 * PID Controller Class
 * @param {number} kp proportional gain
 * @param {number} ki integral gain
 * @param {number} kd derivative gain
 * @param {min: number, max: number} iLimit limits for the integral
 */
class TempPidController {
    constructor(kp, ki, kd, iLimit) {
        // saturation has been reached if these limits are hit and clamping should happen
        let defaultIntegralLimit = { min: -1000, max: 1000}
        // Set PID weights (gain)
        this.kp = kp || 1;
        this.ki = ki || 0;
        this.kd  = kd || 0;
        // init properties for the integral of error
        this.integralLimit = iLimit || defaultIntegralLimit;
        this.integralOfError = 0;
        this.lastError = 0;
        this.lastTime = 0;
        // init the set point
        this.setPoint = 0;
    }

    async setPoint(setPoint) {
        this.setPoint = setPoint;
    }

    async update(measured) {
        // validate the measure value
        if(!measured) throw new Error('invalid value');
        this.measured = measured;
        // find the interval of time between previous and current reading
        let dt;
        let currentTime = Date.now();
        if (this.lastTime === 0) {
            dt = 0 
        } else {
            dt = (currentTime - this.lastTime) / 1000;
        }
        this.lastTime = currentTime;
        // calculate the error and integral of the error; the total of error x time passed till current reading
        let error = (this.setPoint - this.measured);
        this.integralOfError += error * dt; 
        if (this.integralOfError > this.integralLimit.max) this.integralOfError = this.integralLimit.max;
        if (this.integralOfError < this.integralLimit.min) this.integralOfError = this.integralLimit.min;
        // calculate the derivative of the error: rate of change
        let derivativeOfError = (error - this.lastError) / dt;
        this.lastError = error;

        return (this.kp * error) + (this.ki * this.integralOfError) + (this.kd * this.derivativeOfError);
    }

    async reset () {
        this.integralOfError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    }
}

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
    TempPidController,
    override,
}


