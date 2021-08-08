const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'neverTell'} = process.env;
const db = require('../db');
const { Vacation, Guest } = require('../db/models/index.js');

// GET /api/health
router.get('/health', async (req, res, next) => {
  try {
    const uptime = parseFloat(process.uptime() / 60).toFixed(2);
    const [[{now}]] = await db.query('SELECT NOW();');
    const currentTime = new Date();
    const lastRestart = new Intl.DateTimeFormat('en', {timeStyle: 'long', dateStyle: 'long', timeZone: "America/Los_Angeles"}).format(currentTime - (uptime * 1000));
    res.send({message: 'healthy', uptime: `${uptime} minutes`, now, currentTime, lastRestart});
  } catch (err) {
    next(err);
  }
});

// set `req.guest` if possible
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  
  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    
    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      
      const id = parsedToken && parsedToken.id
      if (id) {
        req.guest = await Guest.findByPk(id, {
          attributes: { exclude: ['password'] },
          raw: true,
        });
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

router.use((req, res, next) => {
  if (req.guest) {
    console.log("Guest is set:", req.guest);
  }
  next();
});

router.use('/guests', require('./guests'));
router.use('/vacations', require('./vacations'));

router.use((req, res) => {
  res.send({
    success: false,
    error: {
      name: 'UndefinedRoute',
      message: 'that route does not exist',
    },
    data: null
  });
});

module.exports = router;