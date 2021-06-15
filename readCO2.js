const SerialPort = require('serialport');
SerialPort.Binding = require('@serialport/bindings');
const Readline = SerialPort.parsers.Readline;
const serialport = new SerialPort('/dev/ttyAMA0');
const parser = new Readline();
serialport.pipe(parser);
parser.on('data', console.log)
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
serialport.write("Z\r\n", function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
});
console.log("Rquest CO2");
resp = serialport.read(10);
console.log('Response: ',resp);