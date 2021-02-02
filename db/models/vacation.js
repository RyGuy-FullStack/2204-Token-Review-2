const Sequelize = require('sequelize')
const db = require('../db')

const Vacation = db.define('vacation', {
  location: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
})



module.exports = Vacation

