/**
 * Temperature Controller:
 * Note: Controllers must be careful to work cooperatively
 * Note: Controllers send directives to async modules to make changes, and modules communicate status to controllers
 * Purpose: Asynchronoulsy maintain the environement temperature
 * Function: 
 * #1) on initialization, continue to check the Heap for:
 * - SystemConfig
 * - EnvConfig: The latest desired environment configuration
 * - EnvModel: The latest sensor reported model of the environment
 * - SystemStatus: flags from other controller/modules
 * #2) Pass the latest envConfig and envModel to the ContextHandler method: switch case for building "Directives"
 *   a) Incubation or Fruiting?
 *   - Incubation: no or limited airflow, use heater and AC with limited ventilation based temp control
 *   - Fruiting: ventilation air temp control is ok if conditions correct:
 *     * ventilation always checks CO2/oxygen, humidity, and full temperature context before turning on
 *     * if all requirements met, cool or heat chamber by letting external air in, otherwise just use the heater or a/c
 *   b) Temperature to high:
 *   - use ac or ventilation to cool box
 *   c) Temperature to low:
 *   - use heater or ventilation to heat box
 *   d) temperature in range
 * #3) Set actuator modules' directives
 * #4) wait 15 seconds to check heap again and update directives if there are any updates
 */