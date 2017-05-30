require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var factorio = require('./factorio')();
var rcon = require('./rcon-client');

var app = express();

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://johanbjorn.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: ['http://localhost:9000','qLiuvNGbX2UlX4BShUxzS9HyuTr8oQVV'],
    issuer: "https://johanbjorn.eu.auth0.com/",
    algorithms: ['RS256']
});

app.use(jwtCheck);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message:'Missing or invalid token'});
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api', require('./routes/api')(factorio, rcon));

module.exports = app;
