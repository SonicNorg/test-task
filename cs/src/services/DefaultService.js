const Service = require('./Service');
const Repository = require('../repository');
const logger = require('../logger');

/**
 * Возвращает статус абонента
 *
 * msisdn String  (optional)
 * returns StatusResponse
 * */
const checkGET = (msisdn) => new Promise(
    async (resolve, reject) => {
        try {
            let customer = null;
            try {
                customer = await Repository.getCustomer(msisdn.msisdn);
            } catch (e) {
                throw {message: `Error while get customer by msisdn ${msisdn.msisdn}! ${e}`, status: 500};
            }
            if (customer == null) {
                throw {message: `Customer with msisdn ${msisdn.msisdn} not found!`, status: 400};
            }
            resolve(Service.successResponse({
                ...{account: customer.PERSONAL_ACCOUNT_ID, status: customer.ACTIVE !== 0},
            }));
        } catch (e) {
            logger.error(e);
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
