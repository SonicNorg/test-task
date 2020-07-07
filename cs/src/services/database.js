const oracledb = require('oracledb');
const dbConfig = require('../config').dbConfig;
const logger = require('../logger');

async function initialize() {
    logger.info("Database config: ", Object.assign({}, dbConfig, {password: "********"}))
    const pool = await oracledb.createPool(dbConfig);
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;

function execute(statement, binds = [], opts = {}) {
    logger.debug("Executing query with params", binds, statement)
    return new Promise(async (resolve, reject) => {
        let conn;

        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;

        try {
            conn = await oracledb.getConnection();
            const result = await conn.execute(statement, binds, opts);
            resolve(result);
        } catch (err) {
            logger.error("Database error", err)
            reject(err);
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                } catch (err) {
                    logger.error(err);
                }
            }
        }
    });
}

module.exports.execute = execute;
