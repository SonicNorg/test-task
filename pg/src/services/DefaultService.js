/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Запрос на проведение платежа
*
* paymentRequest PaymentRequest 
* returns SuccessResponse
* */
const paymentPOST = ({ paymentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        paymentRequest,
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
