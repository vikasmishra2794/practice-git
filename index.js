const dotenv = require('dotenv');

dotenv.config();

const config = {
  MICROSERVICE_IP: process.env.MICROSERVICE_IP || 'localhost',
  APP_HOST: process.env.APP_HOST || 'localhost',
  APP_PORT: process.env.APP_PORT || '4005',
  SWAGGER_HOST: process.env.SWAGGER_HOST || 'localhost',
  SWAGGER_PORT: process.env.SWAGGER_PORT || '3005',
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'root',
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME || 'unique_code_templates',
};

module.exports = config;