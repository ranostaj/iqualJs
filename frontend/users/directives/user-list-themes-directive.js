/**
 * Theme ThemeListTable Directive
 * @usage <div user-list-themes user-id="@"></div>
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module( 'user.directives' )
            .directive( 'userListThemes', userListThemes );

    /**
     * Directive
     * @returns
     */
    function userListThemes() {

        return {
            scope : {
                userId : '@'
            },
            restrict : 'A',
            replace : true,
            templateUrl : 'js/users/directives/templates/user-list-themes.html',
            controller : 'UserListThemes',
            controllerAs : 'ctrl',
            link : function( scope, elem, attr ) {

            }
        }

    }


})();

