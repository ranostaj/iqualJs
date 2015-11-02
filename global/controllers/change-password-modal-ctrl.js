
/**
 * Change password modal Ctrl
 * @param {type} $scope
 * @param {type} $modalInstance
 * @param {type} UserFactory
 * @param {type} userData
 * @returns {undefined}
 */

"use strict";
(function() {

    angular.module( 'global.controllers' ).controller( 'changePasswordCtrl', changePasswordCtrl );

    changePasswordCtrl.$inject = ['$scope', '$modalInstance', 'UserFactory'];

    function changePasswordCtrl( $scope, $modalInstance, UserFactory ) {

        $scope.formData = { };
        $scope.success = false;

        /**
         * Handle password change action
         * @param {type} formData
         * @returns promise
         */
        $scope.submitForm = function( $event ) {
            return UserFactory.changePassword( $scope.formData ).then( function( response ) {
                $scope.success = response.data.message_modal;
            } );
        };

        // close modal
        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        };
    }
    ;



})();