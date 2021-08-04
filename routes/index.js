const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
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
  throw new NotFoundError('Ресурс не найден');
});

module.exports = router;
