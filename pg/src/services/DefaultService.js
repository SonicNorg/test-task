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
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAA')
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
    const customerId = await checkStatus(paymentRequest.msisdn);

    const payment = {
        payment_date: paymentRequest.date,
        transaction_amount: parseFloat(paymentRequest.sum) * 100,
        external_operation_id: paymentRequest.operation,
        personal_account_id: customerId,
        success: 1
    };
    console.log(payment);
    const paymentId = await Repository.createPayment(payment);
    const balance = await Repository.getBalance(customerId);
    return {operation: paymentId, balance: balance / 100}
}

function checkStatus(msisdn) {
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
    let status = request(options)
        .then(data => {
            console.log(JSON.stringify(data));
            status = data;
        });
    console.log(JSON.stringify(status));
    return status;
}
