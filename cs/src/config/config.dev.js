module.exports.dbConfig = {
    user: 'CS_TEST',
    password: '1qaz2wsx',
    connectString: 'pttb.ru:1521/osadb.oracle.com',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

module.exports.loggerLevel = process.env.LOGGER_LEVEL || 'debug';
