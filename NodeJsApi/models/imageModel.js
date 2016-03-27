/**
 * Image Model
 *
 * @type {*|exports|module.exports}
 */

var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var AppModel = require("./appModel");

var ImageModel = Bookshelf.Model.extend({

    tableName: 'images',

    Comment: function () {
        return this.belongsTo(require("./commentModel"));
    }

}, AppModel);

module.exports = ImageModel;