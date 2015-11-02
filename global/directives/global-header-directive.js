/**
 * HEADER Directive
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';

(function() {


    angular.module( 'global.directives' ).directive( 'pageHeader', pageHeader );
    /**
     * Directive
     * @returns
     */
    function pageHeader() {
        var directive = {
            scope : { },
            restrict : 'E',
            transclude : true,
            replace : true,
            templateUrl : "js/global/directives/templates/header.html",
        }
        return directive;
    }


})();

