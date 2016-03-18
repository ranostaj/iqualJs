/**
 * Main app file
 *
 */

// Modules
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require("jsonwebtoken");

// App init
var app = express();

// services
var Auth = require('./services/auth.serv');

// App configs
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('common'));

// Routes
require('./routes/index')(app);

// Error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
});

app.listen(3000, function () {
    console.log("initialized SUCCESSFULLY... in [" + app.get('env') + "]");
});

module.exports = app;
