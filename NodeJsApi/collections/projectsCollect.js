/**
 * Projects Collection
 * @type {UserModel|exports|module.exports}
 */

var Project   = require('../models/projectModel');
var mysql       = require('../config/mysql');
var Bookshelf   = require('bookshelf')(mysql);

var Projects = Bookshelf.Collection.extend({
    model: Project,

    getAll: function(options) {
        return this.fetch(options);
    }
});

module.exports = Projects;
