/**
 * Events:
 * 
 * open: on port open 
 * 
 * close: on port close
 * 
 * data: listening for data, puts port in flowing mode. Data is emitted as soon as it arrives; it's a buffer
 * 
 * drain:
 */

/**
 * Methods:
 * 
 * write: write data, buffered if receiving port is not open yet
 * 
 * read: request a number of bytes from the SerialPort, it pulls the data from the internal buffer
 * 
 * flush: wipe unwritten or read data
 */

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyAMA0');
port.write("M 4\r\n");
port.write("K 2\r\n");
port.drain((err)=> {
    if (err) console.log(err)
});
port.write("Z\r\n");
// port on readable
// port data flow
port.on('readable', function () {
    console.log('Data:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data)
})

const data = port.read(10);
console.log(data);

