/**
 * System Controller
 * ===General=================
 * - New Session:
 * - End Session:
 * - Add Hours:
 * - Subtract Hours:
 * ===Environment================
 * - Increase temp
 * - Decrease temp
 * - Increase co2
 * - Decrease co2
 * - Increase humidity
 * - Decrease humidity
 *  note: incubation vs fruiting and other actuator dependent rules
 */
module.exports = {

     /**
     * Steps:
     * - Check the MycoBox 'System Status': If session already running then return error: session already active
     * - check the myco_box environment
     * - call the prepare_environment subroutine to set the Evironment Model to the config
     * @returns return confirmation session started
     */
    
    newSession: () => {
       // Python session
       // communicates to js backend with stdin/stdout pipes to get updates mid session; e.g new env_config
       // this is faster? don't have to start a process everytime i want to reach out to an acutaors functionality, yet on the occasional user input an update config
       // can be communicated via stdin and a response from python script via stdout
    },

    endSession: () => {
        return { TODO: 'build this handler' }
    },

    addHoursToSession: () => {
        return { TODO: 'build this handler' }
    },

    subtractHoursFromSession: () => {
        return { TODO: 'build this handler' }
    },
}

