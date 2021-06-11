/**
 * Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
 * follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
 */
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 19200
})