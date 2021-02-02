const path = require('path')
require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());

app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', require('./api'));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const {PORT = 4000} = process.env;

app.listen(PORT, () => {
  db.sync({force: false});
  console.log(`Listening for vacations on ${chalk.green(`http://localhost:${PORT}`)}`);
})