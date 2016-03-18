/**
 * Route change
 * @param {type} param
 */
'use strict';
(function() {
    angular.module( 'forum' ).run( ['$rootScope', '$route', '$location', 'TranslateFactory',
        function( $rootScope, $route, $location, TranslateFactory ) {

            $rootScope.$on( "$stateChangeStart", function( event, next, current ) {

                $rootScope.role = localStorage.role;

                // Roles based access
                if ( next.data.roles.indexOf( localStorage.role ) == -1 ) {
                    // return user to homepage
                    $location.path( '/' + localStorage.role );
                }

                if ( !localStorage.token || localStorage.token == 'undefined' ) {
                    $location.path( '/' );
                } else if ( localStorage.token && $location.path() == '/' ) {
                    $location.path( '/' + localStorage.role );
                }
            } );

            TranslateFactory.timeAgoSettings();


        }] );
})();

