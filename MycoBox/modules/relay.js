/**
 * Relay Module:
 * provides methods for switching the 12 relays on/off
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
    },

    // Heater
    s2r1_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s2r1_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Humidifier
    s3r1_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s3r1_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Intake Fan
    s4r1_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s4r1_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Realy 2 1
    s1r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s1r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 2
    s2r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s2r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 3
    s3r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s3r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 4
    s4r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s4r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 5
    s5r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s5r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 6
    s6r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s6r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 7
    s7r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s7r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

    // Relay 2 8
    s8r2_on: () => {
        const relay = new Gpio()
        relay.writeSync(0)
    },

    s8r2_off: () => {
        const relay = new Gpio()
        relay.writeSync(1)
    },

}