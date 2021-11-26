const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});
const allowlist = [
  'https://p-artu.movies-explorer.nomoredomains.club',
  'http://p-artu.movies-explorer.nomoredomains.club',
  'http://localhost:3000',
  'http://gar.oirc40.ru',
];
function corsOptionsDelegate(req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}
const MONGO_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb';
const PORT_NUMBER = 3000;
const SECRET_KEY = 'super-strong-secret';
const DEFAULT_ERR = 'На сервере произошла ошибка';
const NOT_FOUND_ERR = 'Ресурс не найден';
const CRASH_TEST_ERR = 'Сервер сейчас упадёт';
const EMAIL_OR_PASSWORD_ERR = 'Неправильные почта или пароль';
const EMAIL_VALID_ERR = 'Неправильный формат почты';
const URL_VALID_ERR = 'Неправильный формат ссылки';
const INCORRECT_ERR = 'Указаны некоректные данные';
const FORBIDDEN_DELETE_ERR = 'Вы не можете удалить чужой фильм';
const FILM_NOT_FOUND_ERR = 'Фильм не найден';
const EMAIL_BUSY_ERR = 'Указанный email занят';
const USER_NOT_FOUND_ERR = 'Пользователь не найден';
const NOT_AUTHORIZED_ERR = 'Вы не авторизованы';

module.exports = {
  corsOptionsDelegate,
  limiter,
  MONGO_ADDRESS,
  PORT_NUMBER,
  SECRET_KEY,
  DEFAULT_ERR,
  NOT_FOUND_ERR,
  CRASH_TEST_ERR,
  EMAIL_OR_PASSWORD_ERR,
  EMAIL_VALID_ERR,
  URL_VALID_ERR,
  INCORRECT_ERR,
  FORBIDDEN_DELETE_ERR,
  FILM_NOT_FOUND_ERR,
  EMAIL_BUSY_ERR,
  USER_NOT_FOUND_ERR,
  NOT_AUTHORIZED_ERR,
};
