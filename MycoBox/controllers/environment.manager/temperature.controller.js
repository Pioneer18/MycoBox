/**
 * Temperature Controller: PID and Overrides
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 * ----------------------
 * How this is going to work: 
 * Could be that the controller calls it everytime with env_sate, and runs the function with the previous report
*/

const { set_pid_state, get, set_actuator_state } = require('../../globals/globals');
const { TempPidController } = require('../../services/environment.manager/temperature.pid.service');
const { s2r1_off, s2r1_on, s1r1_on, s4r1_on, s6r2_on, s4r1_off, s6r2_off } = require('../../cli_control_panel/relay');

/**
 * Run PID:
 * Run the PID service with the latest measured value, and any configuration updates
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
 * } config the previous (or initial) report & the incoming
 */
const update_temperature = (config) => {
    return new Promise((resolve) => { // initialize the controller
        const tempController = new TempPidController(config);
        // update the actuator
        const value = tempController.update();
        console.log('The Temperature Calculated Update Value')
        console.log(value);
        set_pid_state('temperature', tempController.report())
        temp_actuator_controller(value)
            .then(value => resolve(value))
    })
}

/**
 * Create TemperauturePidController config
 */
const temp_pid_controller_config = (measured, env_config, pid_state) => {
    console.log('Method Call: temp_pid_controller_config')
    const config = {
        settings: {
            kp: 1,
            ki: 0.005,
            kd: 0.005,
            // iLimit
        },
        pid_state: {
            integralOfError: pid_state.integralOfError,
            lastError: pid_state.lastError,
            lastTime: pid_state.lastTime,
        },
        incoming_report: {
            setPoint: env_config.temperature,
            measured: measured.temperature
        }
    }
    return config
}

/**
 * Override:
 * Purpose: Manually switch the acuator on or off if OVERRIDE is true
 * Description: Commands the selected actuator to turn on/off regardless of the global context (EnvModel, SystemStatus, ...)
 * @param {string, string} command {actuator: '', status: ''}
 */
const override = (command) => {
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

/**
 * Temp Actuator Controller
 * if the update value is greater or equal than +/- 1 from 0 for 3 consecutive readings, then turn on the appropriate acuator and enter 'set mode'
 * once the update value hits within 0.2 of zero or switches positive/negative, stop and don't start until more than or equal to +/-1 from 0 again
 * actuator will stay on till update value can reach .2 of 0, and then it'll switch on again once the update is > or = +/- 1 for 3 consecutive readings
 */
const temp_actuator_controller = (update) => {
    // #2. Check the actuator state
    return new Promise((resolve) => {
        get('actuators_state')
        // The switch on threshold (st) should be a variable
        .then(state => {
            if (state.ac.active) {
                // check if update is within -0.2 from 0
                console.log("AC Active ----")
                const idle = idle_check(update, false)
                switch (idle) {
                    case 1: // AC switches to idle
                        set_actuator_state('ac', 'active', false).then(set_actuator_state('ac', 'idle', 1))
                        break;

                    case 2: // AC stays ON
                        set_actuator_state('ac', 'active', true)
                        break;

                    default:
                        break;
                }
            }
            if (state.ac.stopped) {
                // Start if more than .5 or .7 off not 1
                console.log('AC Stopped --------')
                const stopped = remain_stopped_check(update, false)
                switch (stopped) {
                    case 1: // AC stays OFF
                        console.log('AC Remain Stopped')

                        break;

                    case 2: // AC switches ON
                        console.log('AC Switching Active')
                        set_actuator_state('ac', 'stopped', false).then(set_actuator_state('ac', 'active', true).then(() => s2r1_on()))
                        break;

                    default:
                        break;
                }
            }
            if (state.ac.idle > 0) {
                console.log('temp_acutator_controller: Idle ---- ' + state.ac.idle)
                const idle = idle_check(update, false)
                switch (idle) {
                    case 2: // switch back to active
                        console.log('AC Switching Back to Active')
                        set_actuator_state('ac', 'idle', 0).then(set_actuator_state('ac', 'active', true))
                        break;

                    case 1: // increment up or switch to stopped and turn off the ac
                        if (state.ac.idle >= 3) {
                            console.log('AC Switching OFF From Idle ')
                            set_actuator_state('ac', 'idle', 0).then(set_actuator_state('ac', 'stopped', true)).then(() => s2r1_off())
                        } else {
                            const increment = (state.ac.idle + 1)
                            console.log('Increment: ' + increment)
                            set_actuator_state('ac', 'idle', increment)
                        }
                        break;

                    default:
                        break;
                }
            }
            // Heater Protocol
            if (state.heater.active) {
                console.log('Heater Active ---')
                const idle = idle_check(update, true)
                switch (idle) {
                    case 3: // Heater switches to idle
                        set_actuator_state('heater', 'active', false).then(set_actuator_state('heater', 'idle', 1))
                        break;

                    case 4: // Heater stays on
                        set_actuator_state('heater', 'active', true)
                        break;

                    default:
                        break;
                }
            }
            if (state.heater.stopped) {
                // start if more than .5 off from the setpoint
                console.log('Heater Stopped -------')
                const stopped = remain_stopped_check(update, true)
                switch (stopped) {
                    // less than 0.6, remain stopped
                    case 3:
                        console.log('Heater Remain Stopped')
                        break;
                    // greater than 0.6, switch on
                    case 4:
                        console.log('Heater Switching Active')
                        set_actuator_state('heater', 'stopped', false).then(set_actuator_state('heater', 'active', true).then(() => {
                            s4r1_on()
                            s6r2_on()
                        }))
                        break;

                    default:
                        break;
                }
            }
            if (state.heater.idle > 0) {
                console.log('Heater Idle --- ' + state.heater.idle)
                const idle = idle_check(update, true)
                switch (idle) {
                    case 4: // switch back to active
                        console.log('Heater switching back to active')
                        set_actuator_state('heater', 'idle', 0).then(set_actuator_state('heater', 'active', true))
                        break;

                    case 3: // increment up or switch to stopped and turn off the heater
                        if (state.heater.idle > 2) {
                            console.log('Heater Switching OFF from Idle')
                            set_actuator_state('heater', 'idle', 0).then(set_actuator_state('heater', 'stopped', true)).then(() => {
                                s4r1_off()
                                s6r2_off()
                            })
                        } else {
                            const increment = (state.heater.idle + 1)
                            console.log('Increment: ' + increment)
                            set_actuator_state('heater', 'idle', increment)
                        }
                        break;

                    default:
                        break;
                }
            }
            resolve()
        })
    })
}

/**
 * 
 * @param {*} update 
 * @returns
 * 1: AC switches to idle
 * 2: AC stays ON
 * 3: Heater stays OFF
 * 4: Heater turn ON
 */
const idle_check = (update, sign) => {
    console.log('Idle Check Starting')
    // check if within .2 for sign
    switch (sign) {
        // positive sign
        case true:
            console.log('Idle Check: Positive Sign')
            // within .2 of zero
            if (update <= 0.35) {
                console.log('Within 0.2')
                return 3
            }
            // more than .2 from zero
            if (update > 0.35) {
                console.log('Outside 0.2')
                return 4
            }
            break;
        // negative sign
        case false:
            console.log('Idle Check: Negative Sign')
            // within -.2 of zer0
            if (update > -0.2) {
                console.log('Within 0.2')
                return 1
            }
            // less than -.2
            if (update < -0.2) {
                console.log('Outside 0.2')
                return 2
            }
            break;

        // default
        default:
            break;
    }
}

/**
 * 
 * @param {*} update 
 * @returns
 * 1: AC stay OFF
 * 2: AC turn ON
 * 3: Heater stay OFF
 * 4: Heater turn ON
 */
//NOTE: the comparator value should be a parameter?
const remain_stopped_check = (update, sign) => {
    // check if within .2 for sign
    switch (sign) {
        // positive sign
        case true:
            console.log('Remain Stopped Check: Positive Sign')
            // within 1 of zero
            if (update <= .6) {
                console.log('Update is Less than .5 greater than 0')
                return 3
            }
            // more than 1 from zero
            if (update > 0.6) {
                console.log('Update is Greater than 1 from 0')
                return 4
            }
            break;
        // negative sign
        case false:
            console.log('Remain Stopped Check: Negative Sign')
            // within -1 of 0
            if (update > -0.6) {
                console.log('Within -0.6')
                return 1
            }
            // more than -1 from zero
            if (update < -0.6) {
                console.log('Outside -0.6')
                return 2
            }
            break;
        // default
        default:
            break;
    }
}


module.exports = {
    update_temperature,
    temp_pid_controller_config,
    override
}


