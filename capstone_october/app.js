const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./extension');


//var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const registRouter = require('./routes/regist');
const listRouter = require('./routes/list');
const ongoingRouter = require('./routes/ongoing');
const voteRouter = require('./routes/vote');
const deleteRouter = require('./routes/delete');
const resultRouter = require('./routes/result');
const mypageRouter = require('./routes/mypage');
const logoutRouter = require('./routes/logout');
const sendRouter = require('./routes/send');

const app = express();

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
    password: process.env.DB_PASSWORD || '32167352',
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
app.use('/vote/delete',deleteRouter);
app.use('/result',resultRouter);
app.use('/mypage',mypageRouter);
app.use('/logout',logoutRouter);
app.use('/vote/send',sendRouter);

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

app.use(express.static(__dirname + '/public'));

module.exports = app;
