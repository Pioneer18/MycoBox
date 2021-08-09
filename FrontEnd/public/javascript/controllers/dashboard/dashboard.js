/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')
import { FrontEndApi } from '../../api/index.js';
const api = new FrontEndApi();

const insert_sensor_values = (values) => {
    console.log('Reading the Environment Model')
    const values = api.readEnvironmentModel()
    console.log(`Values from DashboardController`)
    console.log(values)
    for (const val in values) {
        if (val === 'temp') document.getElementById('iTemp1').innerHTML = values[val]
        if (val === 'humidity') document.getElementById('iTemp2').innerHTML = values[val]
        if (val === 'co2') document.getElementById('iTemp3').innerHTML = values[val]
        if (val == 'iTemp1') document.getElementById('iTemp1').innerHTML = values[val]
        if (val == 'iTemp2') document.getElementById('iTemp2').innerHTML = values[val]
        if (val == 'iTemp3') document.getElementById('iTemp3').innerHTML = values[val]
        if (val == 'pTempC') document.getElementById('pTempC').innerHTML = values[val]
        if (val == 'pTempF') document.getElementById('pTempF').innerHTML = values[val]
        if (val == 'eTemp') document.getElementById('eTemp').innerHTML = values[val]
        if (val == 'iHumidity1') document.getElementById('iHumidity1').innerHTML = values[val]
        if (val == 'iHumidity2') document.getElementById('iHumidity2').innerHTML = values[val]
        if (val == 'iHumidity3') document.getElementById('iHumidity3').innerHTML = values[val]
        if (val == 'eHumidity') document.getElementById('eHumidity').innerHTML = values[val]
        if (val == 'co2') document.getElementById('co2').innerHTML = values[val]
        if (val == 'weight') document.getElementById('weight').innerHTML = values[val]
    }
}

insert_sensor_values(values)
