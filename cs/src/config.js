const path = require('path');
const envConfig = require('./config/index');

const config = {
    ROOT_DIR: __dirname,
    URL_PORT: 3000,
    URL_PATH: 'http://localhost',
    CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
    PROJECT_DIR: __dirname,
};
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml');

module.exports = config;

//Dynamic Configuration
module.exports.dbConfig = envConfig.dbConfig;
module.exports.loggerLevel = envConfig.loggerLevel;
