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
