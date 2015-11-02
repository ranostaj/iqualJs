/**
 * Post comment form
 * @returns {undefined}
 */

(function() {
    'use strict';
    angular.module( 'theme.directives' )
            .directive( 'commentForm', CommentForm );

    CommentForm.$inject = ['$rootScope'];

    function CommentForm( $rootScope ) {

        return {
            scope : {
                themeData : '@'
            },
            restrict : 'E',
            templateUrl : 'js/themes/directives/templates/post-comment-form.html',
            controller : "PostCommentFormCtrl",
            controllerAs : 'ctrl',
            link : function( scope, elem, attr ) {

                elem.find( 'textarea' ).focus();

            }
        };
    }
    ;


})();
