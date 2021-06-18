// require child_process.exc method
const { spawn } = require('child_process');
// spawn a python file to request CO2 reading
console.log('spawning the process now');
const process = spawn('python', ["../../../python/CO2.py"]);
// log stdout from the process
process.stdout.on('data', function(data) {
    console.log(`stdout: ${data}`);
})

process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});
  
process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});