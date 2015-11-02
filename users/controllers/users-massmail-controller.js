/**
 * Controller
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */

"use strict";

(function() {

    angular.module( 'user.controllers' )
            .controller( 'UsersMassmailCtrl', UsersMassmailCtrl );

    UsersMassmailCtrl.$inject = ['$scope', '$rootScope', 'UserFactory', 'ProjectFactory', '$timeout', '$filter'];

    function UsersMassmailCtrl( $scope, $rootScope, UserFactory, ProjectFactory, $timeout, $filter ) {

        var $this = this;
        $this.selected = [];
        $this.scope_users = [];
        $this.users_list = [];
        $this.formData = { };
        $this.checked_all = false;
        $this.filters = { };
        $this.project = null;
        $this.selectUser = selectUser;
        $this.selectAll = selectAll;
        $this.sendForm = sendForm;
        $this.filterUsers = filterUsers;

        ///////////////////////////

        $scope.$watch( 'users', function( newValue ) {
            this.scope_users = this.users_list = newValue;
        }.bind( this ) );

        $scope.$watch( 'project', function( newValue ) {
            this.project =   newValue;
        }.bind( this ) );



        /**
         * USer filter
         * @param {type} $role
         * @returns {undefined}
         */
        function filterUsers( $role ) {
            $this.filters.role_id = $role;
            var users = angular.copy( $this.scope_users );
            $this.users_list = $filter( 'filter' )( $this.scope_users, $role === false ? { } : { role_id : $role } );


        }
        /**
         * Send message form
         * @returns {undefined}
         */
        function sendForm() {
            if ( $scope.messageForm.$valid && $this.selected.length ) {
                var data = angular.extend( $this.formData, { users : $this.selected } );
                ProjectFactory.sendMail($this.project, data ).then( function( data ) {
                    $this.success = true;
                    $this.formData = { };
                    $scope.messageForm.$setPristine();
                } );
            } else {
                $scope.messageForm.submitted = true;
            }
        }

        /**
         * Select single user
         * @param {type} $user
         * @returns {undefined}
         */
        function selectUser( $user ) {
            $user.checked = $user.checked ? false : true;
            $this.selected.push( $user );
            $this.selected = $filter( 'filter' )( $this.selected, { checked : true }, function( actual, expected ) {
                return angular.equals( actual, expected );
            } );

            $this.checked_all = $this.selected.length === $this.users_list.length ? true : false;
        }

        /**
         * Select All users
         * @returns {undefined}
         */
        function selectAll() {
            $this.checked_all = $this.checked_all ? false : true;
            $this.selected = [];
            angular.forEach( $this.users_list, function( value, index ) {
                if ( $this.checked_all === true ) {
                    $this.selected.push( angular.extend( value, { checked : true } ) );
                } else {
                    $this.users_list[index].checked = false;
                }
            } );

        }



    }
    ;
})();




