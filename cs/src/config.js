const path = require('path');

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 3001,
  URL_PATH: 'http://localhost',
  BASE_VERSION: 'v2',
  CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
  PROJECT_DIR: __dirname,
};
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml');
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`;
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded_files');

module.exports = config;

module.exports.dbConfig = {
  user: process.env.HR_USER || 'CS_TEST',
  password: process.env.HR_PASSWORD || '1qaz2wsx',
  connectString: process.env.HR_CONNECTIONSTRING || 'pttb.ru:1521/osadb.oracle.com',
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0
};
