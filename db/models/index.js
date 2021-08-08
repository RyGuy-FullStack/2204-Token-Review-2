const Cohort = require('./cohort.js');
const Comment = require('./comment.js');
const Guest = require('./guest.js');
const Vacation = require('./vacation.js');

Guest.belongsTo(Cohort);
Cohort.hasMany(Guest);

Vacation.belongsTo(Cohort);
Cohort.hasMany(Vacation);

Comment.belongsTo(Cohort);
Cohort.hasMany(Comment);

Vacation.belongsTo(Guest);
Guest.hasMany(Vacation);

Comment.belongsTo(Vacation);
Vacation.hasMany(Comment);

Comment.belongsTo(Guest);
Guest.hasMany(Comment);

module.exports = {
  Cohort,
  Comment,
  Guest,
  Vacation,
}
