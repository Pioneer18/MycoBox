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
            if (rad[i].value == 'Yes') {
                overrides.classList.remove('hidden');
            }
            if (rad[i].value !== 'Yes') {
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
            if (rad[i].value == 'Yes') {
                overrides.classList.remove('hidden');
            }
            if (rad[i].value !== 'Yes') {
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
    let mushroom = form.mushroom.value;
    // Start process with overrrides
    if (!DEFAULTS) {
        let overrides = {};
        overrides.temperature_c = form.temperature_c.value;
        overrides.humidity = form.humidity.value;
        overrides.co2_ppm = form.co2_ppm.value;
        overrides.lighting = form.lighting.value;
        overrides.duration_days = form.duration_days.value;
        return { overrides };
    }
    return { config: default_configs[mushroom] }

}

displayOverrides();
spawnRunningTrigger();
primordiaInitTrigger();
