const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyAMA0');
port.write("M 4\r\n");
port.write("K 2\r\n");
setTimeout(() => {
    console.log('pause a second')
}, 1000);
port.on('readable', () => {
    console.log('Data: ', port.read());
});
port.on('data', (data)=> {
    console.log('Data: ', data);
});
const lineStream = port.pipe(new Readline({ delimiter: '\r\n' }));
lineStream.on('data', (data)=> {
    console.log(data);
})