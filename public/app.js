/**
 *
 *
 */

/**
 *  Global Module
 */
//
angular.module( "global.directives", [] );
angular.module( "global.config", [] );
angular.module( "global.factories", [] );
angular.module( "global.controllers", [] );
angular.module( 'forum.global', ["global.config", "global.directives", 'global.factories', 'global.controllers'] );


/**
 * User Module
 */
angular.module( "user.services", [] );
angular.module( "user.factories", [] );
angular.module( "user.directives", [] );
angular.module( "user.controllers", [] );
angular.module( "forum.user", ['user.controllers', 'user.services', "user.factories", "user.directives"] );


/**
 * Theme module
 */


angular.module( "theme.services", [] );
angular.module( "theme.factories", [] );
angular.module( "theme.directives", [] );
angular.module( "theme.controllers", [] );
angular.module( "forum.theme", ['ui.bootstrap', 'yaru22.angular-timeago', 'angularFileUpload', 'pascalprecht.translate', 'ngCookies', 'theme.controllers', "theme.factories", 'theme.services', 'theme.directives'] );


angular.module( "forum", ['forum.global', "forum.theme", "forum.user"] )

        .factory( 'authInterceptor', ['$q', '$location', '$rootScope', '$log', '$timeout', 'TranslateFactory', function( $q, $location, $rootScope, $log, $timeout, TranslateFactory ) {

                return {
                    request : function( config ) {

                        config.headers = config.headers || { }
                        var token;

                        var language = TranslateFactory.getDefault();
                        if ( localStorage.token ) {
                            token = localStorage.token;
                        }

                        if ( token ) {
                            config.headers.Authorization = 'Bearer ' + token;
                        }

                        config.headers.lang = language.code;
                        return config;
                    }
                }
            }] )

        /**
         * HTTP Provider
         */
        .config( function( $httpProvider ) {
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            $httpProvider.interceptors.push( 'authInterceptor' );
        } )

        /**
         * Translate
         * @param {type} $translateProvider
         * @param {type} langConst
         * @param {type} BaseConst
         * @returns {undefined}
         */
        .config( function( $translateProvider, langConst, BaseConst ) {

            $translateProvider.useStaticFilesLoader( {
                prefix : BaseConst.url + '/lang/',
                suffix : '.json'
            } );


            var pathArray = window.location.pathname.split( '/' );
            $translateProvider.preferredLanguage( 'slo' );
            angular.forEach( pathArray, function( elem, i ) {
                angular.forEach( langConst.languages, function( lang, i ) {
                    if ( lang.code === elem ) {
                        $translateProvider.preferredLanguage( elem );
                    }
                } );

            } );

            $translateProvider.useLocalStorage();

        } )
        .run( ['$rootScope', '$location', 'TranslateFactory',
            function( $rootScope, $location, TranslateFactory ) {
                TranslateFactory.timeAgoSettings();
            }] );
;






