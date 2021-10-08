const test_config = {
    spawn_running: {
        temperature: '25',
        humidity: '75',
        co2: '15000',
        circulation_top: 'off',
        circulation_bottom: 'off',
        lighting: 'off',
        trigger: true,
        duration: null
    },
    primordia_init: {
        user_confirmed: false,
        duration: 3,
        temperature: '25',
        humidity: '85',
        co2: '400',
        circulation_top: 'Mid',
        circulation_bottom: 'Mid',
        lighting: 'On' // need better options for lighting
    },
    fruiting: {
        temperature: '20',
        humidity: '90',
        co2: '400',
        circulation_top: 'mid',
        circulation_bottom: 'mid',
        lighting: 'on',
        duration: '14',
        flushes: '3', // number of flush and domarncy cycles
        dormancy: '10' // duration in between flushes
    }
}

module.exports = { test_config }