/**
 *  Users Controller
 */

var Project = require('../models/projectModel');
var Projectcollection = require('../collections/projectsCollect');

var Ctrl = function projectsCtrl() {
    this.model = require('../models/projectModel');
};


/**
 * All Projects
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.all = function (req, res, next) {
    return Projectcollection.forge()
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
    return Project.forge(req.body)
        .create()
        .then(function (models) {
            return res.status(200)
                .json(models);
        }).catch(function (error) {
            res.status(500).json(error);
        });
};


/**
 * Update project
 * @param req
 * @param res
 * @param next
 */
Ctrl.prototype.update = function (req, res, next) {
    var id = req.params.project_id;
    var data = req.body;
    return Project
        .forge({
            id: id
        }).fetch({
            require: true
        })
        .then(function (model) {
            return model.update(data)
                .then(function (saved) {
                    return res
                        .status(200)
                        .json(saved);
                });
        })
        .catch(function (error) {
            res.status(500).json(error);
        });

};


/**
 * View single project
 * @param req
 * @param res
 * @param next
 * @todo Dorobit project hash
 */
Ctrl.prototype.view = function (req, res, next) {
    var id = req.params.project_id;
    return Project.forge()
        .view(id)
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
 * Remove project
 * @param req
 * @param res
 * @param next
 * @todo project_hash
 */
Ctrl.prototype.remove = function (req, res, next) {
    var id = req.params.project_id;
    return Project.forge().remove(id)
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