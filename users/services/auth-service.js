/**
 * Auth Service
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'user.services' )
            .service( "AuthService", AuthService );

    AuthService.$inject = ['$q', '$http', '$rootScope', 'ApiConst'];


    function AuthService( $q, $http, $rootScope, ApiConst ) {
        this.api = ApiConst.url;



        /**
         * Login action
         * @returns {undefined}
         */
        this.login = function( user ) {
            return $http.post( this.api + '/login', user );
        };


        /**
         * Forgot user pass
         * @param obj username
         * @returns {unresolved}
         */
        this.forgot = function( username ) {
            return $http.post( this.api + '/login/forgot', username );
        };


        /**
         * Logout action
         * @returns {undefined}
         */
        this.logout = function() {
            var $this = this;
            return $http.get( this.api + '/login/logout' ).success( function( response ) {
                $this.clearUser();
            } );
        };

        this.isAuthorized = function() {
            return $http.post( this.api + '/auth', { token : localStorage.token } );
        }

        /**
         * Clear User data
         * @returns {undefined}
         */
        this.clearUser = function() {
            localStorage.token = '';
            localStorage.role = '';
            localStorage.user = '';
        }

    }




})();