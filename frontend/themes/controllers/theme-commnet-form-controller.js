/**
 *
 * Theme comment form directive
 * @returns {undefined}
 */
(function() {
    'use strict';
    angular.module( 'theme.controllers' )
            .controller( 'PostCommentFormCtrl', PostCommentFormCtrl );

    PostCommentFormCtrl.$inject = ['$scope', '$rootScope', 'CommentFactory'];
    function PostCommentFormCtrl( $scope, $rootScope, CommentFactory ) {

        this.comment = null;


        /**
         * submit comment form data
         * @param {type} $event
         * @returns {undefined}
         */
        this.submitForm = function( $event ) {
            var theme = JSON.parse( $scope.themeData );
            CommentFactory.save( { Comment : { theme_id : theme.id, text : this.comment } } ).then( __success );
        };

        var __success = function( response ) {
            $scope.$emit( 'afterSavedComment' );
        };

    }
    ;

})();