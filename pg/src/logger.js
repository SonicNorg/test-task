const path = require('path');
// const { transports, createLogger, format } = require('winston');
const winston = require('winston');
const loggerLevel = require('./config').loggerLevel;

const getFileNameAndLineNumber = () => {
    const oldStackTrace = Error.prepareStackTrace;
    try {
        // eslint-disable-next-line handle-callback-err
        Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
        Error.captureStackTrace(this);
        // in this example I needed to "peel" the first CallSites in order to get to the caller we're looking for
        // in your code, the number of stacks depends on the levels of abstractions you're using
        // in my code I'm stripping frames that come from logger module and winston (node_module)
        const callSite = this.stack.find(line => line.getFileName().indexOf('/logger/') < 0 && line.getFileName().indexOf('/node_modules/') < 0);
        return callSite.getFileName() + ':' + callSite.getLineNumber();
    } finally {
        Error.prepareStackTrace = oldStackTrace;
    }
};

const options = {
    file: {
        maxsize: 5242880, // 5MB
        maxFiles: 15,
        colorize: false,
    },
    console: {
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    level: loggerLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: {service: 'PaymentGate'},
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File({filename: path.join(__dirname, 'logs', 'error.log'), level: 'error', timestamp: true, ...options.file}),
        new winston.transports.File({filename: path.join(__dirname, 'logs', 'output.log'), timestamp: true}),
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;
