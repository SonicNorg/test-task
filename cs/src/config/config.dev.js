module.exports.dbConfig = {
    user: 'CS_TEST',
    password: '1qaz2wsx',
    connectString: 'pttb.ru:1521/osadb.oracle.com',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

/*
error: 0,   warn: 1,  info: 2,  http: 3,   verbose: 4,   debug: 5,  silly: 6
*/
module.exports.loggerLevel = process.env.LOGGER_LEVEL || 'debug';
