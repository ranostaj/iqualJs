/**
 * Home controller
 * @returns {undefined}
 */

"use strict";

(function() {


    angular.module( 'home.controllers' )
            .controller( 'HomeController', HomeController );


    HomeController.$inject = ['$scope', '$location', '$rootScope', '$timeout',
        'AuthService', 'UserService', 'ProjectFactory', 'CommentFactory',
        'ThemeFactory', 'UserFactory', '$log', '$modal',
        '$state'];

    function HomeController(
            $scope, $location, $rootScope, $timeout,
            AuthService, UserService, ProjectFactory, CommentFactory,
            ThemeFactory, UserFactory, $log, $modal,
            $state )
    {

        var $this = this;
        $this.user = { };
        $this.project = { };
        $this.open_notification = false;


        $rootScope.$on( 'userCommentReact:load', function( event, response ) {
            $timeout( function() {
                $this.userCommentReact = response.length;
                $this.open_notification = true;
            }, 300 )
        } );


        UserService.getUserData().then( function( resp ) {
            $this.user = resp.user;
            if ( $this.user.agreed == 0 && localStorage.role === 'user' && /^demo/.test( window.location.host ) === false ) {
                $modal.open( {
                    templateUrl : 'js/modal/templates/terms-modal.html',
                    backdrop : 'static',
                    size : 'lg',
                    controller : function( $scope, $modalInstance ) {
                        $scope.ok = function() {
                            UserFactory.save( { User : { agreed : 1 }, show_message : false } ).then( function( data ) {
                                localStorage.setItem( 'user', JSON.stringify( data.data.data.User ) );
                                $modalInstance.dismiss( 'cancel' );
                            } );
                        };

                        $scope.cancel = function() {
                            AuthService.logout().
                                    then( function() {
                                        $modalInstance.dismiss( 'cancel' );
                                        $location.path( "/" );
                                    } );
                        };
                    }
                } );
            }

        } );



        // Active Themes belongs to user
        if ( localStorage.role === 'user' || localStorage.role === 'client' )
        {
            ProjectFactory.getList( { active : 1, _recursive : -1 } ).then( function( data ) {
                if ( ProjectFactory.data.Project !== undefined ) {
                    $this.project = ProjectFactory.data.Project;
                    ProjectFactory.themes(  ProjectFactory.data.Project.id, { active : 1} ).
                            then( function( data ) {
                                $this.themes = ProjectFactory.data;
                            } );
                }

            } );
        }


        // Last Comments for admin and user; if user comments belongs to user
        if ( /admin|user/.test( localStorage.role ) )
            CommentFactory.getList( { limit : 5 } ).then( function( data ) {
                $this.comments = CommentFactory.data;
            } );


        this.reloadComments = function( $event ) {
            $event.preventDefault();
            $rootScope.$broadcast( 'userCommentReact:reload' );
        };

    }
    ;




})();