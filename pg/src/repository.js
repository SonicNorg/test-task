const oracledb = require('oracledb');
const database = require('./services/database');

const selectPaymentsQuery =
    `select * from PAYMENT`;

const insertPaymentQuery =
    `INSERT INTO PAYMENT (
    PAYMENT_DATE,
    EXTERNAL_OPERATION_ID,
    PERSONAL_ACCOUNT_ID,
    TRANSACTION_AMOUNT,
    SUCCESS
  ) values (
    TO_TIMESTAMP_TZ(:payment_date, 'YYYY-MM-DD"T"HH24:MI:SSTZH:TZM'),
    :external_operation_id,
    :personal_account_id,
    :transaction_amount,
    :success
  ) returning PAYMENT_ID
  INTO :payment_id`;

async function createPayment(payment) {
    const newPayment = Object.assign({}, payment);

    newPayment.PAYMENT_ID = {
        dir: oracledb.BIND_OUT,
        type: oracledb.RAW
    };

    const result = await database.execute(insertPaymentQuery, newPayment);
    console.log(JSON.stringify(result))

    return result.outBinds.PAYMENT_ID[0];
}

module.exports.createPayment = createPayment;

const selectBalanceQuery =
    `SELECT BALANCE FROM BALANCE
    where PERSONAL_ACCOUNT_ID = :personal_account_id`;

async function getBalance(personal_account_id) {
    const filter = {personal_account_id: personal_account_id};
    const result = await database.execute(selectBalanceQuery, filter);

    console.log(`BALANCE: ${JSON.stringify(result)}`);
    if (result.rows) {
        return parseInt(result.rows[0].BALANCE);
    } else {
        return null;
    }
}

module.exports.getBalance = getBalance;
