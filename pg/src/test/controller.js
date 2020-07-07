process.env.NODE_ENV = 'test';

const config = require('../config');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../expressServer');
const database = require('../services/database');
const launched = new server(config.URL_PORT, config.OPENAPI_YAML);
const sinon = require('sinon');
const pgService = require('../services/DefaultService');

chai.use(chaiHttp);
chai.should()

describe('/payment', () => {
    const initialBalance = "UPDATE BALANCE SET BALANCE=10000";
    const createCustomer = "INSERT INTO CUSTOMER (MSISDN, ACTIVE) VALUES('3809180001122', 1)";
    before(async () => {
        await database.initialize().then(() => launched.launch()).then(() => database.execute(createCustomer)).catch((e) => console.log("Test initialization error. Let's see if tests will fail. ", e));
        await database.execute(initialBalance);
    });
    after(async () => await launched.close().then(() => database.close()));
    afterEach(() => sinon.restore());

    it('Should return 400 if customer not found', (done) => {
        const agent = chai.request(launched.app);
        const pay = {
            msisdn: 79130135022,
            date: "2020-12-31T23:59:59Z",
            sum: 450.12,
            operation: 2
        }
        agent
            .post('/payment')
            .send(pay)
            .end((err, res) => {
                res.should.have.status(400);
                res.error.text.should.eq('No customer found with msisdn 79130135022');
                done();
            });
    });

    it('Should return 200 with customer', (done) => {
        const agent = chai.request(launched.app);
        sinon.stub(pgService, 'yourClassMethod').callsFake(() => {
            return {
                account: getCustomerAccountId(3809180001122),
                status: true
            }
        })
        const pay = {
            msisdn: 3809180001122,
            date: "2020-12-31T23:59:59Z",
            sum: 450.12,
            operation: 2
        }
        agent
            .post('/payment')
            .send(pay)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('balance').eql('550.12')
                done();
            });
    });

});

const selectCustomerQuery =
    `select PERSONAL_ACCOUNT_ID from CUSTOMER WHERE MSISDN = :msisdn`;

function getCustomerAccountId(msisdn) {
    const result = Promise.resolve(database.execute(selectCustomerQuery, {msisdn: parseInt(msisdn)}));

    if (Array.isArray(result.rows) && result.rows.length) {
        return result.rows[0].PERSONAL_ACCOUNT_ID;
    } else {
        return null;
    }
}
