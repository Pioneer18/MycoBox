/**
 * Temperature Controller:
 * ----------------------
 * Note: Controllers must be careful to work cooperatively
 * Note: Controllers send directives to async modules to make changes, and modules communicate status to controllers
 * Purpose: Asynchronoulsy maintain the environement temperature
 * Function: 
 * #1) On initialization, continue to check the Heap for:
 * - SystemConfig
 * - EnvConfig: The latest desired environment configuration
 * - EnvModel: The latest sensor reported model of the environment
 * - SystemStatus: Flags from other controller/modules
 * #2) Pass the latest envConfig and envModel to the ContextHandler method: switch case for building "Directives"
 *   a) Incubation or Fruiting?
 *   - Incubation: no or limited airflow, use heater and AC with limited ventilation based temp control
 *   - Fruiting: ventilation air temp control is ok if conditions correct:
 *     * Ventilation always checks CO2/oxygen, humidity, and full temperature context before turning on
 *     * If all requirements met, cool or heat chamber by letting external air in, otherwise just use the heater or a/c
 *   b) Temperature to high:
 *   - Use ac or ventilation to cool box
 *   c) Temperature to low:
 *   - Use heater or ventilation to heat box
 *   d) Temperature in range
 *   - Don't do anything
 * #3) Set actuator modules' directives
 * #4) Wait 15 seconds to check heap again and update directives if there are any updates
 */
module.exports = {

    /**
     * Init:
     * Purpose: Initialize the 'environmental management' process
     * Description: Start the process of keeping the interior temperature of the mycobox at the desired configuration; which will run till
     * the activeSession flag is set false. This is called the 'Environmental Management' process; every 15 seconds check the global configuration
     * and send the appropriate directive to the controller's actuator modules. 'Start the process', means start the correct async python subroutines
     * of the actuator modules.
     */
    init: async () => {
        
    },

    /**
     * Environment Manager:
     * Purpose: Manage the temperature for the duration of the session
     * Description: every 15 seconds check the global configuration and send the appropriate directive to the controller's actuator modules. 
     * Check each actuator module's status and respond to any errors or service requests; calibration or whatever
     */
    em: () => {

        /**
         * Generate Directive:
         * Purpose: Read the global configuration objects and variables to logically create a directive for the actuator modules to carry out.
         * Description: This function builds a "sitrep", from; the Sessionconfig, EnvConfig, EnvModel, and the SystemStatus. The sitrep is passed
         * as an argument to the buildDirective.utility, a switch case that logic builds the directive for the controller's modules.
         */
        generateDirective = async () => {
    
        }

        /**
         * Actuator Logger:
         * Purpose: Create timestamped log files of actuators status and their directive as well as console logs
         */
        actuatorLogger = async () => {

        }

        /**
         * Data Logger
         * Purpose: Send actuator status and directive to rolling DB...keeps last few months of data, backend clipped off
         */
        dataLogger = async () => {

        }

        /**
         * End Session
         * Purpose: End the Environment Manager and report that the processes have successfully closed; both the actuator process and this one.
         */
        endSession = async () => {
            
        }
    },



}