/**
 * Themes Router
 * @type {Ctrl|*|exports|module.exports}
 */

var ThemesCtrl = require('../controllers/themesCtrl');

module.exports = function themesRouter(router) {

    // Route /themes
    router
        .route('/')
        .get(ThemesCtrl.all)
        .post(ThemesCtrl.save);

    router
        .route('/:theme_id')
        .get(ThemesCtrl.view)
        .put(ThemesCtrl.update)
        .delete(ThemesCtrl.remove)
};
