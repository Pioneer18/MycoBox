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
        console.log("Config From Within the TempPidController!!");
        console.log(config);
        // saturation has been reached if these limits are hit and clamping should happen
        let defaultIntegralLimit = { min: -1000, max: 1000}
        // Set PID weights (gain)
        this.kp = config.settings.kp || 1;
        this.ki = config.settings.ki || 0;
        this.kd = config.settings.kd || 0;
        // init properties for the integral of error
        this.integralLimit = config.settings.iLimit || defaultIntegralLimit;
        this.integralOfError = config.previousReport.integralOfError;
        this.lastError = config.previousReport.lastError;
        this.lastTime = config.previousReport.lastTime;
        // init the set point
        this.setPoint = config.incomingReport.setPoint;
        this.measured = config.incomingReport.measured;
    }

    async update() {
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

        return (this.kp * error) + (this.ki * this.integralOfError) + (this.kd * derivativeOfError);
    }

    // Return the variables to be used for constructing the class next time
    async report() {
        return {
            integralOfError: this.integralOfError,
            lastError: this.lastError,
            lastTime: this.lastTime
        }
    }

    async reset () {
        this.integralOfError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    }
}

module.exports = {
    TempPidController,
}