/**
 * User Service
 * @returns {undefined}
 */
"use strict";
(function() {

    angular.module( 'user.services' )
            .service( "UserService", UserService );

    UserService.$inject = ['$q', '$http', '$rootScope', 'ApiConst'];
    function UserService( $q, $http, $rootScope, ApiConst ) {

        this.api = ApiConst.url;


        /**
         * List users
         * @param {type} param
         * @returns {unresolved}
         */
        this.list = function( param ) {
            return $http.get( this.api + '/users', { params : param } );
        };

        /**
         * List user themes
         * @param {type} id user id
         * @returns {unresolved}
         */
        this.themes = function( params ) {
            var user_id = params.user_id;
            delete params.user_id;
            return $http.get( this.api + '/users/' + user_id + '/themes', { params : params } );
        };

        /**
         * Get Logged user data
         * @returns {$q call;defer.promise}
         */
        this.getUserData = function() {
            var $this = this;
            if ( localStorage.user && localStorage.user !== 'undefined' ) {
                var deferred = $q.defer();
                deferred.resolve( { user : JSON.parse( localStorage.user ), role : localStorage.role } );
                return deferred.promise;
            } else {
                return $this.find().then( function( response ) {
                    localStorage.setItem( 'user', JSON.stringify( response.data.User ) );
                    localStorage.setItem( 'role', response.data.Role.name );
                    return {
                        user : response.data.User,
                        role : response.data.Role.name
                    };
                } );

            }
        };

        /**
         * User not in theme but in project
         * @param {type} theme_id
         * @returns {unresolved}
         */
        this.notInTheme = function( theme_id ) {
            return $http.get( this.api + '/themes/users/exclude/'+theme_id );
        };

        /**
         * List of all roles
         * @returns promise
         */
        this.roles = function() {
            return $http.get( this.api + '/users/roles' );
        };


        /**
         * Find single user
         * @param {object} user user object {id:1,name:"meno"}
         * @returns promise
         */
        this.find = function( user ) {
            return $http.get( this.api + '/users/view', { params : user } );
        };


        /**
         * Validate single user
         * @param {object} user user object {id:1,name:"meno"}
         * @returns promise
         */
        this.validate = function( user ) {
            return $http.get( this.api + '/users/valid', { params : user } );
        };

        /**
         * Save User data
         * @param {type} data
         * @returns promise
         */
        this.save = function( data ) {
            return $http.post( this.api + '/users/save', { data : data } );
        };

        /**
         * Register User data
         * @param {type} data
         * @returns promise
         */
        this.register = function( data ) {
            return $http.post( this.api + '/login/register', { data : data } );
        };

        /**
         * Save User password
         * @param {type} data
         * @returns promise
         */
        this.passwordSave = function( data ) {
            return $http.post( this.api + '/users/password.json', { data : data } );
        };

        /**
         * Delete single user
         * @param {object} user user object {id:1,name:"meno"}
         * @returns promise
         */
        this.delete = function( id ) {
            return $http.delete( this.api + '/users/delete', { params : { id : id } } );
        };


        /**
         * Delete user from project
         * @param {type} data
         * @returns {undefined}
         */
        this.deleteFromProject = function( data ) {
            return $http.post( this.api + '/users/deleteproject/', data );
        };



        /**
         * Delete user from theme
         * @param {type} data {user: user_id, theme:theme_id}
         * @returns {undefined}
         */
        this.deleteFromTheme = function( data ) {
            return $http.post( this.api + '/users/deleteFromTheme/', data );
        };


        /**
         * Send users email
         * @param {type} data
         * @returns {undefined}
         */
        this.sendMail = function( data ) {
            return $http.post( this.api + '/users/mail/', data );
        }

    }
    ;


})();