/**
 * Global constants
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module( "forum" )
        .constant( 'BaseConst',
                {
                    url : /172.24.64.33|localhost/.test( window.location.host ) ? '/iqual' : '',
                    enviroment : function() {
                        var enviroment = 'live';

                        if ( /172.24.64.33|localhost/.test( window.location.host )) {
                            enviroment = 'devel';
                        }
                        if ( /^demo/.test( window.location.host ) ) {
                            enviroment = 'demo';
                        }

                        return enviroment;
                    }
                }
        )
        .constant( 'ApiConst',
                {
                    url : /172.24.64.33|localhost/.test( window.location.host ) ? '/iqual/api' : '/api',
                    tpl : /172.24.64.33|localhost/.test( window.location.host ) ? '/iqual/api/templates' : '/api/templates' }
        )

        .constant( 'langConst', {
            /**
             * System languages
             */
            languages : [
                { name : 'Slovak', code : 'slo' },
                { name : 'English', code : 'eng' }
            ],
            /**
             * Allow language change
             * @returns {Array.allow.allow|Boolean}
             */
            allow : function() {
                var allow = false;
                if ( /172.24.64.33|localhost/.test( window.location.host ) ) {
                    allow = true;
                }
                if ( /^demo/.test( window.location.host ) ) {
                    allow = true;
                }
                return allow;
            },
            /**
             * Default language
             */
            'default' : 'slo'

        } );
