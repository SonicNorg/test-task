/* eslint-disable no-unused-vars */
const Service = require('./Service');
const Repository = require('../repository');
const csConfig = require('../config').csConfig;
const request = require('request-promise');
const logger = require('../logger');

/**
 * Запрос на проведение платежа
 *
 * paymentRequest PaymentRequest
 * returns SuccessResponse
 * */
class DefaultService {

    constructor() {
        console.log("THIS: constructor SUKA", this);
        this._this = "dsfgkjhasd";
    }
    paymentPOST(paymentRequest) {
        console.log("THIS: EBANA", this._this)
        return new Promise(
            async (resolve, reject) => {
                try {
                    const response = await _this.insertPayment(paymentRequest.body);

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
    }

    async insertPayment(paymentRequest) {
        let customer = null;
        try {
            customer = await this.checkStatus(paymentRequest.msisdn);
        } catch (e) {
            //do nothing: customer is already null
        }
        logger.debug(`By msisdn ${paymentRequest.msisdn} found customer: ${JSON.stringify(customer)}`)
        if (customer == null) {
            const message = `No customer found with msisdn ${paymentRequest.msisdn}`;
            logger.error(message);
            throw {status: 400, message: message};
        }
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

const _defaultService = new DefaultService()
module.exports = _defaultService
