/**
 * sidebarNotification Directive
 * @param {type} param1
 * @param {type} param2
 *
 */


(function() {

    angular.module( 'global.directives' ).directive( 'sidebarNotification', sidebarNotification );

    function sidebarNotification() {

        return {
            scope : {
                open : '=',
                notifications : '@data'
            },
            restrict : 'E',
            transclude : true,
            replace : true,
            templateUrl : "js/global/directives/templates/sidebar-notification.html",
            link : function( scope, elem, attr ) {
                scope.open = scope.open ? true : false;
            }

        };

    }
    ;

})();

