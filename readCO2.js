const SerialPort = require('serialport');
SerialPort.Binding = require('@serialport/bindings');
const serialport = new SerialPort('/dev/ttyAMA0');
const Readline = SerialPort.parsers.Readline;
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
// Log the port data
serialport.on('data', function(data) {
    console.log('Data:', data)
});
// Log Errors
serialport.on('error', function(err) {
    console.log('Error:', err.message)
});
const lineStream = serialport.pipe(new Readline());
console.log(lineStream);