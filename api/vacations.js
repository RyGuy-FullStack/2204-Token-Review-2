import express from 'express';
const router = express.Router();
import {Vacation} from '../db/models/index.js';

//These routes are mounted on /api/vacations

// this route gets all orders. It's accessible to only ADMIN users.
router.get('/', async (req, res, next) => {
  try {
    const vacations = await Vacation.findAll();
    res.send(vacations);
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
      res.send(newVacation);
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
        res.send(newVacation);
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



export default router;
