const Sequelize = require('sequelize');
const db = require('../db.js');
const bcrypt = require('bcrypt');
const { SALT_COUNT = 10 } = process.env;


const Guest = db.define('guest', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
  },
},
{
  hooks: {
    beforeCreate: async guest => {
      guest.password = await bcrypt.hash(guest.password, SALT_COUNT);;
    }
  }
})

Guest.login = async function (username, password) {
  const guest = await this.findOne({
    where: {username}
  });
  if (!guest) return;
  const passwordsMatch = await bcrypt.compare(password, guest.password);
  if (passwordsMatch) {
    guest.password = undefined;
    return guest;
  }
}


module.exports = Guest;
