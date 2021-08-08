const express = require('express');
const router = express.Router();
const {Vacation, Guest, Comment} = require('../db/models/index.js');

//These routes are mounted on /api/vacations

// this route gets all vacations. It's accessible to only ADMIN guests.
router.get('/', async (req, res, next) => {
  try {
    const vacations = await Vacation.findAll({
      include: [
        {model: Guest, attributes: { exclude: ['password'] }},
        {model: Comment},
      ]
    });
    if (req.guest) {
      console.log('>>>>>>>>> req.guest', req.guest);
      vacations.forEach((vacation) => {
        vacation.dataValues.isCreator = vacation.dataValues.guest.id === Number(req.guest.id);
        vacation.dataValues.comments = vacation.dataValues.isCreator ? vacation.dataValues.comments : [];
      });
    } else {
      // a guest not logged in shouldn't see comments
      vacations.forEach((vacation) => {
        console.log('vacation: ', vacation);
        
        vacation.dataValues.isCreator = false;
        vacation.dataValues.comments = [];
      });
    }
    res.send({
      success: true,
      error: null,
      data: { vacations },
    });
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {location, description} = req.body;
    const newVacation = await Vacation.create({
      location,
      description
    });

    if(newVacation) {
      res.send({
        success: true,
        error: null,
        data: { vacation: newVacation },
      });
    } else {
      next(`Could not create vacation from location ${location} and description ${description}`);
    }
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const {location, description} = req.body;
    const prevVacation = await Vacation.findByPk(id);
    if(prevVacation) {
      const newVacation = await prevVacation.update({
        location,
        description
      });
  
      if(newVacation) {
        res.send({
          success: true,
          error: null,
          data: { vacation: newVacation },
        });
      } else {
        next(`Could not create vacation from location ${location} and description ${description}`);
      }
    } else{
      next(`could not find vacation id: ${id}`)
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router;
