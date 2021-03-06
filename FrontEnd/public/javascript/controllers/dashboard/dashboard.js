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
    console.log('Here is internal_temp_1')
    console.log(parseFloat(values['internal_temp_1']))
    document.getElementById('TempC').innerHTML = parseFloat(values['internal_temp_c']).toFixed(2)
    document.getElementById('TempF').innerHTML = parseFloat(values['precise_temp_f']).toFixed(2)
    document.getElementById('eTemp').innerHTML = parseFloat(values['external_temp']).toFixed(2)
    document.getElementById('iHumidity').innerHTML = parseFloat(values['internal_humidity']).toFixed(2)
    document.getElementById('eHumidity').innerHTML = parseFloat(values['external_humidity']).toFixed(2)
    document.getElementById('co2').innerHTML = values['co2']
    document.getElementById('weight').innerHTML = values['weight']
}

function myFunction() {
    setInterval(function () { insert_sensor_values(); }, 9000);
}
myFunction()
