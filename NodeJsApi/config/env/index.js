/**
 * Global config loader
 */

var _   = require('lodash');
var defaults = require('./default');

var env = process.env.NODE_ENV || 'development';

var conf = require('./'+env);

module.exports = _.merge(defaults,conf);
