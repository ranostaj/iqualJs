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

    router
        .route('/upload/:comment_id')
        // Upload file
        .post(CommentsCtrl.upload)
        .get(CommentsCtrl.resize);
};

module.exports = commentsRouter;
