// Map of default environment configuration for each available mushroom
import { default_configs } from './resources/default_process_configs';
let DEFAULTS = true;

export default ConfigurationController = () => {// Display or hide the overrides section of the form
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

    // Start the process on form submit
    document.main_config_form.onsubmit = (e) => {
        // map the form
        e.preventDefault();
        const { process, config } = mapForm();
        // send Http request to start process on MycoBox
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
}