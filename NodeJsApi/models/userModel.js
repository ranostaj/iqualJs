/**
 * User Model
 *
 * @type {*|exports|module.exports}
 */

var mysql = require('../config/mysql');
var Bookshelf = require('bookshelf')(mysql);
var crypto = require('crypto');
var config = require('../config/env');
var jwt = require("jsonwebtoken");
var _ = require("lodash");
var Promise = require("bluebird");
var Validator = require("../validators/userValid");

var UserModel = Bookshelf.Model.extend({

        tableName: 'users',

        Role: function () {
            return this.belongsTo(require("./roleModel"));
        },

        Themes: function () {
            return this.belongsToMany(require("./themeModel"));
        },

        Projects: function () {
            return this.belongsToMany(require("./projectModel"));
        },

        Comments: function () {
            return this.hasMany(require("./commentModel"));
        },


        initialize: function () {
            this.on('saving', this.validateSave);
            this.on('project:remove', this.removeThemes);
        },

        /**
         * Validate on save user
         */
        validateSave: function (model, attrs, options) {

            var promises = [];
            promises.push(Validator.email(model));
            promises.push(Validator.unique(model));

            return Promise.all(promises);
        },


        /**
         *
         * Login
         * @param username
         * @param password
         */
        findLogin: function (username, password) {

            return this.where({
                    username: username,
                    password: this.hashString(password)
                })
                .fetch({
                    require: true
                })
                .then(function (model) {
                    return model.toJSON();
                });
        },

        /**
         * Validate Token
         * @param token
         * @returns {*|Promise.<Model|null>}
         */
        validateToken: function (token) {

            return this.where({
                    token: token
                })
                .fetch({
                    require: false
                });
        },

        /**
         * Hash password
         * @param password
         * @returns {*}
         */
        hashString: function (string) {

            return crypto.createHash("sha1")
                .update(string)
                .update(config.token.secreet)
                .digest('hex');
        },

        /**
         *  Create new user
         */

        create: function () {

            var data = this.attributes;
            var password = this.hashString(data.password);
            var hash_id = this.hashString(data.username + data.password);

            var save_data = _.merge(data, {
                hash_id: hash_id,
                password: password
            });

            return this.save(save_data, {
                    method: "insert"
                })
                .then(function (model, attrs) {
                    var attributes = model.attributes;
                    // generate token
                    attributes.token = jwt.sign({
                        username: attributes.username,
                        hash_id: attributes.hash_id
                    }, config.token.secreet);

                    return model.save(attributes, {
                        method: "update"
                    }).then(function (updated) {
                        return updated;
                    });

                });
        },

        /**
         * Update user
         */
        update: function (data) {
            var password = {};

            if (data.password !== undefined) {
                password = {
                    password: this.hashString(data.password)
                };
            }

            var save_data = _.merge(data, password);
            return this.save(save_data, {
                method: "update"
            });
        },

        /**
         * Update User
         * @param user_hash
         */
        remove: function (user_hash) {
            return this.getUserByHash(user_hash)
                .fetch({
                    require: true
                })
                .then(function (model) {
                    return model.destroy();
                });
        },

        /**
         * View single User
         * @param user_hash
         */
        view: function (user_hash) {
            return this.getUserByHash(user_hash)
                .fetch({
                    withRelated: ['Role'],
                    require: true
                })
                .then(function (model) {
                    delete model.attributes.password;
                    delete model.attributes.token;
                    model.attributes.Role = model.related('Role').attributes;
                    return model;
                });
        },

        /**
         * Remove single theme from User
         * @param user_hash
         * @param theme_id
         */
        removeTheme: function (user_hash, theme_id) {
            var $this = this;
            return this.getUserByHash(user_hash).fetch({
                withRelated: ['Themes']
            }).then(function (model) {
                var user_id = model.attributes.id;
                return model.Themes()
                    .fetch()
                    .then(function (themes) {
                        return $this._detachTheme(themes, user_id, theme_id);
                    });
            });
        },


        /**
         * Detach themes
         * @param themesCollection
         * @param user_id
         * @returns {Array|Object}
         */
        _detachThemes: function (themesCollection, user_id) {
            var $this = this;
            return _.forEach(themesCollection.toJSON(), function (value, key) {
                $this._detachTheme(themesCollection, user_id, value.id);
            });
        },

        /**
         * Detach single teme
         * @param themesCollection
         * @param user_id
         * @param theme_id
         * @returns {Array|Object}
         */
        _detachTheme: function (themesCollection, user_id, theme_id) {
            themesCollection.detach({
                theme_id: theme_id,
                user_id: user_id
            });
        },
        /**
         * Remove all themes from User
         * @param model  User Model object
         * @param where
         */
        removeThemes: function (model, where) {
            var $this = this;
            if (!model) return;

            var where = where ? where : {};

            return model.Themes()
                .query({where: where})
                .fetch()
                .then(function (themes) {
                    $this._detachThemes(themes, model.attributes.id);
                    return themes;
                });
        },

        /**
         * Priradenie novej temy
         * @param user_hash
         * @param theme_id
         */
        addTheme: function (user_hash, theme_id) {
            return this.getUserByHash(user_hash).fetch({
                withRelated: ['Themes']
            }).then(function (model) {

                return model.Themes().detach({
                    user_id: model.attributes.id,
                    theme_id: theme_id
                }).then(function (collection) {
                    return model.Themes().attach({
                            theme_id: theme_id,
                            user_id: model.attributes.id
                       })
                        .catch(function (error) {
                           return error;
                    });

                });
            });
        },


        /**
         * List All user themes
         * @param user_hash
         * @returns {*|Promise.<Model|null>}
         */
        getThemes: function (user_hash) {
            return this.getUserByHash(user_hash)
                .fetch({
                    withRelated: ['Themes'],
                    require: true
                });
        },

        /**
         * List All user projects
         * @param user_hash
         * @returns {*|Promise.<Model|null>}
         */
        getProjects: function (user_hash) {

            var $this = this;
            return new Promise(function (resolve, reject) {
                return $this.getUserByHash(user_hash)
                    .fetch({
                        withRelated: ['Projects'],
                        require: true
                    }).then(function (model) {
                        if (model.related('Projects').length) {
                            return resolve(model);
                        }
                        return reject("NO_PROJECTS_FOUND")
                    })
            });

        },

        /**
         * Remove user from project
         * @param user_hash
         * @param project_id
         */
        removeProject: function (user_hash, project_id) {

            var $this = this;

            return this.getUserByHash(user_hash)
                .fetch({
                    withRelated: ['Projects', 'Projects.Themes']
                })
                .then(function (model) {

                    return model.Projects()
                        .detach({
                            user_id: model.attributes.id,
                            project_id: project_id
                        }).then(function () {
                            return $this.removeThemes(model, {project_id: project_id});
                        });
                });
        },

        /**
         * Add user into project
         * @param user_hash
         * @param project_id
         */
        addProject: function (user_hash, project_id) {
            return this.getUserByHash(user_hash).fetch({
                    withRelated: ['Projects']
                })
                .then(function (model) {
                    return model.Projects().detach({
                            user_id: model.attributes.id,
                            project_id: project_id
                        })
                        .then(function (collection) {
                            return model.Projects().attach({
                                project_id: project_id,
                                user_id: model.attributes.id
                            });
                        });
                });
        },

        /**
         *
         * @param user_hash
         */
        getComments: function (user_hash) {
            var $this = this;
            return this.getUserByHash(user_hash).fetch({
                withRelated: ['Comments']
            }).then(function (model) {
                return model.related('Comments').fetch();
            });

        },


        /**
         * Get User model by Hash_id
         * @param hash
         * @returns {*|{id}|{uuid}|Model|Model[]}
         */
        getUserByHash: function (hash) {
            return this.where({
                hash_id: hash
            });
        }

    })
    ;


module.exports = UserModel;
