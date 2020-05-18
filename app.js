var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const jwtMiddleware = require('express-jwt');
const Applications = require('./models/Application');

// Routes
const places = require('./routes/places');
const users = require('./routes/users');
const sessions = require('./routes/sessions');
const favorites = require('./routes/favorites');
const visits = require('./routes/visits');
const visitPlaces = require('./routes/visitPlaces');
const applications = require('./routes/applications');

const findAppBySecret = require('./middleware/findAppBySecret');
const authApp = require('./middleware/authApp')();
const findAppByApplicationId = require('./middleware/findAppByApplicationId');
const allowCORs = require('./middleware/allowCORs')();

// Config
const db = require('./config/database');
const secrets = require('./config/secrets');

db.connect();
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware de seguridad
app.use(findAppBySecret);
app.use(findAppByApplicationId);
app.use(authApp.unless({method: 'OPTIONS'}));

app.use(allowCORs.unless({path: '/public'}));

app.use(
  jwtMiddleware({secret: secrets.jwtSecret})
    .unless({path: ['/sessions', '/users'], method: ['GET', 'OPTIONS']})
);

app.use('/places', places);
app.use('/places', visitPlaces);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/favorites', favorites);
app.use('/visits', visits);
app.use('/applications', applications);

app.get('/deleteApp', function(req, res){
  Applications.remove({}).then(r => res.json({}))
});

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
  res.json(err);
});

module.exports = app;
