
export const startProcess = (process, config) => {
    console.log(`Starting the ${process} process now!`);
    console.log('Env Config Below');
    console.log(config);
    // Flags
    let new_session = true; // allow pre-set environment stage before starting the timer (while new session true don't start clock)
    // Grow Box Environment Status Variables
    let env_temp_c;
    let env_temp_f;
    let env_humidity;
    let env_co2;
    let env_weight;
    let remaining_time;
    let current_time; // use some kind of DateTime object

    /**
     * The "Process" is the core function of the application (The Previous Code is to Get a Config to this core function and then start it)
     * 
     * This program utilizes the event loop, which is what allows Node.js to perform non-blocking I/O operations — to run asynchronous subroutines and respond to incoming commands
     * 
     * ----------------------------------------------
     * 1. use the given parameters to set the env_config: temp, co2, humidity, lighting, duration
     * 1a. If initial start boolean is true, block duration clock till environment settings are reached
     * 2. Read the Sensors to check the actual environment status
     * 3. If the current environment does not satisfy the required environment, begin the appropriate asynchronous subroutines
     *   - Increase Temperature slowly: Turn on PID system for .AC
     *   - Decrease Temperature slowly: Turn on PID system for AC
     *   - Decrease Temperature quickly: Turn A/C off 
     *   - Increase Humidity: Turn humidifier on
     *   - Decrease Humidity: Turn humidifier off
     *   - Increase CO2: seal all valves till CO2 levels are reached AND Increase rate of checking CO2 meter during this subroutine
     *   - Decrease C02: open all valves AND turn on intake/exhaust fans, high or low depending on required gradient of change
     *   * Fresh Air is the inverse of CO2
     *   - Fruiting Lighting: switch the light on for the duration
     *   - Incubation Lighting: switch the light off for the duration
     *   - Stream Web Cam: Switch the camera on or off
     *   - Check Scale: ...check the 4 load cells and run function to determine weight
     *   - Maintain a running clock that cannot be paused, only stopped, shortened, or added onto. 
     * 4. Check for Dashboard menu requests (socket.io):
     *   - Open menu
     *   - Close menu (x)
     *   - Stop process
     *   - Reset Default Env_Config (for selected mushroom)
     *   - Update temperature threshold.
     *   - Update humidity threshold
     *   - Update co2 threshold
     * 5. Check the Duration of the System 
     *   - If time remains begin from step 3
     *   - If there is no remaining time, end the session and go to the 'Post Grow Page'
     * 
     * 
     * Actuators:
     *   - ac (AC): Decrease the temperature of the environment
     *   - humidifier (HU): evaporative wick humidifier for increasing the relative humidity
     *   - intake_fan_low (IFL): Fan #1 of the intake module for slow air intake
     *   - intake_fan_high (IFH): Fan #2 of the intake module for rapid air intake
     *   - exhaust_fan_low (EFL): Fan #1 of the exhaust module for slow air exhaust
     *   - exhaust_fan_high (EFH): Fan #1 of the exhaust module for rapid air exhuast
     *   - seal all valves (SAV): Seal the air intake and air exhaust valves
     *   - seal intake valve (SIV): Seal the air intake valve to prevent air intake
     *   - seal exhaust valve (SEV): Seal the air exhaust valve to prevent exhausting air
     *   - heater (HE): Increase the temperature of the environment
     *   - light (GL): Provide Light for the environment
     * 
     * Sensors: 
     *   - temperature_c (TC): max31855 thermocouple sensor for PID A/C control 
     *   - humidity (RH): DHT22 Relative humidity sensor
     *   - co2 (CO2): cozir ambient 5000 CO2 sensor
     *   - weight (kg): HX711 AD Module and Load Cells for detecting weight
     */
}
