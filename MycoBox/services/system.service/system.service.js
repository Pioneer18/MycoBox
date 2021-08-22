/**
 * System Service
 * =========================
 * Description: provides extra functionality to the system controller
 */


module.exports = {
    /**
     * process:
     * 1) check the 
     * 2) check the environementConfg
     * 3) check the environmentState
     */
     environmentManager: async () => {

    },
    
    getEnvironmentConfig: async () => {
        return {
           spawn_running:{
                ir_temp_trigger: process.env.environment_config.spawn_running.ir_temp_trigger,
                timer: process.env.environment_config.spawn_running.timer,
                temp_setpoint: process.env.environment_config.spawn_running.temp_setpoint,
                irTemp_setpoint: process.env.environment_config.spawn_running.irTemp_setpoint,
                humidity_setpoint: process.env.environment_config.spawn_running.humidity_setpoint,
                co2_setpoint: process.env.environment_config.spawn_running.co2_setpoint,
                circulation_top: process.env.environment_config.spawn_running.circulation_top,
                circulation_bottom: process.env.environment_config.spawn_running.circulation_bottom,
                lighting_setpoint: process.env.environment_config.spawn_running.lighting_setpoint
            },
            primordia_init: {
                user_confirmed: process.env.environment_config.primordia_init.user_confirmed, 
                timer: process.env.environment_config.primordia_init.timer, 
                temp_setpoint: process.env.environment_config.primordia_init.temp_setpoint,
                humidity_setpoint: process.env.environment_config.primordia_init.humidity_setpoint,
                co2_setpoint: process.env.environment_config.primordia_init.co2_setpoint,
                circulation_top: process.env.environment_config.primordia_init.circulation_top,
                circulation_bottom: process.env.environment_config.primordia_init.circulation_bottom,
                lighting_setpoint: process.env.environment_config.primordia_init.lighting_setpoint,
            },
            fruiting: {
                user_confirmed: false,
                timer: number || null,
                temp_setpoint: '',
                humidity_setpoint: '',
                co2_setpoint: '',
                circulation_top: '',
                circulation_bottom: '',
                lighting_setpoint: ''
            }

        }
    } 
}