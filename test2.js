const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyAMA0');
const parser = port.pipe(new Readline());
port.write("M 4\r\n");
port.write("K 2\r\n");
setTimeout(() => {
    console.log('pause a second')
}, 1000);
parser.on('data', console.log);
