module.exports.dbConfig = {
    user: process.env.ORACLEDB_USER || '',
    password: process.env.ORACLEDB_PASSWORD || '',
    connectString: process.env.ORACLEDB_CONNECTIONSTRING || '',
    poolMin: process.env.ORACLEDB_POOL_MIN || 10,
    poolMax: process.env.ORACLEDB_POOL_MAX || 10,
    poolIncrement: process.env.ORACLEDB_POOL_INCREMENT || 0
};

module.exports.loggerLevel = process.env.LOGGER_LEVEL || 'error';

