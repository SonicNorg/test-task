module.exports.dbConfig = {
    user: process.env.ORACLEDB_USER || '',
    password: process.env.ORACLEDB_PASSWORD || '',
    connectString: process.env.ORACLEDB_CONNECTIONSTRING || '',
    poolMin: process.env.ORACLEDB_POOL_MIN || 10,
    poolMax: process.env.ORACLEDB_POOL_MAX || 10,
    poolIncrement: process.env.ORACLEDB_POOL_INCREMENT || 0
};

module.exports.csConfig = {
    CS_URL_PORT: process.env.CS_URL_PORT,
    CS_URL_PATH: process.env.CS_URL_PATH,
};

module.exports.loggerLevel = process.env.LOGGER_LEVEL || 'error';

module.exports.appConfig = {
    ACTIVE_CUSTOMER_PAYMENT_ALLOWED: process.env.ACTIVE_CUSTOMER_PAYPAYMENT || true,
    INACTIVE_CUSTOMER_PAYMENT_ALLOWED: process.env.INACTIVE_CUSTOMER_PAYPAYMENT || false
};
