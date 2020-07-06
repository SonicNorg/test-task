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

async function create(payment) {
    const newPayment = Object.assign({}, payment);

    newPayment.PAYMENT_ID = {
        dir: oracledb.BIND_OUT,
        type: oracledb.RAW
    };

    const result = await database.execute(insertPaymentQuery, newPayment);
    console.log(JSON.stringify(result))

    return result.outBinds.PAYMENT_ID[0];
}

module.exports.create = create;

const updateSql =
    `update employees
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where employee_id = :employee_id`;

async function update(emp) {
    const employee = Object.assign({}, emp);
    const result = await database.execute(updateSql, employee);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return employee;
    } else {
        return null;
    }
}

module.exports.update = update;
