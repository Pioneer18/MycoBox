// spawn a python file to request CO2 reading
const { spawn } = require('child_process');
console.log('spawning the process now');
const process = spawn('python', ["../../../python/CO2.py"]);

// log stdout from the process
process.stdout.on('data', function(data) {
    console.log(`stdout: ${data}`);
})

// log errors from the process
process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});
  
// log the exit code when
process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});