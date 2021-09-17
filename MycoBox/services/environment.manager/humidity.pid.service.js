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

    update() {
        // #1. find the cycle-time (dt) and update lastTime
        const { dt, currentTime } = this.calculate_dt(this.lastTime)
        let D;
        this.lastTime = currentTime;
        // #2. calculate the error: setpoint - measured
        const err = this.setPoint - this.measured;
        this.lastError = err;
        // #3. calculate P => kp * err
        const P = this.kp * err;
        // #4. calculate It => It + (ki * error * dt)
        this.integralOfError += (this.ki * err * dt)
        // #5. limit the It
        if (this.integralOfError > this.integralLimit.max) this.integralOfError = this.integralLimit.max;
        if (this.integralOfError < this.integralLimit.min) this.integralOfError = this.integralLimit.min;
        // #6. calculate D => kd * (err - lastErr) / dt
        dt === 0 ? D = 0 : D = this.kd * (err - this.lastError) / dt;
        console.log('PID Calculation Report:')
        console.log(`P: ${P}`);
        console.log(`Error: ${err}`);
        console.log(`It: ${this.integralOfError}`);
        console.log(`D: ${D}`);
        console.log(`Error: ${err}`);
        return P
    }

     // set the global pid state for this controller
     report() {
        return {
            integralOfError: this.integralOfError,
            lastError: this.lastError,
            lastTime: this.lastTime
        }
    }
}

module.exports = { HumidityPidController }