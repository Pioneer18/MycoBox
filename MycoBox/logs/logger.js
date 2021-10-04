const { get } = require("../globals/globals")
const chalk = require('chalk');
const log = console.log;

/**
 * Test Logger
 */
const test_logger = () => {

}

const test_file_path = () => {
    // get the dirname and filename from globals
    get('test_config')
        .then(config => {
            log(chalk.green('Logger`s working directory'))
            log(chalk.green(__dirname));
            log(chalk.magenta("-------------------------------------------"))
            log(chalk.magenta(config))
            // create the file path: ../../
        })
}

module.exports = {

}