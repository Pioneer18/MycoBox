/**
 * System Controller Object
 */
module.exports = {

     /**
     * Steps:
     * - Check the MycoBox 'System Status'
     * - If session already running then return error: session already active
     * - Else begin a new session function with required config
     * - the async service will respond to the front-end when it begins
     * - the controller will send request to redirect client to home-page with last session-record
     * @returns return confirmation session started
     */
    
    newSession: () => {
        return { TODO: 'build this handler' }
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

