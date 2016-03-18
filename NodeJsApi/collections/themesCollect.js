/**
 * Themes Collection
 * @type {UserModel|exports|module.exports}
 */

var Theme   = require('../models/themeModel');
var mysql       = require('../config/mysql');
var Bookshelf   = require('bookshelf')(mysql);

var Themes = Bookshelf.Collection.extend({
    model: Theme,

    getAll: function(options) {
        return this.fetch(options);
    }
});

module.exports = Themes;
