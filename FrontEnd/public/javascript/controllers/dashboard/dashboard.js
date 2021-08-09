/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')
import {FrontEndApi} from '../../api/index.js';
const api = new FrontEndApi();

const insert_sensor_values = (values) => {
    console.log('Reading the Environment Model')
    const values = api.readEnvironmentModel()
    console.log(`Values from DashboardController`)
    console.log(values)
    for (const val in values) {
        if(val === 'temp') document.getElementById('iTemp1').innerHTML = values[val];
        if(val === 'humidity') document.getElementById('iTemp2').innerHTML = values[val];
        if(val === 'co2') document.getElementById('iTemp3').innerHTML = values[val];
    }
}

insert_sensor_values(values)
    