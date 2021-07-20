global.sessionConfig = {
    active_session: '', // checked by newSession method only once
    session_id: '', // for logs
    user_id: '', // for logs
    duration: '',
    canceled: false, // will end the session
}
global.environmentConfig = {
    temp: '',
    irTemp: '',
    humidity: '',
    co2: '',
    lighting: ''
    // circulation_top: '',
    // circulation_bottom: '',
    // full_circulation: '',
}
global.systemStatus = {
    /* ------------------ Actuators (on/off) ------------------  */
    circulation_bottom: false, // 1
    circulation_top: false, // 2
    intake: false, // 3
    exhaust: false, // 4
    ac: false, // 5
    heater: false, // 6 
    humidifier: false, // 7
    mb_light_1: false, // 8
    mb_light_2: false, // 9
    ib_light: false, // 10
    speakers: false // 11
}
global.overrides = {
    /* ------------------ Overrieds (on/off) ------------------ */
    flag: false, // must be true for overrides to be honored
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
    speakers: false,
}
// Environment Model
process.env.internal_temp_1 = '' // dht22_1
process.env.internal_temp_2 = '' // dht22_2
process.env.precise_temp_c = '' // max31855
process.env.precise_temp_f = '' // max31855
process.env.external_temp = '' // dht22_3
process.env.internal_humidity_1 = '' // dht_22_1
process.env.internal_humidity_2 = '' // dht_22_2
process.env.external_humidity = '' // dht_22_3
process.env.co2 = '' // cozIr-A
process.env.weight = '' // esp8266