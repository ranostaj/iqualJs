/**
 * Theme Images list
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module( 'theme.directives' )
            .directive( 'imagesList', imagesList );

    /**
     * Directive
     * @returns
     */
    function imagesList() {

        return {
            require : '^ngModel',
            scope : {
                ngModel : '=',
                deleteImage : '&'
            },
            restrict : 'A',
            templateUrl : 'js/themes/directives/templates/image-list.html',
        }

    }

})();

