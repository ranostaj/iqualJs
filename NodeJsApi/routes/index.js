/**
 * Index Router
 */

var changeCase = require('change-case');
var express = require('express');
var routes = require('require-dir')();
var Middleware = require('../middleware');


var indexRouter = function indexRouter(app) {

    // middleware
    app.use(Middleware.authorize, Middleware.acl);

    Object.keys(routes).forEach(function (fileName) {
        var router = express.Router();
        var routeName = fileName.split("Route");
        require('./' + fileName)(router);
        app.use('/' + changeCase.paramCase(routeName[0]), router);
    });
};


module.exports = indexRouter;
