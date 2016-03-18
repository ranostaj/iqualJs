angular.module( 'forum.core', [
    "ngRoute",
    'ui.router',
    'textAngular',
    'ngCookies',
    'angular-loading-bar',
    'ui.bootstrap',
    'yaru22.angular-timeago',
    'oc.lazyLoad',
    'angularFileUpload',
    'pascalprecht.translate',
    'smart-table'
] );


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
 * Home Module
 */
angular.module( "home.controllers", [] );
angular.module( "forum.home", ['home.controllers'] );






/**
 * User Module
 */
angular.module( "user.services", [] );
angular.module( "user.factories", ["user.services"] );
angular.module( "user.directives", [] );
angular.module( "user.controllers", [] );
angular.module( "forum.user", ['user.controllers', 'user.services', "user.factories", "user.directives"] );


/**
 * Project Module
 */
angular.module( "project.services", [] );
angular.module( "project.directives", [] );
angular.module( "project.factories", ["project.services"] );
angular.module( "project.controllers", [] );
angular.module( "forum.project", ['project.controllers', 'project.factories', "project.services", "project.directives"] );


/**
 * Theme module
 */


angular.module( "theme.services", ['angularFileUpload'] );
angular.module( "theme.factories", ['angularFileUpload', "theme.services"] );
angular.module( "theme.directives", ['ui.select2'] );
angular.module( "theme.controllers", [] );
angular.module( "forum.theme", ['theme.controllers', "theme.factories", 'theme.services', 'theme.directives'] );

angular.module( "forum", ['forum.core', 'forum.home', 'forum.global', 'forum.project', 'forum.user', 'forum.theme'] );





