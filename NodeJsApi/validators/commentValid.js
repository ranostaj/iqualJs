/**
 * Comment Validation
 * @type {*|exports|module.exports}
 */


var config      = require('../config/env');
var Promise     = require("bluebird");


var Validator = function Validate() {

};

/**
 * Valid comment text
 */
Validator.prototype.text = function(model) {
    return new Promise(function(resolve,reject){
        var attributes = model.attributes;
        if(!attributes.text) {
            reject("PLEASE_INSERT_TEXT");
        } else {
            resolve(attributes)
        }
    });
};


/**
 * Valid theme name
 */
Validator.prototype.theme = function(model) {
    var Theme = require('../models/themeModel');
    return new Promise(function(resolve,reject){
        var attributes = model.attributes;
        if(!attributes.theme_id) {
            reject("ASSIGN_TO_THEME");
        } else {
            Theme
                .view(attributes.theme_id)
                .then(function (model) {
                    resolve(model)
                })
                .catch(function (error) {
                    reject("INVALID_THEME_ID");
               });
        }
    });
};


module.exports  = new Validator();