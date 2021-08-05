const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { NOT_AUTHORIZED_ERR, SECRET_KEY } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET = SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(NOT_AUTHORIZED_ERR);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError(NOT_AUTHORIZED_ERR);
  }
  req.user = payload;
  next();
};
