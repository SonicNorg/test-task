module.exports.dbConfig = {
    user: 'CS_TEST',
    password: '1qaz2wsx',
    connectString: 'pttb.ru:1521/osadb.oracle.com',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

module.exports.csConfig = {
    CS_URL_PORT: '3001',
    CS_URL_PATH: 'http://localhost',
};

module.exports.loggerLevel = process.env.LOGGER_LEVEL || 'debug';

module.exports.appConfig = {
    ACTIVE_CUSTOMER_PAYMENT_ALLOWED: true,
    INACTIVE_CUSTOMER_PAYMENT_ALLOWED: false
};
