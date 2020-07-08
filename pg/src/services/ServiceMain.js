const Service = require('./Service');
const Repository = require('../repository');
const csConfig = require('../config').csConfig;
const request = require('request-promise');
const logger = require('../logger');

class ServiceMain {
    paymentPOST = (paymentRequest) => new Promise(
        async (resolve, reject) => {
            try {
                const response = await this.insertPayment(paymentRequest.body);

                resolve(Service.successResponse({
                    ...response,
                }));
            } catch (e) {
                reject(Service.rejectResponse(
                    e.message || 'Invalid input',
                    e.status || 405,
                ));
            }
        },
    );

    async insertPayment(paymentRequest) {
        const customer = await this.checkStatus(paymentRequest.msisdn);
        logger.debug(`By msisdn ${paymentRequest.msisdn} found customer: ${JSON.stringify(customer)}`)
        //TODO if (!customer.active) && В КОНФИГЕ РАЗРЕШЕНО ДЛЯ НЕАКТИВНЫХ ИЛИ активный и РАЗРЕШЕНО ДЛЯ АКТИВНЫХ тогда
        const payment = {
            payment_date: paymentRequest.date,
            transaction_amount: parseFloat(paymentRequest.sum) * 100,
            external_operation_id: paymentRequest.operation,
            personal_account_id: customer.account,
            success: 1
        };
        const paymentId = await Repository.createPayment(payment);
        const balance = await Repository.getBalance(customer.account);
        return {operation: paymentId, balance: balance / 100}
    }

    async checkStatus(msisdn) {
        logger.info(`Checking Status for msisdn = ${msisdn}`);
        const options = {
            method: 'GET',
            uri: `${csConfig.CS_URL_PATH}:${csConfig.CS_URL_PORT}/check`,
            headers: {
                'User-Agent': 'Request-Promise',
            },
            qs: {msisdn},
            json: true
        };
        logger.debug(`Sending CS request: ${JSON.stringify(options)}`);
        try {
            const response = await request(options);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    }

}

const serviceMain = new ServiceMain();
module.exports = serviceMain;
