const path = require('path');
const winston = require('winston');
const loggerLevel = require('./config').loggerLevel;

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
        new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'error.log'),
            level: 'error',
            timestamp: true, ...options.file
        }),
        new winston.transports.File({filename: path.join(__dirname, 'logs', 'output.log'), timestamp: true}),
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports.debug = module.exports.log = function() {
    logger.debug.apply(logger, formatLogArguments(arguments))
};

module.exports.info = function() {
    logger.info.apply(logger, formatLogArguments(arguments))
};

module.exports.warn = function() {
    logger.warn.apply(logger, formatLogArguments(arguments))
};

module.exports.error = function() {
    logger.error.apply(logger, formatLogArguments(arguments))
};

module.exports.stream = logger.stream;

function formatLogArguments(args) {
    args = Array.prototype.slice.call(args);
    const stackInfo = getStackInfo(1);

    if (stackInfo) {
        const calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';
        if (typeof (args[0]) === 'string') {
            args[0] = calleeStr + ' ' + args[0]
        } else {
            args.unshift(calleeStr)
        }
    }
    return args
}

function getStackInfo(stackIndex) {
    const stacklist = (new Error()).stack.split('\n').slice(3)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(__dirname, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
        }
    }
};
