/**
 * Theme ThemeListTable Directive
 * @usage <theme-comments-list comments="="></theme-comments-list>
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module( 'theme.directives' )
        .directive( 'themeCommentsList', themeCommentsList );

    /**
     * Directive
     * @returns
     */

    themeCommentsList.$inject= ['UserService'];

    function themeCommentsList(UserService) {

        return {
            scope : {
                comments : '=',
                replyComment: '&'
            },
            restrict : 'E',
            replace : true,
            template : '<div><theme-comment-item reply-comment="reply" comment="comment" ng-repeat="comment in comments"></theme-comment-item></div>',
            controller : function($scope) {

                /**
                 * Get User data
                 * @returns {*}
                 */
                this.getUser = function() {
                    return UserService.getUserData();
                }

                $scope.reply = function(id,user) {
                    $scope.replyComment()(id,user);
                }
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

    angular.module( 'theme.directives' )
        .directive( 'themeCommentItem', themeCommentItem );

    /**
     * Directive
     * @returns
     */
    themeCommentItem.$inject = ['$compile'];
    function themeCommentItem( $compile ) {

        return {
            scope : {
                comment : '=',
                replyComment: '&'
            },
            require: '^themeCommentsList',
            restrict : 'E',
            replace : true,
            templateUrl : 'js/themes/directives/templates/theme-comment-item.html',
            link : function( scope, elem, attr, Ctrl ) {
                scope.setup = {};

                Ctrl.getUser().then(function(response) {
                    var role = response.role;
                    var user = response.user;
                   scope.setup = {
                       reply: /admin|user/.test(role) && user.id!=scope.comment.User.id ? true : false
                   }
                });


                scope.reply = function(id,user) {
                    scope.replyComment()(id,user);
                }

                var comments = '<div class="comment-reply"><theme-comments-list reply-comment="reply" comments="comment.children"  ></theme-comments-list></div>';
                if ( angular.isArray( scope.comment.children ) ) {
                    $compile( comments )( scope, function( cloned, scope ) {
                        elem.append( cloned );
                    } );
                }

            }
        }

    }


})();
