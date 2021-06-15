const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const serialport = new SerialPort('/dev/ttyAMA0');
const parser = new Readline()
serialport.pipe(parser)
console.log("Set Display Mode and Operation Mode");
serialport.write("M 4\r\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
});
serialport.write("K 2\r\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
});
setTimeout(()=> {}, 1000); // pause 1 second
//Request the CO2
console.log('Requet the CO2');
serialport.write("Z\r\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
});
// Read the Port
console.log("Read Serial Port");
serialport.on('readable', function() {
    console.log('Data: ', serialport.read())
});

serialport.on('data', function(data) {
    console.log('Data:', data)
});
// Log the port data
parser.on('data', function(data){
    console.log('parser log: ', data);
})
// Log Errors
serialport.on('error', function(err) {
    console.log('Error:', err.message)
});
