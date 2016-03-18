/**
 * Theme Model
 *
 * @type {*|exports|module.exports}
 */

var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var Promise = require("bluebird");
var ThemeValidator = require("../validators/themeValid");
var AppModel = require("./appModel");


var ThemeModel = Bookshelf.Model.extend({

    tableName: 'themes',

    Users: function () {
        return this.belongsToMany(require("./userModel"));
    },

    Project: function () {
        return this.belongsTo(require("./projectModel"));
    },

    initialize: function () {

        this.on("saving", this.validateSave);

    },

    /**
     * Validate on save Theme
     */
    validateSave: function (model, attrs, options) {
        var promises = [];
        promises.push(ThemeValidator.name(model));
        promises.push(ThemeValidator.project(model));
        return Promise.all(promises);
    }


},AppModel);

module.exports = ThemeModel;
