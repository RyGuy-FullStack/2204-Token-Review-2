const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Guest, Vacation } = require('../db/models');
const { requireUser } = require('./utils');
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
    const user = await Guest.findOne({
      attributes: { exclude: ['password'] },
      where: {username, password}
    });
    
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({
        success: true,
        error: null,
        data: { user, message: "you're logged in!", token },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/guests/login
router.get("/me", requireUser, async (req, res) => {
  const user = await Guest.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [{model: Vacation}]
  });
  res.send({
    success: true,
    error: null,
    data: {
      user,
    },
  });
});

module.exports = router;
