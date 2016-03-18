/**
 * Comments router
 *
 *
 */

var CommentsCtrl = require('../controllers/commentsCtrl');

var commentsRouter = function commentsRouter(router) {

    // Route /comments
    router
        .route('/')
        .get(CommentsCtrl.all)
        .post(CommentsCtrl.save);

    // Route /comments/:comment_id
    router
        .route('/:comment_id')
        // View Comment
        .get(CommentsCtrl.view)
        // Update Comment
        .put(CommentsCtrl.update)
        // Delete Comment
        .delete(CommentsCtrl.remove);
};

module.exports = commentsRouter;
