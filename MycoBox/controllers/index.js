/**
 * MycoBox Controllers index
 */
const SystemController = require('./system.controller');
const TemperatureController = require('../controllers/temperature.controller');

module.exports = {
    systemController: SystemController,
    temperatureController: TemperatureController,
}