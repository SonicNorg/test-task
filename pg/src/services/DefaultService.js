/* eslint-disable no-unused-vars */
const Service = require('./Service');
const Repository = require('../repository');

/**
 * Запрос на проведение платежа
 *
 * paymentRequest PaymentRequest
 * returns SuccessResponse
 * */
const paymentPOST = (paymentRequest) => new Promise(
    async (resolve, reject) => {
        try {
            const response = await insertPayment(paymentRequest.body)

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
    const customerId = 1; //TODO service CS /check
    const payment = {
        payment_date: paymentRequest.date,
        transaction_amount: paymentRequest.sum,
        external_operation_id: paymentRequest.operation,
        personal_account_id: customerId,
        success: 1
    };
    console.log(payment)
    const paymentId = await Repository.create(payment);
    //TODO const balance = Repository.getBalance
    return {operation: paymentId, balance: -1}
}