/**
 * Dashboard Controller
 * note: make the values importable constants
 * TODO: make globals that's synced with the backend (session state)
 */
import { readEnvironmentModel } from '../../api/dashboard.js';
console.log('Starting the Dashboard Controller')

const active_session = true;

const insert_sensor_values = async () => {
    console.log('Reading the Environment Model')
    const values = await readEnvironmentModel()
    console.log('Here are the Values from within the controller')
    console.log(values)
    document.getElementById('iTemp1').innerHTML = values['internal_temp_1']
    document.getElementById('iTemp2').innerHTML = values['internal_temp_2']
    document.getElementById('iTemp3').innerHTML = values['internal_temp_3']
    document.getElementById('pTempC').innerHTML = values['precise_temp_c']
    document.getElementById('pTempF').innerHTML = values['precise_temp_f']
    document.getElementById('eTemp').innerHTML = values['external_temp']
    document.getElementById('iHumidity1').innerHTML = values['internal_humidity_1']
    document.getElementById('iHumidity2').innerHTML = values['internal_humidity_2']
    document.getElementById('iHumidity3').innerHTML = values['internal_humidity_3']
    document.getElementById('eHumidity').innerHTML = values['external_humidity']
    document.getElementById('co2').innerHTML = values['co2']
    document.getElementById('weight').innerHTML = values['weight']
}

const run_dashboard = () => {
    while (active_session) {
        setTimeout(() => {
            insert_sensor_values()
        }, 6000);
    }
}

run_dashboard()
