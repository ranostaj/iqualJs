/**
 * Public controllers
 * @param {type} param1
 * @param {type} param2
 */

angular.module( 'forum' ).controller( 'PublicController', ['$scope', '$location', '$modal', '$timeout', 'AuthService', 'CommentFactory', 'langConst',
    'TranslateFactory',
    function( $scope, $location, $modal, $timeout, AuthService, CommentFactory, langConst, TranslateFactory ) {

        $scope.answered = false;
        $scope.languages = langConst.languages;
        $scope.language = TranslateFactory.getDefault();


        AuthService.isAuthorized().error( function( error ) {
            var modalInstance = $modal.open( {
                templateUrl : 'myModalContent.html',
                controller : LoginController,
                size : 'md',
                backdrop : 'static'
            } );
        } );



        $scope.FormData = { }

        /**
         * Save comment
         * @param {type} $event
         * @returns {undefined}
         */
        $scope.saveComment = function( $event ) {
            $event.preventDefault();
            CommentFactory.saveReaction( { 'Comment' : $scope.FormData, notify : 1 } ).then( function( response ) {
                $scope.answered = true;
            } );

        };


        $scope.Logout = function( $event ) {
            $event.preventDefault();
            var promise = AuthService.logout();
            promise.then( function() {
                window.location.reload();
            } );
        };

        /**
         * Lang change
         * @param {type} $lang
         * @returns {undefined}
         */
        $scope.selectLanguage = function( $lang ) {
            $scope.language = $lang;
            TranslateFactory.changeLang( $lang.code );
        };

        /**
         * Login Modal
         * @param {type} $scope
         * @param {type} $location
         * @param {type} $rootScope
         * @param {type} AuthService
         * @param {type} $modalInstance
         * @returns {undefined}
         */
        var LoginController = function( $scope, $location, $rootScope, AuthService, $modalInstance ) {

            $scope.Login = { }
            /**
             * Login action
             * @returns {undefined}
             */
            $scope.UserLogin = function( $event ) {
                $event.preventDefault();
                var promise = AuthService.login( $scope.Login );
                promise.then( success, error );
            }


            var success = function( response ) {
                saveLocalData( response.data );
                $modalInstance.dismiss( 'cancel' );
            };

            $modalInstance.result.then( function() {
            }, function() {
                window.location.reload();
            } );

            var error = function( response ) {
                $scope.loginError = response.data.message
            };



            var saveLocalData = function( data ) {
                localStorage.setItem( 'token', data.token );
                localStorage.setItem( 'role', data.role );
                localStorage.setItem( 'user', JSON.stringify( data.user ) );
            };


        }

    }] );

