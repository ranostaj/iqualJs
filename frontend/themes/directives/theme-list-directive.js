/**
 * Theme List Directive
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module( 'theme.directives' )
            .directive( 'themeList', themeList );

    /**
     * Directive
     * @returns
     */
    function themeList() {

        return {
            scope : {
                filters : '@'
            },
            restrict : 'A',
            templateUrl : 'js/themes/directives/templates/theme-list-table.html',
            controller : 'ThemeListCtrl',
            controllerAs : 'ctrl'
        }

    }
})();

