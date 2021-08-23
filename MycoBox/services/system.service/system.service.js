/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */

const { get } = require("../../globals/globals")

/**
 * process:
 * 2) get the environment_config (setpoints)
 * 3) calculate measured from environment_state
 * 4) pass the setpoints and measured to each PID
 */
const environment_manager = async () => {
    const env_config = await get('environment_config');
    const env_state = await get ('environment_state'); 
    console.log('env_config from within environment manager: ' + env_config)
    console.log('env_state from within environment manager: ' + env_state)
}

module.exports = {
    environment_manager
}