const Sequelize = require('sequelize');

const {DATABASE_NAME = 'adventure-away'} = process.env;
const {DATABASE_URL = `postgres://localhost:5432/${DATABASE_NAME}`} = process.env;

const env = process.env.NODE_ENV || 'development';
const dialectOptions = env === 'production' 
  ? {
    ssl: {
      rejectUnauthorized: false
    }
  }
  : {};
  
const db = new Sequelize(DATABASE_URL,
  {
    logging: false,
    dialectOptions
  }
)

module.exports = db;
