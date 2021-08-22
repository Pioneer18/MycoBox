/**
 * Configuration Form Controller
 */
import { default_configs } from '../../resources/default_configs.js';
import { newSession } from '../../api/configuration.js';

let DEFAULTS = true;

const displayOverrides = () => {
    let rad = document.main_config_form.accept_defaults;
    const custom_config = document.getElementById('custom_config');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', () => {
            if (rad[i].value == 'Yes') {
                custom_config.classList.add('hidden');
                DEFAULTS = true;
            }
            if (rad[i].value !== 'Yes') {
                custom_config.classList.remove('hidden');
                DEFAULTS = false
            }
        });
    }
}

const spawnRunningTrigger = () => {
    let rad = document.main_config_form.sr_trigger;
    const overrides = document.getElementById('sr_duration_field');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', () => {
            if (rad[i].value == 'Duration') {
                overrides.classList.remove('hidden');
            }
            if (rad[i].value !== 'Duration') {
                overrides.classList.add('hidden');
            }
        });
    }
}

const primordiaInitTrigger = () => {
    let rad = document.main_config_form.pi_trigger;
    const overrides = document.getElementById('pi_duration_field');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', () => {
            if (rad[i].value == 'Duration') {
                overrides.classList.remove('hidden');
            }
            if (rad[i].value !== 'Duration') {
                overrides.classList.add('hidden');
            }
        });
    }
}

// Start a new mycobox session on form submit
document.main_config_form.onsubmit = (e) => {
    e.preventDefault();
    // map the form
    const {config } = mapForm();
    // send Http request to start process on MycoBox
    newSession(config)
};

const mapForm = () => {
    let form = document.main_config_form;
    console.log(`here is the form`)
    console.log(form);
    let mushroom = form.mushroom.value;
    // Start process with overrrides
    if (!DEFAULTS) {
        let custom_config = {
            spawn_running: {
                temperature: form.sr_temperature.value,
                humidity: form.sr_humidity.value,
                co2: form.sr_co2.value,
                circulation_top: form.sr_circulation_top.value,
                circulation_bottom: form.sr_circulation_bottom.value,
                lighting: form.sr_lighting.value,
                trigger: form.sr_trigger.value,
                duration: form.sr_duration.value
            },
            primordia_init: {
                temperature: form.pi_temperature.value,
                humidity: form.pi_humidity.value,
                co2: form.pi_co2.value,
                circulation_top: form.pi_circulation_top.value,
                circulation_bottom: form.pi_circulation_bottom.value,
                lighting: form.pi_lighting.value,
                trigger: form.pi_trigger.value,
                duration: form.pi_duration.value,
            },
            fruiting: {
                temperature: form.fr_temperature.value,
                humidity: form.fr_humidity.value,
                co2: form.fr_co2.value,
                circulation_top: form.fr_circulation_top.value,
                circulation_bottom: form.fr_circulation_bottom.value,
                lighting: form.fr_lighting.value,
                duration: form.fr_duration.value,
                flushes: form.fr_flushes.value, // number of flush and domarncy cycles
                dormancy: form.fr_dormancy.value // duration in between flushes
            }
        };
        console.log(custom_config);
        return { custom_config };
    }
    return { config: default_configs[mushroom] }

}

displayOverrides();
spawnRunningTrigger();
primordiaInitTrigger();
