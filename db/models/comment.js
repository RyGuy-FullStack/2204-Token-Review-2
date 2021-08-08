const Sequelize = require('sequelize');
const db = require('../db.js');

const Comment = db.define('comment', {
  content: {
    type: Sequelize.STRING,
  }
})

module.exports = Comment;
