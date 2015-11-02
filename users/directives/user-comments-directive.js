/**
 * Theme ThemeListTable Directive
 * @usage <user-comments comments="="></user-comments>
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module( 'user.directives' )
            .directive( 'userComments', userComments );

    /**
     * Directive
     * @returns
     */
    function userComments() {

        return {
            scope : {
                comments : '='
            },
            restrict : 'E',
            replace : true,
            template : '<ul class="list-group list-group-sp"  ><comment-item comment="comment" ng-repeat="comment in comments"></comment-item></ul>',
            link : function( scope, elem, attr ) {

            }
        }

    }


})();


/**
 * Comment Item
 * @returns {undefined}
 */
'use strict';
(function() {

    angular.module( 'user.directives' )
            .directive( 'commentItem', commentItem );

    /**
     * Directive
     * @returns
     */
    commentItem.$inject = ['$compile'];
    function commentItem( $compile ) {

        return {
            scope : {
                comment : '='
            },
            restrict : 'E',
            replace : true,
            templateUrl : 'js/users/directives/templates/user-comment-item.html',
            link : function( scope, elem, attr ) {
                scope.hasChild = false;
                scope.icon_down = true;
                var collectionSt = '<user-comments comments="comment.children"  ></user-comments>';
                if ( angular.isArray( scope.comment.children ) ) {
                    scope.hasChild = true;
                }

                scope.openChild = function() {
                    var ul = angular.element( elem ).find( 'ul' );
                    scope.icon_down = scope.icon_down ? false : true;
                    if ( ul.length ) {
                        ul.remove();
                    } else {
                        if ( angular.isArray( scope.comment.children ) ) {
                            $compile( collectionSt )( scope, function( cloned, scope ) {
                                elem.append( cloned );
                            } );
                        }
                    }
                }
            }
        }

    }


})();
