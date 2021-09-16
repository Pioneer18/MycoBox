/**
 * Humidity PID Controller Class
 * @param {number} kp proportional gain
 * @param {number} ki integral gain
 * @param {number} kd derivative gain
 * @param {min: number, max: number} iLimit limits for the integral
 * ----------------------------------------------------------------------------------------
 * Contstructor: 
 * Needs the kp, ki, kd values for the pid calculation, as well as the setpoint and current measured environment values.
 * The constuctor also needs the previous error and time
 * 
 * Methods:
 * update: Runs the PID algorithim to return an udpate value
 * report: report necessary data to the globals
 * reset:  reset the pid report in the globals
 * calculate_dt: calculate the inteveral of time between updates
 * clamp_check: limit the udpate value returned by the pid algorithm to its min and max values
 */
class HumidityPidController {
    constructor(config) {
        // saturation has been reached if these limits are hit and clamping should happen
        // let defaultIntegralLimit = { min: -10, max: 10 }
        // Set PID weights (gain)
        this.kp = config.settings.kp || 0.1;
        this.ki = config.settings.ki || 0.1;
        this.kd = config.settings.kd || 0.1;
        // init properties for the integral of error
        this.integralLimit = config.settings.iLimit || defaultIntegralLimit;
        this.integralOfError = config.pid_state.integralOfError;
        this.lastError = config.pid_state.lastError;
        this.lastTime = config.pid_state.lastTime;
        // init the set point
        this.setPoint = config.incoming_report.setPoint;
        this.measured = config.incoming_report.measured;
        console.log('This: TempPidController Properties')
        console.log(this)
    }
}