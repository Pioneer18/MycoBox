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
// Hide or Display the Overrides
// pass default env config object for selected mushroom or map new env config
function acceptDefaults () {
    console.log("applying event listeners to accept_defaults")
    let rad = document.main_config_form.accept_defaults;
    console.log(rad);
    let prev = null;
    const overrides = document.getElementById('overrides');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            if ( rad[i].value == 'Yes') {
                overrides.classList.add('hidden');
                DEFAULTS = true;
            } 
            if ( rad[i].value !== 'Yes') {
                overrides.classList.remove('hidden');
                DEFAULTS = false
            }
        });
    }
}

function startProcess(e) {
    e.preventDefault()
    processConfiguration()
    // set the environmental variables
 
}

function processConfiguration() {
    const form = document.getElementById("main_config_form");
    console.log(form);
    let process_settings;
    console.log("Defaults: ", DEFAULTS);
    // check for overrides
    if (DEFAULTS) {
        // select default_config for the selected mushroom
        console.log(default_configs)
        process_settings = default_configs[form.process][form.mushroom]
        console.log(process_settings);

    }
}

acceptDefaults();