const Sequelize = require('sequelize');
const db = require('../db.js');

const Guest = db.define('guest', {
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
})



module.exports = Guest;
