/*
 *
 * @desc Auth interceptor factory
 *
 */


'user strict';
(function() {

    angular.module( 'global.factories' )
            .factory( 'authInterceptor', authInterceptor );

    authInterceptor.$inject = ['$q', '$location', '$rootScope', '$log', '$timeout', 'TranslateFactory'];

    function authInterceptor( $q, $location, $rootScope, $log, $timeout, TranslateFactory ) {

        var factory = {
            request : request,
            responseError : responseError,
            response : response

        };

        return factory;

        //////////////////////////////


        /**
         * Request
         * @param {type} config
         * @returns {unresolved}
         */
        function request( config ) {



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
        ;


        /**
         * Response Error
         * @param {type} response
         * @returns {unresolved}
         */
        function responseError( response ) {

            if ( response.status == 403 ) {
                localStorage.token = '';
                localStorage.role = '';
                localStorage.user = '';
                $location.path( '/' )
                $rootScope.$broadcast( "notification", { "type" : "danger", "text" : response.data.message } );
            }

            if ( response.status == 401 ) {
                $location.path( '/' + localStorage.role );
            }

            if ( response.status == 500 ) {
                $rootScope.$broadcast( "notification", { "type" : "danger", "text" : response.data.message } );
            }

            return $q.reject( response );

        }
        ;

        /**
         * Response
         * @param {type} response
         * @returns {unresolved}
         */
        function response( response ) {

            if ( response.status === 200 && response.data.message && response.data.show_message ) {
                $rootScope.$broadcast( "notification", { "type" : "success", "text" : response.data.message } );
            }


            if ( $location.path() == '/' && localStorage.token && localStorage.token != 'undefined' )
                $location.path( '/' + localStorage.role );

            return response;
        }
    }


})()