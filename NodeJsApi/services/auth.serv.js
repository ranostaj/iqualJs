/**
 * Application Auth middleware
 *
 */


var express = require('express');
var router = express.Router();
var userModel   = require('../models/userModel');
var jwt         = require("jsonwebtoken");
var config      = require('../config/env');


router

    .use(function(req,res,next) {

        // var token = req.body.token || req.query.token || req.headers['authorization'];
        //
        // if(!token) {
        //     res.sendStatus(403);
        // } else {

            // jwt.verify(token,config.token.secreet, function(err, decoded){
            //             console.log(err,decoded);
            //             next();
            // });

            //userModel.validateToken(token)
            //    .then(function(user){
            //        var data = user.toJSON();
            //        req.token = data.token;
            //        next();
            //    })
            //    .catch(function(error){
            //        res.sendStatus(403);
            //    })

        //}
         next();
   });



module.exports = router;
