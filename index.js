import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import cors from 'cors';
import db from './db/index.js';

const app = express();

app.use(cors());

app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

import api from './api/index.js';
app.use('/api', api);

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
})

// error handling endware
app.use((err, req, res) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const {PORT = 4000} = process.env;

app.listen(PORT, () => {
  db.sync({force: false});
  console.log(`Listening for vacations on ${chalk.green(`http://localhost:${PORT}`)}`);
})