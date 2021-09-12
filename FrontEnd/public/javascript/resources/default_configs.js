
const default_configs = {
    pink_oyster: { 
        spawn_running: {
            temperature: '31',
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
    },
    golden_oyster: {
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
            flushess: '', // number of flush and domarncy cycles
            dormancy: '' // duration in between flushes
        }
    },
    shitake: {
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
            flushess: '', // number of flush and domarncy cycles
            dormancy: '' // duration in between flushes
        }
    }
}

export {default_configs};