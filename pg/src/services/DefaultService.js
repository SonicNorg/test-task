/* eslint-disable no-unused-vars */
const Service = require('./Service');
const Repository = require('../repository');
const config = require('../config');
const request = require('request-promise');
const logger = require('../logger');

/**
 * Запрос на проведение платежа
 *
 * paymentRequest PaymentRequest
 * returns SuccessResponse
 * */
class DefaultService {

    static paymentPOST(paymentRequest) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const response = await DefaultService.insertPayment(paymentRequest.body);

                    resolve(Service.successResponse({
                        ...response,
                    }));
                } catch (e) {
                    reject(Service.rejectResponse(
                        e,
                        e.status || 405,
                    ));
                }
            },
        );
    }

    static async insertPayment(paymentRequest) {
        let customer = null;
        const message = `No customer found with msisdn ${paymentRequest.msisdn}`;
        try {
            customer = await DefaultService.checkStatus(paymentRequest.msisdn);
            logger.debug("Customer status:", customer);
        } catch (e) {
            logger.error(message, e);
            if (e.statusCode == 400) {
                throw {
                    status: 400, message: message
                };
            } else {
                throw {
                    status: 500,
                    error: {
                        code: 1,
                        message: "Unknown error in CS call"
                    }
                };
            }
        }
        logger.debug(`By msisdn ${paymentRequest.msisdn} found customer: ${JSON.stringify(customer)}`)
        if ((customer.status && config.appConfig.ACTIVE_CUSTOMER_PAYMENT_ALLOWED)
            || (!customer.status && config.appConfig.INACTIVE_CUSTOMER_PAYMENT_ALLOWED)) {
            const payment = {
                payment_date: paymentRequest.date,
                transaction_amount: parseFloat(paymentRequest.sum) * 100,
                external_operation_id: paymentRequest.operation,
                personal_account_id: customer.account,
                success: 1
            };
            try {
                const paymentId = await Repository.createPayment(payment);
                const balance = await Repository.getBalance(customer.account);
                return {operation: paymentId, balance: balance / 100}
            } catch (e) {
                throw {
                    status: 500,
                    error: {
                        code: 10,
                        message: `Unknown error: ${e.message}`
                    }
                };
            }
        } else {
            throw {
                status: 500,
                error: {
                    code: 2,
                    message: `Customer is ${customer.status ? "ACTIVE" : "INACTIVE"}, payment NOT allowed`
                }
            };
        }
    }

    static async checkStatus(msisdn) {
        logger.info(`Checking Status for msisdn = ${msisdn}`);
        const options = {
            method: 'GET',
            uri: `${config.csConfig.CS_URL_PATH}:${config.csConfig.CS_URL_PORT}/check`,
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

module.exports = DefaultService
