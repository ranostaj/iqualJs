/**
 * New Account Modal Controller
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
            .controller( 'newAccountModalCtrl', newAccountModalCtrl );

    newAccountModalCtrl.$inject = ['$scope', '$modalInstance', 'UserFactory', '$timeout'];


    function newAccountModalCtrl( $scope, $modalInstance, UserFactory, $timeout ) {


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
            $this.formData.role_id = 1;
            $this.formData.pictogram_id = 1;
            UserFactory.register( $this.formData ).then( success, error );
        }
        ;


        /**
         * Success handler
         * @param {type} response
         * @returns {undefined}
         */
        function success( response ) {
            $this.success = response.data.message;
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