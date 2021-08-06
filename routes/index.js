const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const { NOT_FOUND_ERR, CRASH_TEST_ERR } = require('../utils/constants');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(CRASH_TEST_ERR);
  }, 0);
});
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.use(auth);

router.use('/', require('./movies'));
router.use('/', require('./users'));

router.use('*', () => {
  throw new NotFoundError(NOT_FOUND_ERR);
});

module.exports = router;
