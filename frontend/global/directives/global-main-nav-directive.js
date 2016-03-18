/**
 * Main NAV Directive
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {
    angular.module( 'global.directives' ).
            directive( 'mainNav', mainNav );


    mainNav.$inject = ['ApiConst', '$location', '$timeout', '$rootScope', 'UserService', 'UserFactory',
        'AuthService', '$modal', '$ocLazyLoad', 'langConst', 'TranslateFactory'];

    function mainNav( ApiConst, $location, $timeout, $rootScope, UserService, UserFactory,
            AuthService, $modal, $ocLazyLoad, langConst, TranslateFactory ) {

        var tmpl_url = ApiConst.tpl;

        return {
            scope : { },
            restrict : 'E',
            templateUrl : tmpl_url + "/navigation.json",
            link : function( scope, element, attr ) {

                scope.open_notification = false;
                scope.notifications = 0;
                scope.userData = { };
                scope.allow_language = langConst.allow();
                scope.languages = langConst.languages;
                scope.language = TranslateFactory.getDefault();

                scope.selectLanguage = function( $lang ) {
                    scope.language = $lang;
                    TranslateFactory.changeLang( $lang.code );
                };



                UserService.getUserData().then( function( resp ) {
                    scope.userData = resp;
                } );

                scope.Logout = function( $event ) {
                    $event.preventDefault();
                    var promise = AuthService.logout();
                    promise.then( function() {
                        $location.path( "/" );
                    } );
                };

                scope.showNotifications = function( $event ) {
                    $event.preventDefault();
                    scope.open_notification = scope.open_notification ? false : true;
                }


                $rootScope.$on( 'userCommentReact:load', function( event, response ) {
                    scope.notifications = response.length;
                    if ( !scope.notifications ) {
                        $timeout( function() {
                            scope.open_notification = scope.open_notification ? true : false;
                        }, 2000 )
                    }
                } );


                $rootScope.$on( 'pictogram_change', function( event, data ) {
                    scope.userData.pictogram_id = data;
                } );

                /**
                 * password change open modal
                 * @param {type} $event
                 * @returns {undefined}
                 */
                scope.changePassword = function( $event ) {
                    $event.preventDefault();

                    $modal.open( {
                        templateUrl : 'js/modal/templates/change-password-modal.html',
                        controller : "changePasswordCtrl"
                    } );

                };

                /**
                 * Pictogram change modal
                 * @param {type} $event
                 * @returns {undefined}
                 */
                scope.pictogram = function( $event ) {
                    $event.preventDefault();
                    $modal.open( {
                        templateUrl : 'js/modal/templates/pictogram-modal.html',
                        resolve : {
                            userData : function() {
                                return  scope.userData
                            }
                        },
                        controller : "pictogramCtrl"
                    } );
                };

                /**
                 * Add New project
                 * @returns {undefined}
                 */
                scope.addProject = function( $event ) {

                    $event.preventDefault();
                    $modal.open( {
                        templateUrl : 'js/modal/templates/add-project-modal.html',
                        controller : "addProjectCtrl"
                    } );

                };


            }
        }

    }

})();