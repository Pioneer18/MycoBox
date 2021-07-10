/**
 * Module for switching the physical relay
 */
const Gpio = require('onoff').Gpio;
const IN4R1 = new Gpio(3, 'out');
IN4R1.writeSync(1);