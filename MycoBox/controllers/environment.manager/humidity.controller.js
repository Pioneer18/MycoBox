/**
 * Humidifier PID Controller
 * -------------------------
 * This controller calculates a PID udpate value to be sent to the Mega controlled Dimmer for the Humidifier Fan
 * It passes it's command to the raspi_to_mega.py file. Humidifier Command will start with an 'H' and end with a
 * value (The error will need to be translated to an appropriate Dimmer value)
 * design of PID greatly influenced by https://github.com/Philmod/node-pid-controller/blob/master/lib/index.js 
 * & https://gist.github.com/DzikuVx/f8b146747c029947a996b9a3b070d5e7
 */

const { set_pid_state } = require('../../globals/globals');
const { HumidityPidController } = require("../../services/environment.manager/humidity.pid.service")
const { s3r1_on, s3r1_off} = require('../../cli_control_panel/relay');
const { send_command } = require("../../utilities");

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
            dt: pid_state.dt
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
const update_humidity = (config, mode) => {
    return new Promise((resolve) => {
        const humidityController = new HumidityPidController(config);
        // update the actuator
        let value = humidityController.update();
        console.log('The Humidity PID Output Normalized to Actuator Output Range');
        value = normalize_update(value);
        console.log(value);
        set_pid_state('humidity', humidityController.report())
        if (mode !== 'TEST') {
            humidity_actuator_controller(value)
                .then(()=>resolve());
        }
        resolve(value);
    })
}
/**
 * Process the update value into an appropriate Dimmer Value (convert value to reange of 1 - 450)
 * Update value is going to be approx. 0 ~ 60 at max (old range)
 * @param {*} value the Humidity PID update value
 * Note: assume the gain-schedule and PID have been calibrated; so this 'Value' is a good rep of how far the humidity needs to shift.
 * Note: (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
 */
const normalize_update = (value) => {
    const OldRange = 60 - 0; 
    const NewRange = 420 - 10;
    const normalized = (((value - 0) * NewRange) / OldRange);
    const inverted = 1 - (normalized/410) * 410;
    return inverted;
}

// Use the relay to turn the Humidifier on or Off when appropriate (pid indicates this? nah...controller logic )
const humidity_actuator_controller = (value) => {
    return new Promise((resolve) => {
        console.log(`Hello Humidity Actuator Controller Here\nAnd Here's the Value ${value}\nSending command Now`);
        send_command(`H ${value}`)
        resolve()
    })
}



// I can run this through calibration, so that the appropriate gain is used for the PID to settle the humidifier,
// I have AC Phase Edge controller, so I can precise throttle Humidity via a PID feedback loop; just need to run humidifier
// through calibration tests...see how long does environment take to reach dlo for different dlo's. This way I can make
// a gain schedule. So if I'm setting the Humidity high, the gain will be different than if setting humidity pretty low

// However, starting humidity is like 65%. I can manually fill in a gain schedule without actually calibrating...guess and check.
// OR I can finish the test calibrator...JUST to get a gain schedule for the Humidifier...idk

// Goal: TempController, humidityController, & Ventillation Controller completed ASAP

module.exports = {
    humidity_pid_controller_config,
    update_humidity,
}