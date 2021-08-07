const Guest = require('./guest.js');
const Vacation = require('./vacation.js');

Vacation.belongsTo(Guest);
Guest.hasMany(Vacation);

module.exports = {
  Guest,
  Vacation,
}

