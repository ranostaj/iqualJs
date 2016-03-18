/**
 *  Users Controller
 */

var Promise = require("bluebird");

var User = require('../models/userModel');
var UsersCollection = require('../collections/usersCollect');
var Theme = require('../models/themeModel');

var Controller = function usersCtrl() {
};

/**
 * Save new user
 */
Controller.prototype.save = function (req, res, next) {
    var data = req.body;
    return User.forge(data)
        .create()
        .then(function (model) {
            return res
                .status(200)
                .json({
                    hash_id: model.attributes.hash_id,
                    token: model.attributes.token
                });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};

/**
 * Update User
 */
Controller.prototype.update = function (req, res, next) {
    var id = req.params.user_id;
    var data = req.body;
    return User
        .forge({
            hash_id: id
        }).fetch({
            require: true
        })
        .then(function (model) {
            return model.update(data)
                .then(function (saved) {
                    return res
                        .status(200)
                        .json({
                            id: saved.attributes.hash_id,
                            token: saved.attributes.token,
                            username: saved.attributes.username,
                        });
                });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};

/**
 * View User
 */
Controller.prototype.all = function (req, res, next) {
    return UsersCollection
        .forge()
        .fetch({
            withRelated: ['Role'],
            require: true
        })
        .then(function (model) {
            return res
                .status(200)
                .json(models);
        })
        .catch(function (error) {
            res
                .status(500)
                .json(error);
        });
};


/**
 * View User
 */
Controller.prototype.view = function (req, res, next) {
    var user_hash = req.params.user_id;
    return User.forge()
        .view(user_hash)
        .then(function (model) {
            return res
                .status(200)
                .json(model.attributes);
        })
        .catch(function (error) {
            res
                .status(500)
                .json(error);
        });
};


/**
 * Delete User
 */
Controller.prototype.remove = function (req, res, next) {
    var user_hash = req.params.user_id;
    return User.forge().remove(user_hash)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 * User Themes
 */
Controller.prototype.themes = function (req, res, next) {
    var user_hash = req.params.user_id;
    return User.forge()
        .getThemes(user_hash)
        .then(function (model) {
            return res
                .status(200)
                .json(model.related('Themes'));
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};

/**
 * Remove User From theme
 */
Controller.prototype.themesDelete = function (req, res, next) {
    var user_hash = req.params.user_id;
    var theme_id = req.params.theme_id;

    return User.forge()
        .removeTheme(user_hash, theme_id)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 *  Add User to theme
 */
Controller.prototype.themesAdd = function (req, res, next) {
    var user_id = req.params.user_id;
    var theme_id = req.params.theme_id;
    return Theme.view(theme_id)
        .then(function (theme) {
            return User.forge().addTheme(user_id, theme.attributes.id)
                .then(function (model) {
                    return res
                        .status(200)
                        .json(model);
                })
                .catch(function (error) {
                    res.status(500).json(error);
                });
        }).catch(function (error) {
            res.status(500).json(error);
        });
}

/**
 * GEt User projects
 * @param req
 * @param res
 * @param next
 */
Controller.prototype.projects = function (req, res, next) {
    var user_hash = req.params.user_id;
    return User.forge().getProjects(user_hash)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });

};


/**
 * Remove user from project
 * @param req
 * @param res
 * @param next
 */
Controller.prototype.projectsDelete = function (req, res, next) {
    var user_hash = req.params.user_id;
    var project_id = req.params.project_id;

    return User.forge()
        .removeProject(user_hash, project_id)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
    });
};


/**
 * Add user into project
 * @param req
 * @param res
 * @param next
 */
Controller.prototype.projectsAdd = function (req, res, next) {
    var user_hash = req.params.user_id;
    var project_id = req.params.project_id;
    return User.forge().addProject(user_hash, project_id)
        .then(function (model) {
            return res
                .status(200)
                .json(model);

        });
};


Controller.prototype.comments = function (req, res, next) {
    var user_hash = req.params.user_id;
    var project_id = req.params.project_id;
    return User.forge().getComments(user_hash)
        .then(function (model) {
            return res
                .status(200)
                .json(model);

        });
};


module.exports = new Controller();
