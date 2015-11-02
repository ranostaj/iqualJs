/**
 * User list controller in modal window
 * @returns {undefined}
 *
 */

(function() {
    "use strict";
    angular.module( 'user.controllers' )
            .controller( 'UserListModalCtrl', UserListModalCtrl );



    UserListModalCtrl.$inject = ['$scope', 'UserFactory', '$modalInstance', 'ResolveData'];
    function UserListModalCtrl( $scope, UserFactory, $modalInstance, ResolveData ) {


        var deleteFn = {
            project : function( $user_id, id ) {
                return UserFactory.deleteFromProject( { user : $user_id, project : id } );
            },
            theme : function( $user_id, id ) {
                return  UserFactory.deleteFromTheme( { user : $user_id, theme : id } );
            }

        }

        var textFn = {
            project : function() {
                return { title : 'Zoznam respondentov v projekte' };
            },
            theme : function() {
                return { title : 'Zoznam respondentov v téme' };
            }
        }

        $scope.users = ResolveData.users;
        $scope.id = ResolveData.id;
        $scope.type = ResolveData.type;
        $scope.text = textFn[$scope.type]();




        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        }

        /**
         * Remove user from project
         * @param {type} $user_id
         * @returns {undefined}
         */
        $scope.remove = function( $user_id ) {
            deleteFn[$scope.type]( $user_id, $scope.id ).then( function() {
                afterDelete( $user_id );
            } );
        };



        var afterDelete = function( $deleted_id ) {
            angular.forEach( $scope.users, function( user, index ) {
                if ( user.User.id === $deleted_id ) {
                    $scope.users.splice( index, 1 )
                }
            } );
        }
    }
    ;

})();