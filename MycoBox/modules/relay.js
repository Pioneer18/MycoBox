/**
 * Module for switching the physical relay
 */
const Gpio = require('onoff').Gpio;
const IN4R1 = new Gpio(2, 'out');
IN4R1.writeSync(1);