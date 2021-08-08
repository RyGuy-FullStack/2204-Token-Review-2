const Cohort = require('./cohort.js');
const Guest = require('./guest.js');
const Vacation = require('./vacation.js');

Guest.belongsTo(Cohort);
Cohort.hasMany(Guest);

Vacation.belongsTo(Cohort);
Cohort.hasMany(Vacation);

Vacation.belongsTo(Guest);
Guest.hasMany(Vacation);

module.exports = {
  Cohort,
  Guest,
  Vacation,
}

