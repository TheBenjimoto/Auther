'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool', // or whatever you like
  // these options are recommended and reduce session concurrency issues
  resave: false,
  saveUnitialized: false
}));

// place right after the session setup middleware
app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

// "Responding" middleware (may send a response back to client)
app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.post('/login', function (req, res, next) {
  console.log('hitting login router')
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
      let time = 5000
      req.session.cookie.expires = new Date(Date.now() + time);
      res.sendStatus(204);
    }
  })
  .catch(next);
});

app.post('/signup', function(req, res, next) {
  console.log('Hitting signup router')
  User.findOrCreate({
    where: req.body
  })
  .then(function(user) {
    res.send(user);
  })
  .catch(next);
})

app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
