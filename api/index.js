import express from 'express';
const router = express.Router();

import vacations from './vacations.js';
router.use('/vacations', vacations);

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404
  next(error)
});

export default router;
