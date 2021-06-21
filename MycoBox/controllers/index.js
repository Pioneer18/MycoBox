/**
 * MycoBox Controllers index
 */
const {SystemController} = require('./system.controller');

module.exports = {
    systemController: new SystemController(),
}