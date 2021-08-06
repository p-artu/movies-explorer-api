const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');
const { EMAIL_OR_PASSWORD_ERR, EMAIL_VALID_ERR } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: EMAIL_VALID_ERR,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
},
{
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(EMAIL_OR_PASSWORD_ERR));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(EMAIL_OR_PASSWORD_ERR));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
