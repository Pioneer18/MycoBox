const { createLogger, format, transports } = require('winston')

// Winston Logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'test-logger' },
    // transports are where the logs get sent
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'sensors.txt' })
    ]
});

// logger.info('What rolls down stairs');
// logger.info('alone or in pairs,');
// logger.info('and over your neighbors dog?');
// logger.warn('Whats great for a snack,');
// logger.info('And fits on your back?');
// logger.error('Its log, log, log');

module.exports = {
    logger
}