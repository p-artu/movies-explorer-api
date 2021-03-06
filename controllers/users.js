const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const MongoError = require('../errors/mongo-err');
const {
  INCORRECT_ERR, USER_NOT_FOUND_ERR, EMAIL_BUSY_ERR, SECRET_KEY,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET = SECRET_KEY } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(USER_NOT_FOUND_ERR);
      } else if (err.name === 'CastError') {
        throw new BadRequestError(INCORRECT_ERR);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(USER_NOT_FOUND_ERR);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(INCORRECT_ERR);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new MongoError(EMAIL_BUSY_ERR);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(INCORRECT_ERR);
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new MongoError(EMAIL_BUSY_ERR);
      }
    })
    .catch(next);
};
