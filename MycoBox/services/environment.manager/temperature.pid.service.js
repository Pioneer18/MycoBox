/**
 * PID Controller Class
 * @param {number} kp proportional gain
 * @param {number} ki integral gain
 * @param {number} kd derivative gain
 * @param {min: number, max: number} iLimit limits for the integral
 * ----------------------------------------------------------------------------------------
 * Steps:
 * #1. create a new controller: e.g. let tempCtr = new TempPidController(0.25,0.01,0.01)
 * #2. create the set-point: e.g. tempCtr.setPoint(21)
 * #3. read the updated environment model every time it's available; flag indicating updated
 */
 class TempPidController {
    constructor(config) {
        // saturation has been reached if these limits are hit and clamping should happen
        let defaultIntegralLimit = { min: -1000, max: 1000}
        // Set PID weights (gain)
        this.kp = config.settings.kp || 0.8;
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
        // console.log('Hello World Update() attempt --------------')
        // // #1) find the interval of time between previous and current reading
        // const {dt, currentTime} = this.calculate_dt(this.lastTime);
        // this.lastTime = currentTime;
        // // #2) calculate the error and integral of the error; the total of error x time passed till current reading
        // console.log('Set Point: ' + this.setPoint)
        // console.log('Measured: ' + this.measured)
        // let error = (this.setPoint - this.measured);
        // this.integralOfError += error * dt; 
        // if (this.integralOfError > this.integralLimit.max) this.integralOfError = this.integralLimit.max;
        // if (this.integralOfError < this.integralLimit.min) this.integralOfError = this.integralLimit.min;
        // // calculate the derivative of the error: rate of change
        // console.log('error - lastError: ', error - this.lastError)
        // console.log('dt: ', dt)
        // let derivativeOfError = (error - this.lastError) / dt;
        // this.lastError = error;
        // console.log('Error: ' + error);
        // console.log('Derivative of Error: ' + derivativeOfError);

        // // CALCULATED UPDATE VALUE IS GETTING REALLY BIG
        // return (this.kp * error) + (this.ki * this.integralOfError) + (this.kd * derivativeOfError);

        /**
         * Update Redo:
         * What are the Gains?
         * kp = 0, ki = 0, kp = 0
         */

        // #1. find the cycle-time (dt) and update lastTime
        const {dt, currentTime} = this.calculate_dt(this.lastTime)
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
        console.log('Calculating Derivative')
        console.log('dt : ' + dt)
        console.log(this.kd + ' * ( err: ' + err + ' - ' + this.lastError + ' ) / ' + dt + ') =' + (this.kd * (err - this.lastError) / dt));
        // #7. Output => P + It + D
        console.log('Current Time: ' + currentTime)
        console.log('Cycle Time: ' + dt)
        console.log('PID Calculation Report:')
        console.log(`P: ${P}`);
        console.log(`I: ${this.integralOfError}`);
        console.log('RAW Integral of Error: ' + this.ki * err * dt);
        console.log(`D: ${D}`);
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

    reset () {
        this.integralOfError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    }
    // calculate_dt
    calculate_dt(lastTime) {
        const currentTime = Date.now();
        let dt;
        if (lastTime === 0) {
            dt = 0;
        } else {
            dt = (currentTime - lastTime) / 1000;
        }
        return {dt, currentTime};
    }
    // clamp_check
    clamp_check() {
        
    }
}

module.exports = {
    TempPidController,
}

/**
 * Temp PID Calculation Notes
 * --------------------------
 * #1. When the setpoint is below the measured, the error will be negative
 * #2. When the lastTime is 0, the derivative will be +/- Infinity; because anything / 0 is infinity. So don't use derivative if there is no lastTime.
 *     The Derivative may be unnecessary for the TempPidController
 * #3. The weights right now are doing nothing
 * #4. Update value is Negative: Temp is above setpoint, turn on the AC
 * #5. Update value is Positive: Temp is below the setpoint, turn on the Heater
 * #6. Value is zero, or close to it, then do nothing
 */