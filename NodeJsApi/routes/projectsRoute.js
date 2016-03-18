/**
 * Projects Router
 * @type {Ctrl|*|exports|module.exports}
 */

var ProjectsCtrl = require('../controllers/projectsCtrl');

var projectsRouter = function projectsRouter(router) {

    // Route /projects
    router
        .route('/')
        .get(ProjectsCtrl.all)
        .post(ProjectsCtrl.save);

    router
        .route('/:project_id')
        .get(ProjectsCtrl.view)
        .put(ProjectsCtrl.update)
        .delete(ProjectsCtrl.remove)
};

module.exports = projectsRouter;
