/*
 * HTTP Provider config
 */

'use strict';
(function() {
    angular.module( 'forum' )
            .config( function( $httpProvider ) {
                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
                $httpProvider.interceptors.push( 'authInterceptor' );
            } )

            .config( function( $sceDelegateProvider ) {
                $sceDelegateProvider.resourceUrlWhitelist( [
                    // Allow same origin resource loads.
                    'self',
                    // Allow loading from our assets domain.  Notice the difference between * and **.
                    'http://youtube.com/**',
                    'http://www.youtube.com/**',
                    'http://youtube.com/**'
                ] );

            } );

})();