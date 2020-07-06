/* eslint-disable no-unused-vars */
const Service = require('./Service');
const Repository = require('../repository');
const configCS = require('../config').configCS;
const request = require('request-promise');

/**
 * Запрос на проведение платежа
 *
 * paymentRequest PaymentRequest
 * returns SuccessResponse
 * */
const paymentPOST = (paymentRequest) => new Promise(
    async (resolve, reject) => {
        try {
            const response = await insertPayment(paymentRequest.body);

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

module.exports = {
    paymentPOST,
};

async function insertPayment(paymentRequest) {
    const customer = await checkStatus(paymentRequest.msisdn);
    console.debug("Customer found: " + JSON.stringify(customer))
    //TODO if (!customer.active) && В КОНФИГЕ РАЗРЕШЕНО ДЛЯ НЕАКТИВНЫХ ИЛИ активный и РАЗРЕШЕНО ДЛЯ АКТИВНЫХ тогда
    const payment = {
        payment_date: paymentRequest.date,
        transaction_amount: parseFloat(paymentRequest.sum) * 100,
        external_operation_id: paymentRequest.operation,
        personal_account_id: customer.account,
        success: 1
    };
    console.log(payment);
    const paymentId = await Repository.createPayment(payment);
    const balance = await Repository.getBalance(customer.account);
    return {operation: paymentId, balance: balance / 100}
}

async function checkStatus(msisdn) {
    console.info(`CHECKING STATUS for msisdn = ${msisdn}`)
    const options = {
        method: 'GET',
        uri: `${configCS.URL_PATH}:${configCS.URL_PORT}/check`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        qs: {
            msisdn: msisdn
        },
        json: true
    };
console.log(JSON.stringify(options));
    const req = await request(options)
        .then(data => {
            return data;
        });
    console.log("REQ = " + req)
    return Promise.resolve(req);
}
