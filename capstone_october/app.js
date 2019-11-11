var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var registRouter = require('./routes/regist');
var listRouter = require('./routes/list');
var ongoingRouter = require('./routes/ongoing');
var voteRouter= require('./routes/vote');
var resultRouter = require('./routes/result');
var logoutRouter = require('./routes/logout');

var app = express();

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'fdfalskfjalffaslkj',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password:'32167352',
    database:'voting'
  })//cookie secure? 

  }))
 //passport
 app.use(passport.initialize());
 app.use(passport.session());
// app.use(flash());


app.use('/list',listRouter);
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/regist',registRouter);
app.use('/ongoing',ongoingRouter);
app.use('/vote',voteRouter);
app.use('/result',resultRouter);
app.use('/logout',logoutRouter);


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

module.exports = app;
