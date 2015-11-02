/**
 * User Massmail Directive
 * @param {type} param1
 * @param {type} param2
 *
 */



(function() {
    'use strict';
    angular.module( 'user.directives' )
            .directive( 'usersMassmail', usersMassmail );

    /**
     * Directive
     * @returns
     */
    function usersMassmail() {
        var directive = {
            scope : {
                users : '=',
                project: '='
            },
            restrict : 'E',
            templateUrl : 'js/users/directives/templates/users-massmail.html',
            controller : "UsersMassmailCtrl",
            controllerAs : 'ctrl',
            link : function( scope, elem, attr, Ctrl ) {
            }
        };

        return directive;
    }


})();

