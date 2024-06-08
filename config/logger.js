const winston = require("winston");

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4, 
    debug: 5,
    silly: 6
}

const logger = winston.createLogger({
    levels,
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [ new winston.transports.Console()]
});

module.exports = logger;

// sources:
// https://www.npmjs.com/package/winston?activeTab=readme
// https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
