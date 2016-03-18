/**
 * Project Validation
 * @type {*|exports|module.exports}
 */


var config      = require('../config/env');
var jwt         = require("jsonwebtoken");
var _           = require("lodash");
var Promise     = require("bluebird");


var Validator = function Validate() {

};

/**
 * Valid project name
 */
Validator.prototype.name = function(model) {
    return new Promise(function(resolve,reject){
        var attributes = model.attributes;
        if(!attributes.name) {
            reject("INVALID_PROJECT_NAME");
        } else {
            resolve(attributes)
        }
    });
};


module.exports  = new Validator();