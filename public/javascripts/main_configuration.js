const default_configs = {
    incubation: {
        pink_oyster: {
            temperature: '',
            humidity: '',
            co2: '',
            lighting: false,
            duration: 35 // days
        },
        golden_oyster: {
            temperature: '',
            humidity: '',
            co2: '',
            lighting: false,
            duration: 35 // days
        },
        blue_oyster: {
            temperature: '',
            humidity: '',
            co2: '',
            lighting: false,
            duration: 35 // days
        },
        shitake: {
            temperature: '',
            humidity: '',
            co2: '',
            lighting: false,
            duration: 35 // days
        }
    },
    fruiting: {
        pink_oyster: {
            temperature: '', // celsius
            humidity: '',
            co2: '', // ppm
            lighting: true,
            duration: 35 // days
        },
        golden_oyster: {
            temperature: '', // celsius
            humidity: '',
            co2: '', // ppm
            lighting: true,
            duration: 35 // days
        },
        blue_oyster: {
            temperature: '', // celsius
            humidity: '',
            co2: '', // ppm
            lighting: true,
            duration: 35 // days
        },
        shitake: {
            temperature: '', // celsius
            humidity: '',
            co2: '', // ppm
            lighting: true,
            duration: 35 // days
        }
    }
}
let DEFAULTS = true;
// Display or hide the overrides section of the form
const displayOverrides = () => {
    let rad = document.main_config_form.accept_defaults;
    let prev = null;
    const overrides = document.getElementById('overrides');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function () {
            if (rad[i].value == 'Yes') {
                overrides.classList.add('hidden');
                DEFAULTS = true;
            }
            if (rad[i].value !== 'Yes') {
                overrides.classList.remove('hidden');
                DEFAULTS = false
            }
        });
    }
}

// Start the process on form submit
document.main_config_form.onsubmit = (event) => {
    // map the form
    event.preventDefault();
    const form = mapForm();
};

const mapForm = () => {
    let form = document.main_config_form;
    let mushroom = form.mushroom.value;
    let process = form.process.value;
    // overrides
    if (!DEFAULTS) {
        let overrides = {};
        overrides.temperature_c = form.temperature_c.value;
        overrides.humidity = form.humidity.value;
        overrides.co2_ppm = form.co2_ppm;
        overrides.lighting = form.lighting;
        overrides.duration_days = form.duration_days;
        console.log(overrides);
    }
}


displayOverrides();