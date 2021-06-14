const SerialPort = require('serialport');
SerialPort.Binding = require('@serialport/bindings');
const Readline = SerialPort.parsers.Readline;
const serialport = new SerialPort('/dev/ttyAMA0');
const parser = new Readline();
serialport.pipe(parser);
parser.on('data', console.log)
console.log("Set Display Mode and Operation Mode");
serialport.write("M 4\r\n");
serialport.write("K 2\r\n");
serialport.flush();
setTimeout(()=> {}, 1000); // pause 1 second
serialport.write("Z\r\n");
console.log("Rquest CO2");
serialport.write("Z\r\n");
resp = serialport.read(10);
console.log(resp);