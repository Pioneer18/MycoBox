/**
 * Relay Module:
 * 
 */
const Gpio = require('onoff').Gpio;
const IN4R1 = new Gpio(13, 'out');
IN4R1.writeSync(0);

module.exports = {
   /* Relay Module 1 */

   // Air Conditioner
   s1r1_on = () => {
       const relay = new Gpio(0, 'out');
       relay.writeSync(0)
   },

   s1r1_off = () => {
    const relay = new Gpio(0, 'out');
    relay.writeSync(1)
}

    
}