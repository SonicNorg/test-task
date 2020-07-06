/* eslint-disable no-unused-vars */
const Service = require('./Service');
const Repository = require('../repository');

/**
 * Возвращает статус абонента
 *
 * msisdn String  (optional)
 * returns StatusResponse
 * */
const checkGET = (msisdn) => new Promise(
    async (resolve, reject) => {
        try {
            console.log(`MSISDN: ${JSON.stringify(msisdn)}`)
            const customer = await Repository.getCustomer(msisdn.msisdn);
            resolve(Service.successResponse({
                ...{account: customer.PERSONAL_ACCOUNT_ID, status: customer.ACTIVE !== 0},
            }));
        } catch (e) {
            console.error(e)
            reject(Service.rejectResponse(
                e.message || 'Invalid input',
                e.status || 405,
            ));
        }
    },
);

module.exports = {
    checkGET,
};
