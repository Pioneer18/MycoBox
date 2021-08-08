/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const {
    sessionConfig,
    environmentConfig,
    environmentModel,
    systemStatus,
    overrides
} = require('../../globals/globals');

module.exports = {
    /**
     * process:
     * 1) check the sessionConfig
     * 2) check the environementConfg
     * 3) check the environmentModel
     */
    manageEnvironment: () => {
        return 'Starting the EM'
    }
}