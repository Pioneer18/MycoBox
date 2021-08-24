
const default_configs = {
    pink_oyster: {
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
            numberOfharvests: '', // number of flush and domarncy cycles
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
            numberOfharvests: '', // number of flush and domarncy cycles
            dormancy: '' // duration in between flushes
        }
    }
}

export {default_configs};