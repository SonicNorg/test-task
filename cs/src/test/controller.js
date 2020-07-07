process.env.NODE_ENV = 'test';

const config = require('../config');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../expressServer');
const database = require('../services/database');
const launched = new server(config.URL_PORT, config.OPENAPI_YAML);
chai.use(chaiHttp);
chai.should()

describe('/check', () => {
    const clearBalance = "UPDATE BALANCE SET BALANCE=0";
    const createCustomer = "INSERT INTO CUSTOMER (MSISDN, ACTIVE) VALUES('3809180001122', 1)";
    before(async () => {
        await database.initialize().then(() => launched.launch()).then(() => database.execute(createCustomer)).catch((e) => console.log("Test initialization error. Let's see if tests will fail. ", e));
    });
    after(async () => await launched.close().then(() => database.close()));

    it('Should return 400 if customer not found', (done) => {
        let agent = chai.request(launched.app);
        agent
            .get('/check?msisdn=3800000000001')
            .end((err, res) => {
                res.should.have.status(400);
                res.error.text.should.eq('Customer with msisdn 3800000000001 not found!');
                done();
            });
    });

    it('Should return 200 with customer', (done) => {
        let agent = chai.request(launched.app);
        agent
            .get('/check?msisdn=3809180001122')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});
