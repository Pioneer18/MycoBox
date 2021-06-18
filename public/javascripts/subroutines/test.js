// Execute a python file to request CO2 reading
const { exec } = require('child_process');
console.log('Executing the python script now');
const process = exec('python', ["../../../python/CO2.py"]);

// log stdout from the process
process.stdout.on('data', function(data) {
    console.log(`stdout: ${data}`);
})

// log errors from the process
process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});
  
// log the exit code
process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});