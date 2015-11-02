/*
 *
 * Translation Factory
 *
 */


'user strict';
(function() {

    angular.module( 'global.factories' )
            .factory( 'TranslateFactory', TranslateFactory );

    TranslateFactory.$inject = ['langConst', '$translate', '$filter', "$rootScope", '$translateLocalStorage', 'timeAgo'];

    function TranslateFactory( langConst, $translate, $filter, $rootScope, $translateLocalStorage, timeAgo ) {

        var factory = {
            getDefault : getDefault,
            getLang : getLang,
            getUserLang : getUserLang,
            changeLang : changeLang,
            translate : translate,
            timeAgoSettings : timeAgoSettings
        };

        return factory;

        //////////////////////////////

        /**
         * Get users default language
         * @returns {_L9.TranslateFactory.getDefault.defaultLang}
         */
        function getDefault() {
            var localLang = $translateLocalStorage.get();
            var defaultLang = $filter( 'filter' )( langConst.languages, { code : localLang ? localLang : langConst.default } );
            return defaultLang[0];
        }

        /**
         * Get local storage lang
         * @returns {unresolved}
         */
        function getLang() {
            return  $translateLocalStorage.get();
        }

        /**
         * Get user selected local storage lang
         * @returns {unresolved}
         */
        function getUserLang() {
            return localStorage.USER_LANG;
        }

        /**
         * Set User lang
         * @param {type} $lang
         * @returns {undefined}
         */
        function setUserLang( $lang ) {
            localStorage.setItem( 'USER_LANG', $lang );
        }
        /**
         * Change language
         * @param {type} $lang
         * @returns {undefined}
         */
        function changeLang( $lang ) {
            $translate.use( $lang );
            setUserLang( $lang );
            $rootScope.$broadcast( "lang-change", $lang );
        }

        /**
         * Translate
         * @param {type} $string
         * @returns {unresolved}
         */
        function translate( $string ) {
            return $translate( $string );
        }


        /**
         * Time ago settings
         * @returns {undefined}
         */
        function timeAgoSettings() {
            timeAgo.settings.strings = {
                'eng' : {
                    prefixAgo : null,
                    prefixFromNow : null,
                    suffixAgo : 'ago',
                    suffixFromNow : 'from now',
                    seconds : 'less than a minute',
                    minute : 'about a minute',
                    minutes : '%d minutes',
                    hour : 'about an hour',
                    hours : 'about %d hours',
                    day : 'a day',
                    days : '%d days',
                    month : 'about a month',
                    months : '%d months',
                    year : 'about a year',
                    years : '%d years',
                    numbers : []
                },
                'slo' : {
                    prefixAgo : 'pred',
                    prefixFromNow : null,
                    suffixAgo : null,
                    suffixFromNow : 'od teraz',
                    seconds : 'menej ako minútov',
                    minute : 'minútou',
                    minutes : '%d minútami',
                    hour : 'hodinou',
                    hours : '%d hodinami',
                    day : 'deňom',
                    days : '%d dňami',
                    month : 'mesiacom',
                    months : '%d mmesiacmi',
                    year : 'rokom',
                    years : '%d rokmi',
                    numbers : []
                }
            }
        }

    }

})();