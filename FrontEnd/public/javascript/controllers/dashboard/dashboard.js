/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')
import {FrontEndApi} from '../../api/index.js';
const api = new FrontEndApi();

const insert_sensor_values = (values) => {
    console.log('Reading the Environment Model')
    api.readEnvironmentModel()
    for (const val in values) {
        console.log(val)
        if(val === 'temp') document.getElementById('temp_field').innerHTML = values[val];
        if(val === 'humidity') document.getElementById('humidity_field').innerHTML = values[val];
        if(val === 'co2') document.getElementById('co2_field').innerHTML = values[val];
    }
}
const values = {'temp': 35, 'humidity': 99,'co2': 15000}
insert_sensor_values(values)
    