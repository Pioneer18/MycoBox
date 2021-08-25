/**
 * Global Variables
 */
// Session State
let globals = {
    session_state: {
        session_title: '',
        session_id: '',
        user_id: '',
        active_session: false,
        canceled: false,
        spawn_running: false,
        primordia_init: false,
        fruiting: false
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
            duration: '' || null // null if temp_trigger is true
        },
        primordia_init: {
            user_confirmed: false, // if true, no duration
            duration: '' || null,
            temperature: '',
            humidity: '',
            co2: '',
            circulation_top: '',
            circulation_bottom: '',
            lighting: ''
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
        circulation_bottom: false, // 1
        circulation_top: false, // 2
        intake: false, // 3
        exhaust: false, // 4
        ac: false, // 5
        heater: false, // 6 
        humidifier: false, // 7
        mb_light_1: false, // 8
        mb_light_2: false, // 9
        ib_light: false, // 10 incubator light
        speakers: false // 11
    },
    pid_state: {
        temperature: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0
        },
        humidity: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0
        },
        ventilation: {
            integralOfError: 0,
            lastError: 0,
            lastTime: 0
        }
    },
    overrides: {
        flag: false, // must be true for overrrides to be honored
        circulation_bottom: false,
        circulation_top: false,
        intake: false,
        exhaust: false,
        ac: false,
        heater: false,
        mister: false,
        humidifier: false,
        mb_light_1: false,
        mb_light_2: false,
        ib_light: false,
        speakers: false
    }
};

// define getter and setter for globals 
/**
 * Grab a section from the globals object
 * @param {string} section section of the globals object
 * @returns the section
 * todo: add 'element' param, for searching section and element
 */
const get = async (section) => {
    switch (section) {
        case 'session_state':
            return globals.session_state
        case 'environment_config':
            return globals.environment_config
        case 'environment_state':
            return globals.environment_state
        case 'actuators_state':
            return globals.actuators_state
        case 'pid_state':
            return globals.pid_state
        case 'overrides':
            return globals.overrides
        default:
            return null;
    }
}

/**
 * set globals section or element
 */
const set_environment_config = async (config) => {
    if (!config) throw new Error('Invlaid config');
    console.log('Setting the Environment Config: ')
    console.log(config)
    // validate the config matches what is expected !!!
    globals.environment_config = config;
    return
}

/**
 * Set the value of an environment state element
 * @param {*} element evironment state element to set
 * @param {*} value the value to set for the element
 */
const set_environment_state = async (element, value) => {
    try {
        if (typeof element !== 'string' || !value) throw new Error('No value to set, something is likely undefined')
        globals.environment_state[element] = value
        return
    } catch(err) {
        console.log('Error Setting the environment state: ' + err);
    }
}

/**
 * Set the value of a session state element
 * @param {*} element session state element to set
 * @param {*} value the value to set for the element
 */
const set_session_state = (element, value) => {
    console.log('Setting the Session State: Active Session Will Be true')
    console.log(element, value)
    try {
        if (typeof element !== 'string' || !value) throw new Error('No value to set, something is likely undefined')
        globals.environment_state[element] = value
        return
    } catch(err) {
        console.log('Error Setting the session state: ' + err);
    }
}

module.exports = {
    get,
    set_environment_config,
    set_environment_state,
    set_session_state
}
