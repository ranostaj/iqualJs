/**
 * User Validator
 */


 var config      = require('../config/env');
 var jwt         = require("jsonwebtoken");
 var _           = require("lodash");
 var Promise     = require("bluebird");


 var Validator = function Validate() {

 };

/**
 * Valid unique username
 */
Validator.prototype.unique = function(model) {
  var User     = require('../models/userModel');
  return new Promise(function(resolve,reject){
      var attributes = model.attributes;    
      return User.forge()
               .where('username', '=',attributes.username)
               .where('id', '!=', model.isNew() === false ? attributes.id : '')
               .fetch({require:true})
               .then(function(error){
                  reject("USER_ALREADY_EXISTS");
              }).catch(function(err){
                 resolve(err);
       });
  });
};

/**
 * Valid Email address
 */
Validator.prototype.email = function(model) {
    var attributes = model.attributes;
    var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return new Promise(function(resolve,reject){
          if(!reg.test(attributes.username)) {
               reject("INVALID_USER_NAME");
          }
           resolve();
    });
};


/**
   @todo
 * Load validators
 */
Validator.prototype.load = function() {
    var promises = [];
    var attributes = this;
        for (var nProp = 0; nProp <= arguments.length; nProp++) {
          promises[nProp] = Validator.prototype[arguments[nProp]].call(null,attributes);
        }

    return promises;
};


 module.exports  = new Validator();
