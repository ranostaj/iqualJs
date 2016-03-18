/**
 *  APP Router
 *
 *
 */
angular.module( 'forum' ).config( ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ) {


        var HomeController = {
            name : 'home.controllers',
            files : [
                'js/home/controllers/home-controller.js'
            ]
        }

        $stateProvider.
                state( 'login', {
                    url : "/",
                    controller : "LoginController",
                    templateUrl : "js/users/templates/login.html",
                    data : {
                        roles : []
                    }

                } ).
                /**
                 * Admin routes
                 */
                state( 'admin', {
                    abstract : true,
                    templateUrl : 'js/layouts/default.html',
                    data : {
                        roles : ['admin']
                    }
                } ).state( 'admin.home', {
            url : "/admin",
            controller : "HomeController as home",
            templateUrl : 'js/home/templates/admin-home.html',
            resolve : {
                scriptsLoad : function( $ocLazyLoad ) {

                    return $ocLazyLoad.load( [
                        {
                            name : 'home.controllers',
                            files : [
                                'js/home/controllers/home-controller.js'
                            ]
                        }

                    ] );
                }
            },
            data : {
                roles : ['admin']
            }
        } ).
                state( 'admin.project', {
                    url : "/admin/project",
                    controller : "ProjectController",
                    templateUrl : 'js/projects/templates/list-project.html',
                    data : {
                        roles : ['admin']
                    }
                } ).
                state( 'admin.project.view', {
                    url : "/view/:id",
                    controller : "ProjectController",
                    templateUrl : 'js/projects/templates/add-project.html',
                    data : {
                        roles : ['admin']
                    }
                } ).
                state( 'admin.theme', {
                    url : "/admin/theme",
                    controller : "ThemeController",
                    templateUrl : 'js/themes/templates/list-theme.html',
                    data : {
                        roles : ['admin']
                    }
                } ).
                state( 'admin.theme.add', {
                    url : "/add",
                    controller : "ThemeController as theme",
                    templateUrl : 'js/themes/templates/add-theme.html',
                    data : {
                        roles : ['admin']
                    }
                } ).state( 'admin.theme.view', {
            url : "/view/:id",
            controller : "ThemeController as theme",
            templateUrl : 'js/themes/templates/add-theme.html',
            data : {
                roles : ['admin']
            }
        } ).state( 'admin.user', {
            url : '/admin/user',
            controller : 'UserController as userCtrl',
            templateUrl : 'js/users/templates/list-users.html'
        } )

                // Theme room
                .state( 'theme', {
                    abstract : true,
                    templateUrl : 'js/layouts/theme.html',
                    resolve : {
                        scriptsLoad : function( $ocLazyLoad ) {

                            return $ocLazyLoad.load( [
                                {
                                    serie : true,
                                    files : [
                                        'js/vendor/spin.min.js',
                                        'js/vendor/ladda.min.js',
                                    ]
                                }, {
                                    insertBefore : '#load_css_before',
                                    files : ['css/ladda.min.css']
                                }

                            ] );
                        }
                    },
                    data : {
                        roles : ['admin']
                    }
                } )
                .state( 'theme.view', {
                    url : "/theme/view/:id",
                    controller : "ThemeDisplayController as theme",
                    templateUrl : 'js/themes/templates/display-theme.html',
                    resolve : {
                        themeId : ['$stateParams', function( $stateParams ) {
                                return $stateParams.id;
                            }]

                    },
                    data : {
                        roles : ['admin', 'user', 'client']
                    }
                } ).
                /**
                 * User routes
                 */
                state( 'user', {
                    abstract : true,
                    templateUrl : 'js/layouts/default.html',
                    resolve : {
                        scriptsLoad : function( $ocLazyLoad ) {

                            return $ocLazyLoad.load( [
                                {
                                    name : 'home.controllers',
                                    files : [
                                        'js/home/controllers/home-controller.js'
                                    ]
                                },
                                {
                                    serie : true,
                                    files : [
                                        'js/vendor/spin.min.js',
                                        'js/vendor/ladda.min.js'
                                    ]
                                }, {
                                    insertBefore : '#load_css_before',
                                    files : ['css/ladda.min.css']
                                }
                            ] );
                        }
                    },
                    data : {
                        roles : ['user']
                    }
                } ).state( 'user.home', {
            url : "/user",
            controller : "HomeController as home",
            templateUrl : 'js/home/templates/user-home.html',
            data : {
                roles : ['user']
            }
        } ).
                /**
                 * Client routes
                 */
                state( 'client', {
                    abstract : true,
                    templateUrl : 'js/layouts/default.html',
                    resolve : {
                        scriptsLoad : function( $ocLazyLoad ) {

                            return $ocLazyLoad.load( [
                                {
                                    serie : true,
                                    files : [
                                        'js/vendor/spin.min.js',
                                        'js/vendor/ladda.min.js'
                                    ]
                                }, {
                                    insertBefore : '#load_css_before',
                                    files : ['css/ladda.min.css']
                                }
                            ] );
                        }
                    },
                    data : {
                        roles : ['client']
                    }
                } ).state( 'client.home', {
            url : "/client",
            controller : "HomeController as home",
            templateUrl : 'js/home/templates/client-home.html',
            resolve : {
                scriptsLoad : function( $ocLazyLoad ) {
                    return $ocLazyLoad.load( [
                        HomeController
                    ] );
                }
            },
            data : {
                roles : ['client']
            }
        } );


        $urlRouterProvider.otherwise( '/' );
    }] );
