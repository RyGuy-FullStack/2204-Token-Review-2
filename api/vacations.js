const express = require('express');
const router = express.Router();
const {Vacation, Guest, Comment} = require('../db/models/index.js');
const { requireGuest } = require('./utils.js');

//These routes are mounted on /api/vacations

// this route gets all vacations. It's accessible to all guests, but only adds comments to/from the guest that is logged in.
// GET /api/<cohort-name>/vacations
router.get('/', async (req, res, next) => {
  try {
    const vacations = await Vacation.findAll({
      where: {
        cohortId: req.cohort.id
      },
      include: [
        {
          model: Guest,
          attributes: { exclude: ['password'] }
        },
        {
          model: Comment,
          include: [{
            model: Guest
          }]
        },
      ]
    });
    if (req.guest) {
      vacations.forEach((vacation) => {
        vacation.dataValues.isCreator = vacation.dataValues.guest.id === Number(req.guest.id);
        vacation.dataValues.comments = vacation.dataValues.isCreator ? vacation.dataValues.comments : [];
      });
    } else {
      // a guest not logged in shouldn't see comments
      vacations.forEach((vacation) => {
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

// POST /api/<cohort-name>/vacations
router.post('/', requireGuest, async (req, res, next) => {
  try {
    const {location, description} = req.body;
    const newVacation = await Vacation.create({
      location,
      description,
      cohortId: req.cohort.id,
      guestId: req.guest.id
    });

    if(newVacation) {
      res.send({
        success: true,
        error: null,
        data: { vacation: newVacation },
      });
    } else {
      next({
        name: "FailedToCreate",
        message: `Could not create vacation from location ${location} and description ${description}`
      });
    }
  } catch (err) {
    next(err)
  }
})

// PATCH /api/<cohort-name>/vacations/<vacation-id>
router.patch('/:id', requireGuest, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {location, description} = req.body;
    const prevVacation = await Vacation.findByPk(id);
    if(prevVacation) {
      if(prevVacation.guestId !== req.guest.id) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: "You must be the same user who created this vacation to perform this action"
        });
      } else {
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
          next({
            name: "FailedToEdit",
            message: `Could not edit vacation from location ${location} and description ${description}`
          });
        }
      }
    } else{
      next({
        name: "NotFound",
        message: `could not find vacation id: ${id}`
      });
    }
  } catch (err) {
    next(err)
  }
})

// DELETE /api/<cohort-name>/vacations/<vacation-id>
router.delete('/:id', requireGuest, async (req, res, next) => {
  try {
    const {id} = req.params;
    const prevVacation = await Vacation.findByPk(id);
    if(prevVacation) {
      if(prevVacation.guestId !== req.guest.id) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: "You must be the same user who created this vacation to perform this action"
        });
      } else {
        const success = await prevVacation.destroy({returning: true});
        console.log('success: ', success);
        if(success) {
          res.send({
            success: true,
            error: null,
            data: { deletedVacation },
          });
        } else {
          next({
            name: "FailedToDelete",
            message: "Could not delete this vacation"
          });
        }
      }
    } else{
      next({
        name: "NotFound",
        message: `could not find vacation id: ${id}`
      });
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/<cohort-name>/vacations/<vacation-id>/comments
router.post('/:id/comments', requireGuest, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {content} = req.body;
    const prevVacation = await Vacation.findByPk(id);
    if(prevVacation) {
      if(prevVacation.guestId !== req.guest.id) {
        res.status(403);
        next({
          name: "UnauthorizedError",
          message: "You must be the same user who created this vacation to perform this action"
        });
      } else {
        const newComment = await Comment.create({
          content,
          cohortId: req.cohort.id,
          vacationId: id,
          guestId: req.guest.id
        });
        if(newComment) {
          res.send({
            success: true,
            error: null,
            data: { comment: newComment },
          });
        } else {
          next({
            name: "FailedToCreate",
            message: `Could not create comment from content ${content}`
          });
        }
      }
    } else{
      next({
        name: "NotFound",
        message: `could not find vacation id: ${id}`
      });
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router;
