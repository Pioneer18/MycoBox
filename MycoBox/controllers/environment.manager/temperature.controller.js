/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * Could be that the controller calls it everytime with env_sate, and runs the function with the previous report
*/

const { s1r1_on, s1r1_off, s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');
const { TempPidController } = require('../../services/environment.manager/temperature.pid.service');


/**
 * Run PID:
 * Run the PID service with the latest measured value, and any configuration updates
 * 
 * @param { number } kp weight for proprtional gain
 * @param { number } ki weight for integral gain
 * @param { number } kd weight for derivative gain
 * @param { max, min } iLimit limits for the integral
 * @param {
 *  previousReport: {
 *    integralOfError,
 *    lastError,
 *    lastTime
 *  }
 *  incomingReport: {
 *    setPoint,
 *    measured
 *  } 
 * } reports the previous (or initial) report & the incoming
 */
updateEnvironment = async (config) => {
    try {
        // validate the config object
        validateConfig(config);
        // initialize the controller
        const tempController = new TempPidController(config);
        // update the actuator
        tempController.update()
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

validateConfig = async (config) => {
    if (!config) throw new Error('Invalid Config Object!, it`s undefined or somethign')
    if (!config.settings) throw new Error('Invalid config.settings')
    if (!config.settings.kp || typeof config.settings.kp === 'number') throw new Error('Invalid `config.settings.kp`')
    if (!config.settings.ki || typeof config.settings.ki === 'number') throw new Error('Invalid `config.settings.ki`')
    if (!config.settings.kd || typeof config.settings.kd === 'number') throw new Error('Invalid `config.settings.kd`')
    if (!config.settings.iLimit)
    if (!config.settings.iLimit.max || typeof config.settings.iLimit.max !== 'number')
    if (!config.settings.iLimit.min || typeof config.settings.iLimit.min !== 'number')
    if (!config.previousReport) throw new Error('Invalid config.previousReport')
    if (!config.previousReport.integralOfError || typeof config.previousReport.integralOfError !== 'number') throw new Error('Invlaid config.previousReport.integralOfError')
    if (!config.previousReport.lastError || typeof config.previousReport.lastError !== 'number') throw new Error('Invlaid config.previousReport.lastError')
    if (!config.previousReport.lastTime || typeof config.previousReport.lastTime !== 'number') throw new Error('Invlaid config.previousReport.lastTim')
    if (!config.incomingReport || typeof config.incomingReport !== 'number') throw new Error('Invalid config.incomingReport')
    if (!config.incomingReport.setPoint || typeof config.incomingReport.setPoint !== 'number') throw new Error('Invalid config.incomingReport.setPoint')
    if (!config.incomingReport.measured || typeof config.incomingReport.measured !== 'number') throw new Error('Invalid config.incomingReport.measured')
    return
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
}


