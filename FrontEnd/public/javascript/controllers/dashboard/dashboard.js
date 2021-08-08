/**
 * Dashboard Controller
 */
console.log('Starting the Dashboard Controller')

const insert_sensor_values = (values) => {
    for (val in values) {
        switch (val)) {
            case 'temp':
                document.getElementById('temp_field').innerHTML = '35C';
                break;
            case 'humidity':
                document.getElementById('humidity_field').innerHTML = '35C';
            case 'co2':
                document.getElementById('co2_field').innerHTML = '35C';
            default:
                break;
        }
    }
}
const values = ['temp', 'humidity','co2']
insert_sensor_values(values)
    