const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const { INCORRECT_ERR, FORBIDDEN_DELETE_ERR, FILM_NOT_FOUND_ERR } = require('../utils/constants');

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
        throw new BadRequestError(INCORRECT_ERR);
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
        throw new ForbiddenError(FORBIDDEN_DELETE_ERR);
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(FILM_NOT_FOUND_ERR);
      } else if (err.name === 'CastError') {
        throw new BadRequestError(INCORRECT_ERR);
      } else if (err.statusCode === 403) {
        throw new ForbiddenError(FORBIDDEN_DELETE_ERR);
      }
    })
    .catch(next);
};
