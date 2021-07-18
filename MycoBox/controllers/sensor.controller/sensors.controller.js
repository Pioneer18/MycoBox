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
     * CO2 
     * @param {Array} reply ["CO2 PPM = 536.0"]
     */
    readCO2: ()=> {
        PythonShell.run('CO2.py', options, function (err, reply) {
            if (err) throw err;
            console.log('reply: %j', reply);
            return reply;
        });
    }
}