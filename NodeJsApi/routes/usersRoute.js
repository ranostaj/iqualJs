/**
 * User router
 *
 *
 */

var UsersCtrl = require('../controllers/usersCtrl');

var usersRouter = function usersRouter(router) {

    // Route /users
    router
        .route('/')
        .get(UsersCtrl.all)
        .post(UsersCtrl.save);

    // Route /users/:user_id
    router
        .route('/:user_id')
        // View User
        .get(UsersCtrl.view)
        // Update User
        .put(UsersCtrl.update)
        // Delete User
        .delete(UsersCtrl.remove);

    // Route /users/:user_id/themes
    router
        .route('/:user_id/themes')
        .get(UsersCtrl.themes);

    // Route /users/:user_id/themes/:theme_id
    router
        .route('/:user_id/themes/:theme_id')
        // Remove user from Theme
        .delete(UsersCtrl.themesDelete)

        // Add user into theme
        .post(UsersCtrl.themesAdd);


    // Route /users/:user_id/
    router
        .route('/:user_id/projects')
        .get(UsersCtrl.projects);


    router
        .route('/:user_id/projects/:project_id')
        // Remove user from project
        .delete(UsersCtrl.projectsDelete)

        // Add user into project
        .post(UsersCtrl.projectsAdd);

    router
        .route('/:user_id/comments')
        .get(UsersCtrl.comments);

};

module.exports = usersRouter;
