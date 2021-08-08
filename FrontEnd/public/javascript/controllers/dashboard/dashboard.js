/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')

const insert_sensor_values = (values) => {
    for (const val of values) {
        console.log(val)
        if(val === 'temp') document.getElementById('temp_field').innerHTML = '35C';
        if(val === 'humidity') document.getElementById('humidity_field').innerHTML = '95%';
        if(val === 'co2') document.getElementById('co2_field').innerHTML = '15,000ppm';
    }
}
const values = ['temp', 'humidity','co2']
insert_sensor_values(values)
    