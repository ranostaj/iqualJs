/**
 * Theme Validation
 * @type {*|exports|module.exports}
 */


var config      = require('../config/env');
var _           = require("lodash");
var Promise     = require("bluebird");


var Validator = function Validate() {

};

/**
 * Valid Theme name
 */
Validator.prototype.name = function(model) {
    return new Promise(function(resolve,reject){
        var attributes = model.attributes;
        if(!attributes.name) {
            reject("INVALID_THEME_NAME");
        } else {
            resolve(attributes)
        }
    });
};


/**
 * Valid project name
 */
Validator.prototype.project = function(model) {
    var Project = require('../models/projectModel');
    return new Promise(function(resolve,reject){
        var attributes = model.attributes;
        if(!attributes.project_id) {
            reject("ASSIGN_TO_PROJECT");
        } else {
            Project.forge()
                .view(attributes.project_id)
                .then(function (model) {
                    resolve(model)
                })
                .catch(function (error) {
                    reject("INVALID_PROJECT_ID");
             });
        }
    });
};


module.exports  = new Validator();