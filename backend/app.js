var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors')


var usersRouter = require('./routes/users');
var favoritesRouter = require('./routes/favorites');
var aiMatchRouter = require('./ai-matching/aiMatchRoute');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

app.use('/users', usersRouter);
app.use('/favorites', favoritesRouter);
app.use('/ai-match', aiMatchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
