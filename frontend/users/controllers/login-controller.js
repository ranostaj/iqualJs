/**
 * Login controller
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'user.controllers' )
            .controller( 'LoginController', LoginController );


    LoginController.$inject = ['$scope', '$location', '$rootScope', '$modal', 'AuthService', 'langConst', 'TranslateFactory', 'BaseConst'];
    function LoginController( $scope, $location, $rootScope, $modal, AuthService, langConst, TranslateFactory, BaseConst ) {

        $scope.loginError = false;
        $scope.show_form = true;
        $scope.accounts = [];
        $scope.Login = { };

        $rootScope.$on( "lang-change", function() {
            $scope.show_form = true;
        } );


        if ( localStorage.accounts !== undefined ) {
            $scope.accounts = localStorage.accounts.split( ';' );
            ;
        }

        /**
         * Select user account
         * @param {type} $index
         * @param {type} $account
         * @returns {undefined}
         */
        $scope.selectUser = function( $account ) {
            $scope.accounts.length = 0;
            $scope.accounts.push( $account );
        };


        /**
         * Remove user
         * @param {type} $account
         * @returns {undefined}
         */
        $scope.removeUser = function( $index, $account ) {
            $scope.accounts.splice( $index, 1 );
        };

        /**
         * Select language first
         */

        if ( !TranslateFactory.getUserLang() && BaseConst.enviroment() !== 'live' ) {
            $scope.show_form = false;
            openModal();
        }


        /**
         * Chose language first
         * @returns {undefined}
         */

        function openModal() {
            $modal.open( {
                templateUrl : 'js/modal/templates/chose-lang-modal.html',
                size : 'sm',
                backdrop : 'static',
                controller : ['$scope', 'langConst', '$modalInstance', '$timeout', function( $scope, langConst, $modalInstance, $timeout ) {
                        $scope.languages = langConst.languages;

                        $scope.selectLanguage = function( $lang ) {
                            $modalInstance.dismiss( 'cancel' );
                            $timeout( function() {
                                TranslateFactory.changeLang( $lang.code );
                            }, 300 );
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss( 'cancel' );
                        }
                    }]
            } );
        }


        /**
         * Login action
         * @returns {undefined}
         */
        $scope.UserLogin = function() {
            var username = $scope.accounts.length === 1 ? $scope.accounts[0] : $scope.Login.username;
            var data = {
                username : username,
                password : $scope.Login.password,
                remember : $scope.Login.remember
            }
            var promise = AuthService.login( data );
            promise.then( success, error );
        };

        $scope.forgot = function() {
            $modal.open( {
                templateUrl : 'js/modal/templates/forgot-modal.html',
                controller : 'UserForgotModalCtrl as ctrl',
            } );
        };

        var success = function( response ) {
            saveLocalData( response.data );
            $location.path( '/' + response.data.role );
        };



        var error = function( response ) {
            $scope.loginError = response.data.message;
        };


        var saveLocalData = function( data ) {
            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'role', data.role );
            localStorage.setItem( 'user', JSON.stringify( data.user ) );
            saveBrowserAccount( data.user.username );
        };


        /**
         * Save browser accounts info
         * @param {type} $account
         * @returns {undefined}
         */
        var saveBrowserAccount = function( $account ) {

            var accounts = localStorage.accounts;
            var items = [];
            if ( accounts !== undefined ) {
                items = accounts.split( ';' );
                for ( var i = 0; i <= items.length; i++ ) {
                    if ( items[i] === $account ) {
                        items.splice( i, 1 );
                    }
                }
            }

            items.push( $account );
            localStorage.setItem( 'accounts', items.join( items.length > 1 ? ';' : '' ) );

        }


    }




})();