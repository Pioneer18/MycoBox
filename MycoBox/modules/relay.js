/**
 * Relay Module:
 * 
 */
const Gpio = require('onoff').Gpio;

module.exports = {
    /* Relay Module 1 */

    // Air Conditioner
    s1r1_on:() => {
        const relay = new Gpio(0, 'out');
        relay.writeSync(0)
    },

    s1r1_off: () => {
        const relay = new Gpio(0, 'out');
        relay.writeSync(1)
    }


}