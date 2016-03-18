/**
 * Comments Controller
 * @type {ProjectModel|exports|module.exports}
 */

var Comment = require('../models/commentModel');
var User = require('../models/userModel');
var _ = require("lodash");
var Commentscollection = require('../collections/commentsCollect');

var Ctrl = function commentsCtrl() {
};


/**
 * All Projects
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.all = function (req, res, next) {
    return Commentscollection.forge()
        .getAll()
        .then(function (models) {
            return res.status(200)
                .json(models);
        });
};


/**
 * Create new project
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.save = function (req, res, next) {
    return User.forge().view(req.user.hash_id)
        .then(function (user) {
            var save_data = _.assign(req.body,{user_id:user.attributes.id});
            return Comment
                .add(save_data)
                .then(function (models) {
                    return res.status(200)
                        .json(models);
                }).catch(function (error) {
                    return res.status(500).json(error);
                });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 * Update Theme
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.update = function (req, res, next) {
    var id = req.params.comment_id;
    var data = req.body;
    return Comment.update(id, data)
        .then(function (saved) {
            return res
                .status(200)
                .json(saved);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });

};


/**
 * View single theme
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.view = function (req, res, next) {
    var id = req.params.theme_id;
    return Comment
        .view(id)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res
                .status(500)
                .json(error);
        });
};


/**
 * Remove project
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.remove = function (req, res, next) {
    var id = req.params.theme_id;
    return Comment
        .remove(id)
        .then(function (model) {
            return res
                .status(200)
                .json(model);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
};


module.exports = new Ctrl();