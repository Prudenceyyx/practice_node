var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('express-error-handler'); //https://github.com/btford/angular-express-seed/issues/34
const session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const register = require('./routes/register');
const messages = require('./middleware/messages'); //after register because of session
const login = require('./routes/login');
const user = require('./middleware/user');
const validate = require('./middleware/validate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
console.log(path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
//Output colored logs
app.use(logger('dev'));
//Set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //true if body has entry[key]
app.use(cookieParser());

app.use(session({ // After cookie
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, '/public'))); //Serves static files from ./public
app.use(user); // After static
app.use(messages);

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// app.use('/', indexRouter); //Specifies app routes
app.get('/', entries.list);
app.use('/users', usersRouter);

// Post entry
app.get('/post', entries.form);
app.post('/post', // with validators
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit
);

//Register user
app.get('/register', register.form);
app.post('/register', register.submit);

//Login user
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)
  // render the styled html error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;