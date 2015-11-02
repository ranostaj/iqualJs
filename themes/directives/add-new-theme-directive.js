/**
 * @desc Add new theme directive
 * @param project-id="@" = id
 * @usage <div add-new-theme project-id="@" ></button>
 *
 */
'use strict';

(function() {

    /**
     * Module name
     */
    angular
            .module( 'theme.directives' )
            .directive( 'addNewTheme', addNewTheme )
            .controller( 'addThemeCtrl', addThemeCtrl );

    /**
     * Directive
     * @returns
     */
    addNewTheme.$inject = ['$ocLazyLoad', '$modal'];

    function addNewTheme( $ocLazyLoad, $modal ) {

        return {
            scope : {
                projectId : '@'
            },
            restrict : 'A',
            replace : false,
            link : function( scope, elem, attr ) {

                elem.bind( 'click', function( $event ) {

                    $event.preventDefault();

                    $modal.open( {
                        templateUrl : 'js/modal/templates/add-theme-modal.html',
                        resolve : {
                            projectId : function() {
                                return scope.projectId
                            }
                        },
                        controller : addThemeCtrl

                    } );
                } );
            }
        };

    }
    ;




    addThemeCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'ProjectFactory', 'ThemeFactory', '$location', 'projectId'];

    function addThemeCtrl( $scope, $rootScope, $modalInstance, ProjectFactory, ThemeFactory, $location, projectId ) {

        $scope.formData = {
            project_id : projectId ? projectId : null
        };

        var $this = this;
        $scope.projectId = projectId ? projectId : null;

        ProjectFactory.dropdown( { active : 1 } ).then( function( response ) {
            $scope.projects = response;
        } );

        /**
         * Sve new project
         * @returns {undefined}
         */
        $scope.save = function() {
            ThemeFactory.save( $scope.formData ).then( function( response ) {
                $modalInstance.dismiss( 'cancel' );
                $location.path( '/admin/theme/view/' + response.data.data.Theme.id );
            } );
        };

        // close modal
        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        };
    }


})();

