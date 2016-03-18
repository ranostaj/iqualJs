/**
 * Controller
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */

"use strict";

(function() {

    angular.module( 'user.controllers' )
            .controller( 'UsersListCtrl', UsersListCtrl );

    UsersListCtrl.$inject = ['$scope', 'UserFactory', 'ProjectFactory', '$location', '$timeout', '$filter'];

    function UsersListCtrl( $scope, UserFactory, ProjectFactory, $location, $timeout, $filter ) {

        var $this = this;
        $this.users = [];
        $this.filters = { };
        $this.isLoading = false;
        $this.loadData = callServer;
        $this.pages = [5, 10, 15];
        $this.onPage = 15;
        $this.results = true;
        $this.deleteRow = deleteRow;
        ///////////////////////////


        /**
         * DropDown projects
         */
        function getUserRolesDropDown() {
            UserFactory.getRoles().then( function( result ) {
                $this.roles = UserFactory.roles;
            } );
        }
        ;
        getUserRolesDropDown();
        /**
         * Load data per page
         * @param {type} tableState
         * @returns {undefined}
         */
        function callServer( tableState ) {
            $this.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || $this.onPage;

            UserFactory.getPage( start, number, tableState, $this.filters ).then( function( result ) {


                var number_to = eval( parseInt( number ) + parseInt( start ) );
                $this.users = result.data;

                $this.table = {
                    start : start + 1,
                    number : number_to < result.total ? number_to : result.total,
                    total : result.total
                };


                tableState.pagination.numberOfPages = result.numberOfPages;

                $this.isLoading = false;

                $this.results = $this.users !== undefined ? true : false;


            } );
        }
        ;


        /**
         * DropDown projects
         */
        var getProjectsDropDown = function() {
            ProjectFactory.dropdown().then( function( result ) {
                $this.projects = result;
                // selected project
                if ( $this.filters.project_id ) {
                    $this.selected_project = $filter( 'filter' )( $this.projects, { id : $this.filters.project_id } );
                }
            } )
        }


        /**
         * DropDown roles
         */
        var getRoles = function() {
            UserFactory.getRoles().then( function() {
                $this.roles = UserFactory.roles;

                // selected project
                if ( $this.filters.role_id ) {
                    $this.selected_role = $filter( 'filter' )( $this.roles, function( value, index ) {
                        return value.Role.id == $this.filters.role_id ? value.Role.text : null;
                    } );

                }
            } );
        }



        /**
         * Delete row
         * @returns {undefined}
         */
        function  deleteRow( id ) {
            var promise = UserFactory.delete( id );
            promise.then( deleteSuccess, error );
        }


        /**
         * Delete success - vymaze zaznam z DB a z pola this.users
         * @param object data - data  (Id vymazaneho)
         * @returns {undefined}
         */
        function deleteSuccess( data ) {
            $timeout( function() {
                angular.forEach( $this.users, function( value, i ) {
                    if ( value.User.id == data.data.id ) {
                        $this.users.splice( i, 1 );
                    }
                } );
            }, 400 );
        }
        ;


        /**
         * Handle request error
         * @param {type} error
         * @returns {undefined}
         */
        var error = function( error ) {

        };


    }
    ;

})();




