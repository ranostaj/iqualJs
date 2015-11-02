/*
 * User Factory
 *
 */

"use strict";
(function() {

    angular.module( 'user.factories' )
            .factory( 'UserFactory', UserFactory );

    UserFactory.$inject = ['$http', 'UserService'];

    function UserFactory( $http, UserService ) {

        var factory = {
            data : [],
            roles : [],
            total : 0,
            changePassword : changePassword,
            save : save,
            delete : deleteItem,
            register : register,
            list : list,
            getRoles : getRoles,
            view : view,
            validate : validate,
            forgot : forgot,
            deleteFromProject : deleteFromProject,
            deleteFromTheme : deleteFromTheme,
            getPage : getPage,
            themes : themes

        };

        return factory;
        ///////////////////


        /**
         * Data for table
         * @param {type} start
         * @param {type} number
         * @param {type} params
         * @returns {unresolved}
         */
        function getPage( start, number, params, filter_data ) {

            var tableParams = params.search.predicateObject ? params.search.predicateObject : { };
            var params = angular.extend( { limit : number, offset : start }, tableParams, filter_data );
            return UserService.list( params ).
                    then( function( response ) {
                        factory.data = response.data.rows;
                        factory.total = response.data.total;


                        return  {
                            data : factory.data,
                            total : factory.total,
                            numberOfPages : Math.ceil( factory.total / number )
                        };

                    } );
        }
        ;



        /**
         * User themes list
         * @param {type} start
         * @param {type} number
         * @param {type} params
         * @returns {unresolved}
         */
        function themes( start, number, params, filter_data ) {

            var tableParams = params.search.predicateObject ? params.search.predicateObject : { };
            var params = angular.extend( { limit : number, offset : start }, tableParams, filter_data );
            return UserService.themes( params ).
                    then( function( response ) {
                        factory.data = response.data.rows;
                        factory.total = response.data.total;


                        return  {
                            data : factory.data,
                            total : factory.total,
                            numberOfPages : Math.ceil( factory.total / number )
                        };

                    } );
        }
        ;

        /**
         * Change password
         * @param {type} data
         * @returns {unresolved}
         */
        function changePassword( data ) {
            return UserService.passwordSave( data );
        }
        ;


        /**
         * Save user
         * @param {type} data
         * @returns {unresolved}
         */
        function save( data ) {
            return UserService.save( data );
        }
        ;


        /**
         * Register user
         * @param {type} data
         * @returns {unresolved}
         */
        function register( data ) {
            return UserService.register( data );
        }
        ;



        /**
         * Delete user
         * @param {type} data
         * @returns {unresolved}
         */
        function deleteItem( data ) {
            return UserService.delete( data );
        }
        ;

        /**
         * Users list
         * @param {type} data
         * @returns {undefined}
         */
        function list( data ) {
            return UserService.list( data ).then( function( response ) {
                factory.data = response.data.rows;
            } );
        }
        ;

        /**
         * Roles list
         * @returns {undefined}
         */
        function getRoles() {
            return UserService.roles().then( function( response ) {
                response.data.rows.unshift( {
                    Role : { id : null, text : "ALL" }
                } );
                factory.roles = response.data.rows;
            } );
        }
        ;


        /**
         * validate user data
         * @param {type} data
         * @returns {unresolved}
         */
        function validate( data ) {
            return UserService.validate( data ).then( function( response ) {
                factory.data = response.data;
            } );
        }

        /**
         * View user data
         * @param {type} data
         * @returns {unresolved}
         */
        function view( data ) {
            return UserService.find( data ).then( function( response ) {
                factory.data = response.data;
            } );
        }

        /**
         * Forgot password
         * @param {type} data
         * @returns {unresolved}
         */
        function forgot( data ) {
            return UserService.forgot( data );
        }

        /**
         * Vymazanie z projektu
         * @param {type} data = {user:id, project:id}
         * @returns {unresolved}
         */
        function deleteFromProject( data ) {
            return UserService.deleteFromProject( data );
        }

        /**
         * Vymazanie z temy
         * @param {type} data = {user:id, theme:id}
         * @returns {unresolved}
         */
        function deleteFromTheme( data ) {
            return UserService.deleteFromTheme( data );
        }



    }
    ;

}());
