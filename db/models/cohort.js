const Sequelize = require('sequelize');
const db = require('../db.js');

const Cohort = db.define('cohort', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
},
{
  hooks: {
    beforeCreate: cohort => {
      cohort.name = cohort.name.toLowerCase();
    }
  }
});

module.exports = Cohort;
