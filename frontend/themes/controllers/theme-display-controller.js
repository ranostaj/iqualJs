/**
 * Display theme room controller
 * @returns {undefined}
 */

(function() {
    "use strict";
    angular.module( 'theme.controllers' )
            .controller( 'ThemeDisplayController', ThemeDisplayController );


    ThemeDisplayController.$inject = ['$scope',
        '$timeout',
        '$rootScope',
        '$location',
        '$route',
        'CommentService',
        '$modal',
        'ThemeService',
        'ThemeFactory',
        'UserService',
        'UserFactory',
        'ProjectFactory',
        '$q',
        '$interval',
        '$cookieStore',
        '$filter',
        '$stateParams',
        'themeId'];


    function ThemeDisplayController(
            $scope,
            $timeout,
            $rootScope,
            $location,
            $route,
            CommentService,
            $modal,
            ThemeService,
            ThemeFactory,
            UserService,
            UserFactory,
            ProjectFactory,
            $q,
            $interval,
            $cookieStore,
            $filter,
            $stateParams,
            themeId ) {





        var init_comments = 0;
        var new_comments = 0;
        var $this = this;
        var timer;

        this.cookie_sidebar = $cookieStore.get( 'ruller' );


        /**
         * Array selected comments elements
         */
        this.selected_comments = [];
        this.comments = [];
        this.themes_load_params = { };
        /**
         * Selected user data
         */
        this.selected_comment = {
            id : null,
            name : null
        };

        this.theme_more_toggle = true;
        this.full_screen = this.toggle_theme = false;
        $scope.theme_data = { };
        this.form_opened = false;
        this.load_more_counter = 0;

        /**
         * Comments  default setup
         */

        $this.setup = {
            // allowed reply button
            reply : false,
            // add new comment button
            add_comment : false,
            // export theme
            export : false,
        };

        /**
         * Loged User data
         */

        UserService.getUserData().then( function( resp ) {
            $this.user = resp.user;
            $this.user.role = resp.role;


            // config theme setup based on user roles
            switch ($this.user.role) {

                case "admin":
                    $this.setup = {
                        reply : true,
                        add_comment : true,
                        export : true
                    };
                    break;

                case "user":
                    $this.setup = {
                        reply : true,
                        add_comment : true,
                        export : false
                    };
                    break;
            }
        } );




        /**
         * Default filter data
         */
        $scope.filterForm = {
            order : 'newest'
        };



        var getThemeData = function() {
            ThemeService.view( themeId ).then( themeLoadSuccess, themeLoadError )
        };

        /**
         * Theme Load success
         * @param {type} response
         * @returns {undefined}
         */
        var themeLoadSuccess = function( response ) {

            $this.theme = response.data;
            $this.theme.User = $filter( 'filter' )( response.data.User, { role_id : 2 } );

            // load themes list
            ProjectFactory.themes(response.data.Theme.project_id, {active:1}).
                    then( function( response ) {
                        $this.themes = ProjectFactory.data;
                        if ( !ProjectFactory.data && $this.user.role != 'admin' ) {
                            $this.fullScreen( null );
                        }
                    } );
        };

        /**
         * Theme load error
         * @param {type} error
         * @returns {undefined}
         */
        var themeLoadError = function( error ) {
            $rootScope.$broadcast( "notification", { "type" : "danger", "text" : error.message } );
            $location.path( '/' );
        };

        // nastavennie pre vysku boxu
        $scope.$on( '$viewContentLoaded', function( event ) {

            var height = $( window ).height();
            $( '.vbox' ).height( height );
        } );

        // On save new comment
        $scope.$on( 'afterSavedComment', function( event ) {
            loadComments();
        } );

        // On close comment form
        $scope.$on( 'closeCommentForm', function( event ) {
            angular.element( '.forum-footer .comment-item' ).remove();
            angular.element( '.forum-footer #js-theme-info' ).remove();
            $this.form_opened = false;
        } );

        // On Open comment form
        $scope.$on( 'openCommentForm', function( event ) {
            $this.form_opened = true;
        } );

        // change comments order
        $scope.$watch( 'filterForm.order', function( n, o ) {
            loadComments( {
                order : n
            } );
        } );

        //  watch for theme editing event
        $scope.$watch( 'theme_edit', function( n, o ) {
            if ( n )
                $this.theme_more_toggle = n;
        } );

        /**
         * Manualy reload themes list
         * @returns {undefined}
         */
        this.refreshThemes = function() {
            ThemeFactory.getList( $this.themes_load_params ).
                    then( function( response ) {
                        $this.themes = ThemeFactory.data;
                    } );
        }

        /**
         * Save theme data
         * @returns {undefined}
         */
        this.saveTheme = function() {
            var save_data = {
                Theme : { text : $this.theme.Theme.text, id : themeId }
            }

            ThemeFactory.save( save_data );
        }

        /**
         * Reply button (Open reply window)
         * @param id - comment id
         * @param obj User - user object reply to
         */
        this.replyComment = function( id, user ) {

            var extObj = {
                user_reply_id_value : user.id,
                parent_id : id,
                theme : $this.theme
            }

            var elem = angular.element( "#comment-id-" + id ).clone();
            angular.element( '.forum-footer' ).prepend( elem );

            $rootScope.$broadcast( 'openCommentForm', angular.extend( user, extObj ) );
        };




        this.fullScreen = function( event ) {
            angular.element( '#nav' ).toggleClass( 'nav-xs' );
            angular.element( '#aside-bar' ).toggleClass( 'nav-xs' );
            angular.element( '#aside-content' ).toggleClass( 'content-lg' );
            this.full_screen = this.full_screen === false ? true : false;
        }


        /**
         * Toggle theme
         * @param {type} event
         * @returns {undefined}
         */
        this.toggleTheme = function( event ) {
            angular.element( '#aside-theme' ).toggleClass( 'expand' ).css( 'width', '' );
            this.toggle_theme = this.toggle_theme === false ? true : false;
        }

        /**
         * Open comment form
         * @param {type} event
         * @returns {undefined}
         */
        this.addComment = function( event, data, priv ) {

            var args = { };

            if ( typeof data === "object" ) {

                args = angular.extend( {
                    theme : $this.theme,
                    private : priv ? 1 : 0
                }, data, { user_reply_id_value : data.hasOwnProperty( 'id' ) === true ? data.id : 0 } );

            }

            if ( !$this.form_opened ) {
                if ( Object.keys( args ).length === 0 ) {
                    var elem = angular.element( "#js-theme-info" ).clone();
                    angular.element( '.forum-footer' ).prepend( elem );
                }
                $rootScope.$broadcast( 'openCommentForm', args );
            }
        };

        /**
         * Refreshing comments
         * @param {obj} options options object
         * @returns {undefined}
         */
        this.refreshComments = function( options ) {
            $this.new_comments, init_comments = 0;
            loadComments( options );
        };



        /**
         * Export theme
         * @param {type} id
         * @returns {undefined}
         */
        this.export = function( id ) {

            $modal.open( {
                templateUrl : 'js/modal/templates/export-theme-modal.html',
                controller : function( $scope ) {
                    $scope.comments = $this.comments;

                    $scope.selectText = function fnSelect( objId ) {

                        if ( document.selection )
                        {
                            var range = document.body.createTextRange();
                            range.moveToElementText( document.getElementById( objId ) );
                            range.select();
                        }
                        else if ( window.getSelection )
                        {
                            var range = document.createRange();
                            range.selectNode( document.getElementById( objId ) );
                            window.getSelection().addRange( range );
                        }
                        // alert( "Stlačte Ctrl+c pre skopírovanie obsahu" )

                    };

                },
                size : 'lg'

            } );

        };

        /**
         * Cancel selection
         * @param {type} id
         * @returns {undefined}
         */
        this.deSelectComments = function( id ) {
            $this.selected_comment = { };
            var element = angular.element( '.comment-user-' + id );
            angular.forEach( element, function( elem, i ) {

                angular.element( elem ).removeClass( "comment-selected" );
                $this.selected_comments.splice( i, 1 );
            } );
        };

        /**
         * Selecting comments
         * @param int user id
         * @returns {undefined}
         */
        this.selectComments = function( id, name ) {

            // empty selected comment
            $this.selected_comments = [];

            $this.selected_comments = angular.element( '.comment-user-' + id );

            if ( !$this.selected_comments.length ) {
                alert( "Tento respondent nema zatial žiadne príspevky" );
                return;

            }

            $this.selected_comment = {
                id : id,
                name : name
            };

            // select comments
            selectComments();


        };


        /**
         * Select comments by $this.selected_comment
         * @returns {undefined}
         */
        var selectComments = function() {
            if ( $this.selected_comment.id )
            {
                $this.selected_comments = angular.element( '.comment-user-' + $this.selected_comment.id );
                angular.forEach( $this.selected_comments, function( elem, i ) {
                    angular.element( elem ).addClass( "comment-selected" );
                } );
            }
        };

        /**
         * Loading comments
         * @param {type} options
         * @returns {undefined}
         */
        var loadComments = function( options ) {

            var params = angular.extend( {
                theme_id : themeId
            }, options, $scope.filterForm );

            var comment_promise = CommentService.theme(themeId,0, $scope.filterForm );
            angular.element( '.fa-refresh' ).addClass( 'rotate' );

            comment_promise.then( function( response ) {
                angular.element( '.fa-refresh' ).removeClass( 'rotate' );
                commentsloadSuccess( response );
                $this.load_more_counter = 0;
            } );


        };

        /**
         *
         * @returns {undefined}
         */
        this.filterUsers = function( active ) {
            this.state_users = active == 'all' ? null : { comments : active };
        }

        /**
         * Load users list
         @todo admin access only
         */
        var loadUsers = function( options ) {
            $this.users = [];
            ThemeFactory.users(themeId).then( function( response ) {
                angular.forEach( ThemeFactory.data, function( elem, index ) {
                    $this.users.push(elem);
                } );
            } );
        };



        /**
         * On success loading comments
         * @param {type} response
         * @returns {undefined}
         */
        var commentsloadSuccess = function( response ) {

            $this.comments = response.data === 'null' ? [] : response.data.rows;

            $timeout( function() {
                selectComments();
            }, 200 );

        };


        /**
         * On error loading comments
         * @param {type} response
         * @returns {undefined}
         */
        var commentsloadError = function( response ) {

        };


        /**
         * Load Scroll inifinite
         * @returns {*}
         */
        this.loadScroll = function() {

           $scope.load_more_loading = true;
           $this.load_more_counter++;
           return  CommentService.theme(themeId, $this.load_more_counter, {})
               .then(function(response){
                   if(response.data.rows.length) {
                       angular.forEach(response.data.rows, function (item) {
                           $this.comments.push(item);
                       })
                   }
               });
        }

        /**
         *
         * initial loads
         */

        // Theme info
        getThemeData();



        // Comments
        loadComments();

        // Load users
        if ( localStorage.role === 'admin' ) {
            loadUsers();
        }

    }




})();