/**
 * Configuration Form Controller
 */
import { default_configs } from '../../resources/default_configs.js';
import { newSession } from '../../api/configuration';

let DEFAULTS = true;

const displayOverrides = () => {
    let rad = document.main_config_form.accept_defaults;
    let prev = null;
    const overrides = document.getElementById('overrides');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', () => {
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

// Start a new mycobox session on form submit
document.main_config_form.onsubmit = (e) => {
    e.preventDefault();
    // map the form
    const { process, config } = mapForm();
    // send Http request to start process on MycoBox
    newSession(process, config)
};

const mapForm = () => {
    let form = document.main_config_form;
    let mushroom = form.mushroom.value;
    let process = form.process.value;
    // Start process with overrrides
    if (!DEFAULTS) {
        let overrides = {};
        overrides.temperature_c = form.temperature_c.value;
        overrides.humidity = form.humidity.value;
        overrides.co2_ppm = form.co2_ppm.value;
        overrides.lighting = form.lighting.value;
        overrides.duration_days = form.duration_days.value;
        return { process, overrides };
    }
    return { process, config: default_configs[process][mushroom] }

}

displayOverrides();
