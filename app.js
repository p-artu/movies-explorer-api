require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const err = require('./middlewares/err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});
const allowlist = [
  'http://localhost:3000',
];
function corsOptionsDelegate(req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: true };
  }
  callback(null, corsOptions);
}

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors(corsOptionsDelegate));
app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(2),
//   }),
// }), login);
// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(2),
//     name: Joi.string().required().min(2).max(30),
//   }),
// }), createUser);

// app.use(auth);

// app.use('/', require('./routes/movies'));
// app.use('/', require('./routes/users'));

// app.use('*', () => {
//   throw new NotFoundError('Ресурс не найден');
// });

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(err);

app.listen(PORT);
