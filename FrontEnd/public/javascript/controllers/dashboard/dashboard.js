/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')

const insert_sensor_values = (values) => {
    for (const val in values) {
        console.log(val)
        if(val === 'temp') document.getElementById('temp_field').innerHTML = '35C';
        if(val === 'humidity') document.getElementById('humidity_field').innerHTML = '95%';
        if(val === 'co2') document.getElementById('co2_field').innerHTML = '15,000ppm';
    }
}
const values = {'temp': 35, 'humidity': 99,'co2': 15000}
insert_sensor_values(values)
    