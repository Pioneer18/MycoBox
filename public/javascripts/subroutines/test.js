// require child_process.exc method
var spawn = require('child_process').exec;
// spawn a python file to request CO2 reading
var process = spawn('python', ['../../../python/CO2.py']);
// log stdout from the process
process.stdout.on('data', function(data) {
    console.log(data);
})