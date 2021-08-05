require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const err = require('./middlewares/err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  corsOptionsDelegate,
  limiter,
  MONGO_ADDRESS,
  PORT_NUMBER,
} = require('./utils/constants');

const { PORT = PORT_NUMBER, DATABASE = MONGO_ADDRESS } = process.env;
const app = express();

app.use(cors(corsOptionsDelegate));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(limiter);
app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(err);

app.listen(PORT);
