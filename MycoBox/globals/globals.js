// Session State
process.env.session_state = {
    session_id: '',
    user_id: '',
    active_session: '',
    duration: '',
    canceled: '',
    spawn_running: false,
    primordia_init: false,
    fruiting: false
}
// Envrionment Configuration
process.env.environment_config = {
    spawn_running: {
        temp_setpoint: '',
        irTemp_setpoint: '', // trigger session end
        humidity_setpoint: '',
        co2_setpoint: '',
        circulation_top: '',
        circulation_bottom: '',
        lighting_setpoint: ''
    },
    primordia_init: {
        temp_setpoint: '',
        humidity_setpoint: '',
        co2_setpoint: '',
        circulation_top: '',
        circulation_bottom: '',
        lighting_setpoint: ''
    },
    fruiting: {
        temp_setpoint: '',
        humidity_setpoint: '',
        co2_setpoint: '',
        circulation_top: '',
        circulation_bottom: '',
        lighting_setpoint: ''
    }
}

// measured state
process.env.internal_temp_1 = '' // dht22_1 bottom
process.env.internal_temp_2 = '' // dht22_2 mid
process.env.internal_temp_3 = '' // dht22_3 top
process.env.precise_temp_c = '' // max31855
process.env.precise_temp_f = '' // max31855
process.env.external_temp = '' // dht22_3
process.env.internal_humidity_1 = '' // dht_22_1
process.env.internal_humidity_2 = '' // dht_22_2
process.env.internal_humidity_3 = '' // dht_22_3
process.env.external_humidity = '' // dht_22_3
process.env.co2 = '' // cozIr-A
process.env.weight = '' // esp8266

// Actuators' Status
process.env.circulation_bottom = false // 1
process.env.circulation_top = false // 2
process.env.intake = false // 3
process.env.exhaust = false // 4
process.env.ac = false // 5
process.env.heater = false // 6 
process.env.humidifier = false // 7
process.env.mb_light_1 = false // 8
process.env.mb_light_2 = false // 9
process.env.ib_light = false // 10 incubator light
process.env.speakers = false // 11

// Overrides
process.env.overrides = {
    flag = false, // must be true for overrrides to be honored
    circulation_bottom = false,
    circulation_top = false,
    intake = false,
    exhaust = false,
    ac = false,
    heater = false,
    mister = false,
    humidifier = false,
    mb_light_1 = false,
    mb_light_2 = false,
    ib_light = false,
    speakers = false
} 