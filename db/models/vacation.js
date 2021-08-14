const Sequelize = require('sequelize');
const db = require('../db.js');

const Vacation = db.define('vacation', {
  location: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
})



module.exports = Vacation;
