/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Возвращает статус абонента
*
* msisdn String  (optional)
* returns StatusResponse
* */
const checkGET = ({ msisdn }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        msisdn,
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
  checkGET,
};
