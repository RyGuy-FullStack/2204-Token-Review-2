import Sequelize from 'sequelize';
import db from '../db.js';

const Vacation = db.define('vacation', {
  location: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
})



export default Vacation;
