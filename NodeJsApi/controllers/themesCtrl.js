/**
 * Themes Controller
 * @type {ProjectModel|exports|module.exports}
 */

var Theme = require('../models/themeModel');
var Themescollection = require('../collections/themesCollect');

var Ctrl = function projectsCtrl() {
};


/**
 * All Projects
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.all = function (req, res, next) {
    return Themescollection.forge()
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
    return Theme
        .add(req.body)
        .then(function (models) {
            return res.status(200)
                .json(models);
        }).catch(function (error) {
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
    var id = req.params.theme_id;
    var data = req.body;
    return Theme.update(id,data)
            .then(function(saved) {
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
 * @todo Dorobit theme hash
 */
Ctrl.prototype.view = function (req, res, next) {
    var id = req.params.theme_id;
    return Theme
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
 * @todo project_hash
 */
Ctrl.prototype.remove = function (req, res, next) {
    var id = req.params.theme_id;
    return Theme
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