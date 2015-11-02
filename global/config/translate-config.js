/*
 * Translate config
 */

'use strict';
(function() {
    angular.module( 'forum' )
            .config( function( $translateProvider, langConst, BaseConst ) {

                $translateProvider.useStaticFilesLoader( {
                    prefix : BaseConst.url + '/lang/',
                    suffix : '.json'
                } );

                $translateProvider.preferredLanguage( langConst.default );
                $translateProvider.useLocalStorage();

            } );

})();