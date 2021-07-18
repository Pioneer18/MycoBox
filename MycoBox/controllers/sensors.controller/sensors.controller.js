/**
 * Sensors Controller
 */
const {PythonShell} = require('python-shell')
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../../python',
    // args: ['value1', 'value2', 'value3']
  };

module.exports = {
    /**
     * DHT22 Temperature & humidity readings - internal & external
     * @param {Array} reply []
     */
    read_temp_humidity: () => {
        PythonShell.run('temp.humidity.py', options, function(err, reply) {
            if (err) throw err
            console.log('reply: %j', reply)
            return reply
        })
    },

    /**
     * MAX31855 Temperature - internal precise temp
     */
    read_precise_temp: () => {

    },

    /**
     * CO2 readings from COZIR-A sensor
     * @param {Array} reply ["CO2 PPM = 536.0"]
     */
    read_co2: ()=> {
        PythonShell.run('CO2.py', options, function (err, reply) {
            if (err) throw err
            console.log('reply: %j', reply)
            return reply
        });
    },

    /**
     * Weight readings from Esp8266 scale ** HTTP or Serial request
     * @param {Array} reply
     */
    read_scale: () => {

    },

    /**
     * Infrared Temp readings - grow bags
     * @param {Array} reply
     */
    read_infrared: () => {
        
    },

    /**
     * Set Environment Model - return readings of every sensor group
     */
    set_environment_model: () => {
        const temperature_humidity = read_temp_humidity()
        const precise_temp = this.read_precise_temp()
        const co2 = this.read_co2()
        const weight = this.read_scale()
        const irTemp = this.read_infrared()
        return {temperature_humidity, co2}
    }

}