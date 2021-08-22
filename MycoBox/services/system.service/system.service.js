/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */
const { globals } = require('../../globals/globals')

module.exports = {
    /**
     * process:
     * 1) check the 
     * 2) check the environementConfg
     * 3) check the environmentState
     */
    environmentManager: async () => {

    },

    set_environment_config: async (config) => {
        console.log('Set Environment Config Parameter: ');
        console.log(config);
        globals.environment_config = config;
        console.log('Global Environment Config: ');
        console.log(globals.environment_config);
    },

    getEnvironmentConfig: async () => {
        return {
            spawn_running: {
                temperature: globals.environment_config.spawn_running.temperature,
                humidity: globals.environment_config.spawn_running.humidity,
                co2: globals.environment_config.spawn_running.co2,
                circulation_top: globals.environment_config.spawn_running.circulation_top,
                circulation_bottom: globals.environment_config.spawn_running.circulation_bottom,
                lighting: globals.environment_config.spawn_running.lighting,
                trigger: globals.environment_config.spawn_running.trigger,
                duration: globals.environment_config.spawn_running.duration,
            },
            primordia_init: {
                user_confirmed: globals.environment_config.primordia_init.user_confirmed,
                duration: globals.environment_config.primordia_init.duration,
                temperature: globals.environment_config.primordia_init.temperature,
                humidity: globals.environment_config.primordia_init.humidity,
                co2: globals.environment_config.primordia_init.co2,
                circulation_top: globals.environment_config.primordia_init.circulation_top,
                circulation_bottom: globals.environment_config.primordia_init.circulation_bottom,
                lighting: globals.environment_config.primordia_init.lighting,
            },
            fruiting: {
                temperature: '',
                humidity: '',
                co2: '',
                circulation_top: '',
                circulation_bottom: '',
                lighting: '',
                duration: '',
                numberOfharvests: '',
                dormancy: ''
            }

        }
    }
}