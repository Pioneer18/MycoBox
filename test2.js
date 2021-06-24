const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('dev/ttyAMA0');
const parser = port.pipe(new Readline());
parser.on('data', console.log);
port.write("M 4\r\n");
port.write("K 2\r\n");
