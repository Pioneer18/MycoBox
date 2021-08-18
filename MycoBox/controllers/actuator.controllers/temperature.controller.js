/**
 * Temperature Controller:
 * ----------------------
 * Notes:
 *   - Controllers must be careful to work cooperatively
 *   - Controllers send directives to async modules to make changes, and modules communicate status to controllers
 * Purpose: 
 *   - Asynchronoulsy maintain the environement temperature
 * Function: 
 *   #1) On initialization, continue to check the Heap for:
 *     - SystemConfig
 *     - EnvConfig: The latest desired environment configuration
 *     - EnvModel: The latest sensor reported model of the environment
 *     - SystemStatus: Flags from other controller/modules
 *   #2) Pass the latest envConfig and envModel to the ContextHandler method: switch case for building "Directives"
 *     a) Incubation or Fruiting?
 *       - Incubation: no or limited airflow, use heater and AC with limited ventilation based temp control
 *       - Fruiting: ventilation air temp control is ok if conditions correct:
 *       * Ventilation always checks CO2/oxygen, humidity, and full temperature context before turning on
 *       * If all requirements met, cool or heat chamber by letting external air in, otherwise just use the heater or a/c
 *     b) Temperature to high:
 *       - Use ac or ventilation to cool box
 *     c) Temperature to low:
 *       - Use heater or ventilation to heat box
 *     d) Temperature in range
 *       - Don't do anything
 *   #3) Set actuator modules' directives
 *   #4) Wait 15 seconds to check heap again and update directives if there are any updates
 */

// Import Actuators
const { s1r1_on, s1r1_off, s2r1_off, s2r1_on } = require('../../cli_control_panel/relay');
module.exports = {



    /**
     * Override:
     * Purpose: Manually switch the acuator on or off if OVERRIDE is true
     * Description: Commands the selected actuator to turn on/off regardless of the global context (EnvModel, SystemStatus, ...)
     * @param {string, string} command {actuator: '', status: ''}
     */
    override: async (command) => {
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
}


