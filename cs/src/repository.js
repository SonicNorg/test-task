const database = require('./services/database');
const logger = require('./logger');

const selectCustomerQuery =
    `select PERSONAL_ACCOUNT_ID, ACTIVE from CUSTOMER WHERE MSISDN = :msisdn`;

async function getCustomer(msisdn) {
    logger.info(`Getting customer by msisdn: ${msisdn}`)
    const result = await database.execute(selectCustomerQuery, {msisdn: parseInt(msisdn)});

    logger.debug(`Customer: ${JSON.stringify(result)}`);
    if (Array.isArray(result.rows) && result.rows.length) {
        return result.rows[0];
    } else {
        return null;
    }
}

module.exports.getCustomer = getCustomer;
