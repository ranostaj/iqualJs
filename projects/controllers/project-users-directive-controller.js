/**
 * User list controller in modal window
 * @returns {undefined}
 *
 */

(function() {
    "use strict";
    angular.module( 'project.controllers' )
            .controller( 'projectUsersCtrl', projectUsersCtrl );



    projectUsersCtrl.$inject = ['$scope', 'UserFactory', '$modalInstance', 'ResolveData'];
    function projectUsersCtrl( $scope, UserFactory, $modalInstance, ResolveData ) {

        var $this = this;
        $this.cancel = cancel;
        $this.remove = remove;
        $this.data = ResolveData.data;
        $this.project_id = ResolveData.project_id;

        ///////////////////////////


        function cancel() {
            $modalInstance.dismiss( 'cancel' );
        }

        /**
         * Remove user from project
         * @param {type} $user_id
         * @returns {undefined}
         */
        function remove( $user_id ) {
            UserFactory.deleteFromProject( { user : $user_id, project : $this.project_id } ).then( function() {
                afterDelete( $user_id );
            } );
        }
        ;



        function afterDelete( $deleted_id ) {
            angular.forEach( $this.data, function( user, index ) {
                if ( user.User.id === $deleted_id ) {
                    $this.data.splice( index, 1 )
                }
            } );
        }
    }
    ;

})();