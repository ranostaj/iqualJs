/**
 * Global Middleware
 */


var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var jwt = require("jsonwebtoken");
var config = require('../config/env');


var Middleware = function() {};


Middleware.prototype.authorize = function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(403).send("TOKEN_NOT_FOUND");
  }

  jwt.verify(token, config.token.secreet, function(err, decoded) {
    if (err) {
      return res.status(403).send("INVALID_TOKEN");
    } else {
      req.user = decoded;
      next();
    }
  });


};


Middleware.prototype.acl = function(req, res, next) {
  next();
};

module.exports = new Middleware();
