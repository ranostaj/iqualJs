/**
 * login controller
 *
 */

var LoginController = function () {

    var jwt = require("jsonwebtoken");
    var _ = require("lodash");
    var config = require('../config/env');
    var userModel = require('../models/userModel');


    var publicAPI = {

        login: login,
        logout: logout
    };

    return publicAPI;

    ///////


    function login(req, res, next) {

        var username = req.body.username;
        var password = req.body.password;

        userModel.findLogin(username, password)

            .then(function (user) {

                var token = jwt.sign(user.username, config.token.secreet, {
                    expiresIn: 10
                });

                res.status(200).json({
                    token: token,
                    user: user
                });

            }).catch(function (err) {

            res.status(500).json(err);
        });


    };

    function logout(req, res, next) {
        delete req.token
    };


};


module.exports = new LoginController();
