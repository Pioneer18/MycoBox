/**
 * Air Conditioner Actuator Module:
 * --------------------------------
 * Notes:
 *   - 
 * Purpose:
 *   - Respond to directive with appropriate method and notify status
 * Function:
 *   #1) On directive being set, logically begin the correct method by passing the directive to the directiveHandler() method
 *     a) Override true:
 *       - Execute the given command
 *     b) Normal directive:
 *       - pass directive to directiveHandler, a switch case, which will call the correct method to handle the directive
 *   #2) start the correct method and update the modules status, local object alive as long as the process is running.   
 *   
 */

// Import Relay
const {s1r1_on, s1r1_off, s2r1_on, s2r1_off} = require('../../resources/relay');
module.exports = {
    s1r1_on,
    s1r1_off,
    s2r1_on,
    s2r1_off
}