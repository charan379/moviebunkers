const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const stylus = require('stylus');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const  moviesRouter = require('./routes/movies');
const { newMovie } = require('./repository/movieRepository');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// mongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/moviebunkers', {
  useNewUrlParser: true,
  // useCreateIndex: true, // deprecated on MongoDB v6+
  // useFindAndModify: false, // deprecated on MongoDB v6+
  useUnifiedTopology: true,
}).then(() =>{
  console.log("MongoDB database connection established successfully");
}).catch((error) => {
  console.log("Failed to establish MongoDB Connection", error);
})


// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter)

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
  res.render('error');
});
newMovie();
module.exports = app;
