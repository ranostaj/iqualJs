
/**
 * Add Project Modal Ctrl
 * @param {type} $scope
 * @param {type} $modalInstance
 * @param {type} UserFactory
 * @param {type} userData
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'project.controllers' )
            .controller( 'addProjectCtrl', addProjectCtrl );


    addProjectCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'ProjectFactory', '$location'];

    function addProjectCtrl( $scope, $rootScope, $modalInstance, ProjectFactory, $location ) {

        $scope.formData = { };

        /**
         * Sve new project
         * @returns {undefined}
         */
        $scope.save = function() {
            ProjectFactory.save( $scope.formData ).then( function( response ) {
                $modalInstance.dismiss( 'cancel' );
                $location.path( '/admin/project/view/' + response.data.project.Project.id );
            } );
        };

        // close modal
        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        };
    }
    ;




})();