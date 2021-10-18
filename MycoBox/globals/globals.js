/**
 * Global Variables
 */

const chalk = require("chalk");
const log = console.log;

// Session State
let globals = {
    session_state: {
        session_title: '',
        session_id: '',
        user_id: '',
        active_session: false,
        active_test_session: false,// might not be needed
        canceled: false,
        spawn_running: false,
        primordia_init: false,
        fruiting: false,
    },
    environment_config: {
        spawn_running: {
            temperature: '',
            humidity: '',
            co2: '',
            circulation_top: '',
            circulation_bottom: '',
            lighting: '',
            trigger: true,
            duration: '' // null if temp_trigger is true
        },
        primordia_init: {
            temperature: '',
            humidity: '',
            co2: '',
            circulation_top: '',
            circulation_bottom: '',
            lighting: '',
            user_confirmed: false, // if true, no duration
            duration: '',
        },
        fruiting: {
            temperature: '',
            humidity: '',
            co2: '',
            circulation_top: '',
            circulation_bottom: '',
            lighting: '',
            duration: '',
            flushes: '', // number of flush and domarncy cycles
            dormancy: '' // duration in between flushes
        }
    },
    environment_state: {
        timestamp: 'initial',
        internal_temp_1: '', // dht22_1 bottom
        internal_temp_2: '', // dht22_2 mid
        internal_temp_3: '', // dht22_3 top
        precise_temp_c: '', // max31855
        precise_temp_f: '', // max31855
        external_temp: '', // dht22_3
        internal_humidity_1: '', // dht_22_1
        internal_humidity_2: '', // dht_22_2
        internal_humidity_3: '', // dht_22_3
        external_humidity: '', // dht_22_3
        co2: '', // cozIr-A
        weight: '' // esp8266
    },
    actuators_state: {
        circulation_bottom: {
            active: false,
            stopped: true,
            idle: 0,
        },
        circulation_top: {
            active: false,
            stopped: true,
            idle: 0,
        },
        intake: {
            active: false,
            stopped: true,
            idle: 0,
        },
        exhaust: {
            active: false,
            stopped: true,
            idle: 0,
        },
        ac: {
            active: false,
            stopped: true,
            idle: 0,
        },
        heater: {
            active: false,
            stopped: true,
            idle: 0,
        },
        humidifier: {
            active: false,
            stopped: true,
            idle: 0,
        },
        light: false,
        speakers: false
    },
    pid_state: {
        temperature: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0,
            dt: 0
        },
        humidity: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0,
            dt: 0
        },
        ventilation: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0,
            dt: 0
        }
    },
    // mapped for Testing or switched by control panel on dashboard
    overrides: {
        flag: false,
        circulation_top: false,
        circulation_bottom: false,
        intake: false,
        exhaust: false,
        aircon: false,
        heater: false,
        humidifier: false,
        light: false,
        speakers: false
    },
    test_config: {
        // logging
        filename: '',
        dirname: '',
        // co actuator (logging)
        co_actuator: '',
        co_output: 0,
        // disturbances (logging)
        circulation_top: false,
        circulation_bottom: false,
        aircon: false,
        heater: false,
        humidifier: 0,
        intake: 0,
        exhaust: 0,
        // op_level [test_prep, logging]
        Temperature: false,
        Humidity: false,
        CO2: false,
        start_reference: '',
        dlo: 0,
        // terminators [logging, end test]
        terminator: '',
        cycles_limit: 0,
        cycles_count: 0,
        dlo_refernce: '',
        steady_state: false,
    }
};

// define getter and setter for globals 
/**
 * Grab a section from the globals object
 * @param {string} section section of the globals object
 * @returns the section
 * todo: add 'element' param, for searching section and element
 */
const get = (section) => {
    return new Promise((resolve) => {
        switch (section) {
            case 'session_state':
                resolve(globals.session_state)
            case 'environment_config':
                resolve(globals.environment_config)
            case 'environment_state':
                resolve(globals.environment_state)
            case 'actuators_state':
                resolve(globals.actuators_state)
            case 'pid_state':
                resolve(globals.pid_state)
            case 'overrides':
                resolve(globals.overrides)
            case 'test_config':
                resolve(globals.test_config)
            default:
                resolve(null);
        }
    })
}

// don't always want to use a promise
const getter = (section) => {
    switch (section) {
        case 'session_state':
            return (globals.session_state)
        case 'environment_config':
            return (globals.environment_config)
        case 'environment_state':
            return (globals.environment_state)
        case 'actuators_state':
            return (globals.actuators_state)
        case 'pid_state':
            return (globals.pid_state)
        case 'overrides':
            return (globals.overrides)
        case 'test_config':
            return (globals.test_config)
        default:
            return (null);
    }
}

/**
 * set globals section or element
 */
const set_environment_config = (config) => {
    return new Promise((resolve) => {
        log('METHOD CALL: Set_environment_config')
        set_environment_config_validation(config)
            .then(globals.environment_config = config) // validate the config matches what is expected !!!
            .then(resolve())
            .catch(err => log('Error Caught: set_environment_config: ' + err))

        log('Invalid Environment Config Given: ' + err)
    })

}

/**
 * validate the incoming config
 * @param {*} config the config object to be validated
 */
const set_environment_config_validation = (config) => {
    return new Promise((resolve) => {
        log('METHOD CALL: set_environment_config_validation')
        if (!config.spawn_running) throw new Error('Missing Spawn Running');
        if (!config.spawn_running.temperature) throw new Error('Missing Spawn Running: temperature')
        if (!config.spawn_running.humidity) throw new Error('Missing Spawn Running: humidity')
        if (!config.spawn_running.co2) throw new Error('Missing Spawn Running: co2')
        if (!config.spawn_running.circulation_top) throw new Error('Missing Spawn Running: circulation_top')
        if (!config.spawn_running.circulation_bottom) throw new Error('Missing Spawn Running: circulation_bottom')
        if (!config.spawn_running.lighting) throw new Error('Missing Spawn Running: lighting')
        if (typeof config.spawn_running.trigger !== 'boolean') throw new Error('Missing Spawn Running: trigger')
        if (!config.spawn_running.duration && config.spawn_running.duration !== null) throw new Error('Missing Spawn Running: duration')
        if (!config.primordia_init) throw new Error('Missing Primordia Init')
        if (!config.primordia_init.temperature) throw new Error('Missing Primordia Init: temperature')
        if (!config.primordia_init.humidity) throw new Error('Missing Primordia Init: humidity')
        if (!config.primordia_init.co2) throw new Error('Missing Primordia Init: co2')
        if (!config.primordia_init.circulation_top) throw new Error('Missing Primordia Init: circulation_top')
        if (!config.primordia_init.circulation_bottom) throw new Error('Missing Primordia Init: circulation_bottom')
        if (!config.primordia_init.lighting) throw new Error('Missing Primordia Init: lighting')
        if (typeof config.primordia_init.user_confirmed !== 'boolean') throw new Error('Missing Primordia Init: user_confirmed')
        if (!config.primordia_init.duration) throw new Error('Missing Primordia Init: duration')
        if (!config.fruiting) throw new Error('Missing Fruiting')
        if (!config.fruiting.temperature) throw new Error('Missing Fruiting: temperature')
        if (!config.fruiting.humidity) throw new Error('Missing Fruiting: humidity')
        if (!config.fruiting.co2) throw new Error('Missing Fruiting: co2')
        if (!config.fruiting.circulation_top) throw new Error('Missing Fruiting: circulation_top')
        if (!config.fruiting.circulation_bottom) throw new Error('Missing Fruiting: circulation_bottom')
        if (!config.fruiting.lighting) throw new Error('Missing Fruiting: lighting')
        if (!config.fruiting.duration) throw new Error('Missing Fruiting: duration')
        if (!config.fruiting.flushes) throw new Error('Missing Fruiting: flushes')
        if (!config.fruiting.dormancy) throw new Error('Missing Fruiting: dormancy')
        resolve()
    })
}

/**
 * Set the value of an environment state element
 * @param {*} element evironment state element to set
 * @param {*} value the value to set for the element
 */
const set_environment_state = ((element, value) => {
    return new Promise((resolve) => {
        log('Setting Environment State:')
        log(value);
        set_environment_state_validation(element, value)
            .then(() => {
                globals.environment_state[element] = value
                resolve()
            })
            .catch(err => log(`Error Caught: set_enviornment_state: ${err}`));
    });

})

/**
 * validate the incoming element and value
 * @param {*} element environment state element to be validated
 * @param {*} value the value to be validated
 * @returns 
 */
const set_environment_state_validation = (element, value) => {
    return new Promise((resolve) => {
        if (element === 'timestamp' && typeof value === 'number') resolve()
        if (element === 'internal_temp_1' && typeof value === 'string') resolve()
        if (element === 'internal_temp_2' && typeof value === 'string') resolve()
        if (element === 'internal_temp_3' && typeof value === 'string') resolve()
        if (element === 'precise_temp_c' && typeof value === 'string') resolve()
        if (element === 'precise_temp_f' && typeof value === 'string') resolve()
        if (element === 'external_temp' && typeof value === 'string') resolve()
        if (element === 'internal_humidity_1' && typeof value === 'string') resolve()
        if (element === 'internal_humidity_2' && typeof value === 'string') resolve()
        if (element === 'internal_humidity_3' && typeof value === 'string') resolve()
        if (element === 'external_humidity' && typeof value === 'string') resolve()
        if (element === 'co2' && typeof value === 'string') resolve()
        if (element === 'weight' && typeof value === 'string') resolve()
        throw new Error('Invalid Environment State element or value given: ' + element, value);
    })
}

/**
 * Set the value of a session state element
 * @param {*} element session state element to set
 * @param {*} value the value to set for the element
 */
const set_session_state = (element, value) => {
    return new Promise((resolve) => {
        log('METHOD CALL: set_session_state');
        set_session_state_validation(element, value);
        globals.session_state[element] = value
        log(globals.session_state[element])
        resolve()
    })

}

/**
 * validate the incoming element and value
 * @param {*} element session state element to validate
 * @param {*} value the value to be validated
 * @returns 
 */
const set_session_state_validation = (element, value) => {
    if (element === 'session_title' && typeof value === 'string') return
    if (element === 'session_id' && typeof value === 'string') return
    if (element === 'user_id' && typeof value === 'string') return
    if (element === 'active_session' && typeof value === 'boolean') return
    if (element === 'active_test_session' && typeof value === 'boolean') return
    if (element === 'canceled' && typeof value === 'boolean') return
    if (element === 'spawn_running' && typeof value === 'boolean') return
    if (element === 'primordia_init' && typeof value === 'boolean') return
    if (element === 'fruiting' && typeof value === 'boolean') return
    if (element === 'cycles_limit' && typeof value === 'number') return
    if (element === 'cycles_count' && typeof value === 'number') return
    throw new Error('Invalid session_state element or value given')
}

/**
 * Set the pid state for the selected controller
 * @param {string} controller the controller to update
 * @param { integralOfError, lastError, lastTime } state the state of the PID
 */
const set_pid_state = (controller, state) => {
    set_pid_state_validation(controller, state);
    globals.pid_state[controller].integralOfError = state.integralOfError;
    globals.pid_state[controller].lastError = state.lastError;
    globals.pid_state[controller].lastTime = state.lastTime;


}

const set_pid_state_validation = (controller, state) => {
    try {
        log('Validating the PID State')
        if (!controller || !state) throw new Error('Either the controller or state has not been provided');
        if (typeof controller !== 'string') throw new Error('Invalid controller given, not a string');
        if (typeof state.integralOfError !== 'number') throw new Error('Invalid integralOfError provided')
        if (typeof state.lastError !== 'number') throw new Error('Invalid lastError provided')
        if (!state.lastTime || typeof state.lastTime !== 'number') throw new Error('Invalid lastTime provided')
    } catch (err) {
        throw new Error('Invalid controller or state given: ' + err);
    }
}

/**
 * set actuator state
 * @param {string} element
 * @param {string} status
 * @param {boolean || number} value
 */
const set_actuator_state = (element, status, value) => {
    return new Promise((resolve) => {
        log('Setting Actuator State')
        validate_set_actuator_state(element, status, value)
        if (element === 'light' || element === 'speakers') {
            globals.actuators_state[element][value]
            return resolve()
        }
        globals.actuators_state[element][status] = value
        return resolve()
    })
}

const validate_set_actuator_state = (element, status, value) => {
    if (!element || (typeof element !== 'string')) throw new Error('Missing or Invalid Element for setting actuator state');
    log('Validate Set Actuator State: Value Here')
    log(element, value)
    log(typeof value)
    if (element === 'light' || element === 'speakers') {
        return
    }
    if (element === 'circulation_bottom' ||
        element === 'circulation_top' ||
        element === 'intake' ||
        element === 'exhaust' ||
        element === 'ac' ||
        element === 'heater' ||
        element === 'humidifier') {

        if (!status || (typeof status !== 'string')) throw new Error('Missing or Invalid status given for setting actuator state');
        if ((typeof value === 'number') || (typeof value === 'boolean')) {
            return
        } else {
            log('The Value is not a Boolean or a Number!')
            throw new Error('The Value is not a Boolean or a Number')
        }
    }
}

/**
 * Set Overrides
 */
const set_overrides_state = (element, value) => {
    log(chalk.magentaBright('set_overrides_state'))
    log(chalk.magentaBright('element: ' + element + ' ' + ' value: ' + value))
    set_overrides_state_validation(element, value);
    globals.overrides[element] = value;
}

const set_overrides_state_validation = (element, value) => {
    try {
        if (element && element !== undefined && element !== ''
            && value && value !== undefined && value !== '') {
            if (element === 'flag') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for flag')
            }
            if (element === 'circulation_bottom') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for circulation_bottom')
            }
            if (element === 'circulation_top') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for circulation_top')
            }
            if (element === 'aircon') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for ac')
            }
            if (element === 'heater') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for heater')
            }
            if (element === 'mister') {
                if (typeof value === 'boolean') return true
                throw new Error('Invalid value for mister')
            }
            if (element === 'intake') {
                if (parseInt(value) > 0 && parseInt(value) <= 350) return true
                throw new Error('Invalid value for intake')
            }
            if (element === 'exhaust') {
                if (parseInt(value) > 0 && parseInt(value) <= 350) return true
                throw new Error('Invalid value for exhaust')
            }
            if (element === 'humidifier') {
                if (parseInt(value) > 0 && parseInt(value) <= 320) return true
                throw new Error('Invalid value for humidifier')
            }
            if (element === 'light') {
                if (parseInt(value) > 0 && parseInt(value) <= 410) return true
                throw new Error('Invalid value for light')
            }
            // if (element === 'speakers') {
            //    if (parseInt(value) > 0) return true 
            // }
            else {
                throw new Error('element did not match anything')
            }
        }
        else {
            log(chalk.magentaBright('skipping empty override'))
        }
    } catch (err) {
        throw new Error(`Invalid Overrides: ${err}`);
    }

}

const set_test_config = (element, value) => {
    return new Promise((resolve) => {
        set_test_config_validation(element, value);
        globals.test_config[element] = value;
        resolve()
    })

}

const set_test_config_validation = (element, value) => {
    log(chalk.yellow('Set Test Config Validation'))
    log(chalk.yellow(element));
    log(chalk.yellow(value));
    // logging
    if (element === 'filename' && typeof value === 'string') return
    if (element === 'dirname' && typeof value === 'string') return
    // co
    if (element === 'co_actuator' && typeof value === 'string') return
    if (element === 'co_output' && typeof value === 'number' || typeof value === 'boolean') return
    // disturbances
    if (element === 'circulation_top' && typeof value === 'boolean') return
    if (element === 'circulation_bottom' && typeof value === 'boolean') return
    if (element === 'aircon' && typeof value === 'boolean') return
    if (element === 'heater' && typeof value === 'boolean') return
    if (element === 'humidifier' && typeof value === 'number') return
    if (element === 'intake' && typeof value === 'number') return
    if (element === 'exhaust' && typeof value === 'number') return
    // op_level
    if (element === 'Temperature' && typeof value === 'boolean') return
    if (element === 'Humidity' && typeof value === 'boolean') return
    if (element === 'CO2' && typeof value === 'boolean') return
    if (element === 'start_reference' && typeof value === 'string') return
    if (element === 'dlo' && typeof value === 'number') return
    // terminators
    if (element === 'terminator' && typeof value === 'string') return
    if (element === 'cycles_limit' && typeof value === 'number') return
    if (element === 'cycles_count' && typeof value === 'number') return
    if (element === 'dlo_reference' && typeof value === 'string') return
    throw new Error('Invalid test_config element or value given: ' + element + ' value: ' + value);
}

module.exports = {
    get,
    getter,
    set_environment_config,
    set_environment_state,
    set_session_state,
    set_pid_state,
    set_actuator_state,
    set_overrides_state,
    set_test_config
}
