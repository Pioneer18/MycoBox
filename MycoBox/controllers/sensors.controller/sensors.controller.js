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
     * Temperature readings - internal & external
     * @param {Array} reply []
     */
    readTemp: () => {

    },

    /**
     * CO2 readings from COZIR-A sensor
     * @param {Array} reply ["CO2 PPM = 536.0"]
     */
    readCO2: ()=> {
        PythonShell.run('CO2.py', options, function (err, reply) {
            if (err) throw err;
            console.log('reply: %j', reply);
            return reply;
        });
    },

    /**
     * Humidity readings - internal & external
     * @param {Array} reply
     */
    readHumidity: () => {

    },

    /**
     * Weight readings from Esp8266 scale ** HTTP or Serial request
     * @param {Array} reply
     */
    readScale: () => {

    },

    /**
     * Infrared Temp readings - grow bags
     * @param {Array} reply
     */
    readInfrared: () => {
        
    },

    /**
     * Set Environment Model - return readings of every sensor group
     */
    setEnvironmentModel: () => {
        const temperature = this.readTemp();
        const humidity = this.readHumidity();
        const co2 = this.readCO2();
        const weight = this.readScale();
        const irTemp = this.readInfrared();
        return 'ENVIRONMENT_MODEL SET'
    }

}