const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Указаны некоректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail()
          .then((m) => res.send(m))
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Фильм не найден');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Указаны некоректные данные');
      } else if (err.statusCode === 403) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
    })
    .catch(next);
};
