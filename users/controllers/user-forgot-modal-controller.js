/**
 * Modal Controller
 * @param {type} $scope
 * @param {type} $modalInstance
 * @param {type} AuthService
 * @param {type} $log
 * @param {type} $timeout
 * @returns {undefined}
 */
"use strict";

(function() {

    angular.module( 'user.controllers' )
            .controller( 'UserForgotModalCtrl', UserForgotModalCtrl );

    UserForgotModalCtrl.$inject = ['$scope', '$modalInstance', 'AuthService', '$log', '$timeout'];


    function UserForgotModalCtrl( $scope, $modalInstance, AuthService, $log, $timeout ) {


        var $this = this;
        $this.formData = { };
        $this.success = null;
        $this.error = null;
        $this.cancel = cancel;
        $this.saveModalForm = saveModalForm;

        ///////////////////

        /**
         * Close window
         * @returns {undefined}
         */
        function cancel() {
            $modalInstance.dismiss( 'cancel' );
        }
        ;


        /**
         * Save form submit
         * @returns {undefined}
         */
        function saveModalForm() {
            AuthService.forgot( $this.formData ).then( success, error );
        }
        ;


        /**
         * Success handler
         * @param {type} response
         * @returns {undefined}
         */
        function success( response ) {
            $this.success = response.data.message;
            $timeout( function() {
                cancel();
            }, 2000 );
        }
        ;

        /**
         * Error handler
         * @returns {undefined}
         */
        function error( error ) {
            $this.error = error.data.message;
        }
        ;
    }
    ;

})();