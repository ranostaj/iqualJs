/**
 * Coment Model
 *
 * @type {*|exports|module.exports}
 */

var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var config = require('../config/env');
var _ = require("lodash");
var Promise = require("bluebird");
var CommentValidator = require("../validators/commentValid");
var AppModel = require("./appModel");


var CommentModel = Bookshelf.Model.extend({
    tableName: 'comments',

    /**
     * Koment vytvoreny uzivatelom
     * @returns {*|Model}
     * @constructor
     */
    User: function() {
        return this.belongsTo(require("./userModel"));
    },

    Theme: function() {
        return this.belongsTo(require("./themeModel"));
    },

    /**
     * Diary user relation
     * Comment ktory je priradeny uzivatelovi v dennikoch
     * @returns {*|Model}
     * @constructor
     */
    DiaryUser: function() {
        return this.belongsTo(require("./userModel"), "diary_user_id");
    },

    Children: function() {
        return this.belongsTo(CommentModel, "parent_id");
    },

    initialize: function () {
        this.on("saving", this.validateSave);

    },

    /**
     * Validate on save Theme
     */
    validateSave: function (model, attrs, options) {
        var promises = [];
        promises.push(CommentValidator.text(model));
        promises.push(CommentValidator.theme(model));
        return Promise.all(promises);
    },



},AppModel);

module.exports = CommentModel;