const winston = require('winston');

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ]
});
