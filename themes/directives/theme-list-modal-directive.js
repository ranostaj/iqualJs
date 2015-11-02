/**
 * Theme list Table in modal with listing
 * @param {type} param1
 * @param {type} param2
 * @usage <div theme-list-modal project-id="@"></div>
 */

'use strict';
(function() {

    angular.module('theme.directives')
            .directive('themeListModal', themeListModal);
    /**
     * Directive
     * @returns
     */
    themeListModal.$inject = ['$modal', 'ThemeFactory'];
    function themeListModal($modal, ThemeFactory) {

        var directive = {
            scope: {
                projectId: '@'
            },
            restrict: 'A',
            link: link
        };
        return directive;
        ///////////////////


        /**
         * Hanlde click event
         * @param {type} scope
         * @param {type} elem
         * @param {type} attr
         * @returns {undefined}
         */
        function link(scope, elem, $attr) {
            elem.bind('click', function($event) {
                openModal($attr, $event);
            });
        }
        ;
        /**
         * Open modal
         * @param {type} $attr
         * @param {type} $event
         * @returns {undefined}
         */
        function openModal($attr, $event) {
            $event.preventDefault();
            $modal.open({
                controller: 'ThemeListModalCtrl as ctrl',
                templateUrl: 'js/modal/templates/themes-table-modal.html',
                size: 'lg',
                resolve: {
                    project_id: function()
                    {
                        return $attr.projectId;
                    }
                }
            });
        }

    }

})();

