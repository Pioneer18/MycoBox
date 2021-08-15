// Session Status
process.env.session_id = '' // for logs
process.env.user_id = '' // for logs
process.env.active_session = false // checked by newSession method only once
process.env.duration = ''
process.env.canceled = '' // inidcates the session was canceled
process.env.status.spawn_running = false
process.env.status.primordia_init = false
process.env.status.fruiting = false
// Envrionment Config
process.env.temp = ''
process.env.irTemp = ''
process.env.humidity = ''
process.env.co2 = ''
process.env.lighting = ''
// circulation_top: ''
// circulation_bottom: ''
// full_circulation: ''


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
process.env.ib_light = false // 10
process.env.speakers = false // 11


// Overrides
process.env.flag = false // must be true for overrides to be honored
process.env.circulation_bottom = false
process.env.circulation_top = false
process.env.intake = false
process.env.exhaust = false
process.env.ac = false
process.env.heater = false
process.env.mister = false
process.env.humidifier = false
process.env.mb_light_1 = false
process.env.mb_light_2 = false
process.env.ib_light = false
process.env.speakers = false

// Environment Model
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