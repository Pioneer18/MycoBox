/**
 * Sensors Controller
 */
const {PythonShell} = require('python-shell')
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '../python',
    // args: ['value1', 'value2', 'value3']
  };

module.exports = {
    // return a reading from every sensor
    setEnvironmentModel: ()=> {
        PythonShell.run('CO2.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    }
}