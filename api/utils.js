const {Vacation, Guest, Cohort} = require('../db/models/index.js');
const seed = require('../db/seed.js');

function requireGuest(req, res, next) {
  if (!req.guest) {
    res.status(401);
    next({
      name: "MissingGuestError",
      message: "You must be logged in to perform this action"
    });
  }

  next();
}

// takes required parameters as an array, returns a middleware function that sends back a message if they're not present
const requiredNotSent = ({ requiredParams, atLeastOne = false }) => {
  return (req, res, next) => {
    // for operations that need at least one param. Not all required.
    if(atLeastOne) {
      let numParamsFound = 0;
      for(let param of requiredParams) {
        if(req.body[param] !== undefined) {
          numParamsFound++;
        }
      }
      if(!numParamsFound) {
        next({
          name: 'MissingParams',
          message: `Must provide at least one of these in body: ${requiredParams.join(', ')}`
        })
      } else {
        next();
      }
    } else {
      // figure out which ones are not defined, and return them
      const notSent = [];
      for(let param of requiredParams) {
        if(req.body[param] === undefined) {
          notSent.push(param);
        }
      }
      if(notSent.length) next({
        name: 'MissingParams',
        message: `Required Parameters not sent in body: ${notSent.join(', ')}`
      })
      next();
    }
  }
}

const setOrCreateCohort = async (req, _, next) => {
  const { cohortId } = req.params

  const cohortIdStr = cohortId.toLowerCase()

  try {
    let cohort = await Cohort.findOne({where: { name: cohortIdStr }});

    if (!cohort) {
      const cohort = await seed(cohortIdStr);
      console.log('?????????? cohort: ', cohort);
      console.log('cohort.id: ', cohort.id);
    }

    req.cohort = cohort

    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

module.exports = {
  requireGuest,
  requiredNotSent,
  setOrCreateCohort,
}