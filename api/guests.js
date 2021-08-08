const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Guest, Vacation, Comment } = require('../db/models');
const { requireGuest } = require('./utils');
const { JWT_SECRET = 'neverTell' } = process.env;

// POST /api/guests/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const guest = await Guest.findOne({
      attributes: { exclude: ['password'] },
      where: {username, password}
    });
    
    if(!guest) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: guest.id, username: guest.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({
        success: true,
        error: null,
        data: { guest, message: "you're logged in!", token },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/guests/login
router.get("/me", requireGuest, async (req, res) => {
  const guest = await Guest.findByPk(req.guest.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: Vacation,
      include: [{
        model: Comment
      }]
    }]
  });
  res.send({
    success: true,
    error: null,
    data: {
      guest,
    },
  });
});

module.exports = router;
