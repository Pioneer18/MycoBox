/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')

const insert_sensor_values = (values) => {
    for (let val in values) {
        if(val === 'temp') document.getElementById('temp_field').innerHTML = '35C';
    }
}
const values = ['temp', 'humidity','co2']
insert_sensor_values(values)
    