/**
 * User List Directive
 * @param {type} param1
 * @param {type} param2
 *
 */



(function() {
    'use strict';
    angular.module( 'user.directives' )
            .directive( 'userList', userList );

    /**
     * Directive
     * @returns
     */
    function userList() {
        var directive = {
            scope : {
                view : '&onView'
            },
            restrict : 'A',
            templateUrl : 'js/users/directives/templates/user-list-table.html',
            controller : "UsersListCtrl",
            controllerAs : 'ctrl'
        };

        return directive;
    }


})();

