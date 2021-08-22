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
            numberOfharvests: '', // number of flush and domarncy cycles
            dormancy: '' // duration in between flushes
        }
    },
    environment_state: {
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

module.exports = {
    globals
}
