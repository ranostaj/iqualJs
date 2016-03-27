/**
 * Project Model
 *
 * @type {*|exports|module.exports}
 */

var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var crypto = require('crypto');
var config = require('../config/env');
var ProjectValidator = require("../validators/projectValid");
var AppModel = require("./appModel");


var ProjectModel = Bookshelf.Model.extend({

    tableName: 'projects',

    Users: function () {
        return this.belongsToMany(require("./userModel"));
    },

    Themes: function () {
        return this.hasMany(require("./themeModel"));
    },

    initialize: function () {

        this.on("saving", this.validateSave);

    },

    /**
     * Validate on save project
     */
    validateSave: function (model, attrs, options) {
        var promises = [];
        promises.push(ProjectValidator.name(model));
        return Promise.all(promises);
    },

    /**
     * Create new project
     * @returns {*}
     */
    create: function () {
        return this.save(this.attributes, {method: "insert"})
            .then(function (model) {
                return model;
            })
            .catch(function (error) {
                return error;
            });
    },

    /**
     * Update Project
     */
    update: function (data) {
        return this.save(data, {method: "update"})
            .then(function (model) {
                return model;
            })
            .catch(function (error) {
                return error;
            });
    },


    /**
     * View single Project
     * @param id
     * @todo Dorobit project hash
     */
    view: function (id) {
        return this.where({id:id})
            .fetch({
                withRelated: ['Themes'],
                require: true
            })
            .then(function (model) {
                return model;
            });
    },

    /**
     * Remove project
     * @param id
     */
    remove: function (id) {
        return this.where({id:id})
            .fetch({
                require: true
            })
            .then(function (model) {
                return model.destroy();
            });
    }
});

module.exports = ProjectModel;
