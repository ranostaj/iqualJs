/**
 * Theme Comment Controller
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */
"use strict";

(function() {

    angular.module( 'theme.controllers' )
            .controller( 'ThemeCommentCtrl', ThemeCommentCtrl );

    ThemeCommentCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'CommentService', 'AuthService', '$location', '$modal', '$stateParams'];
    function ThemeCommentCtrl( $scope, $rootScope, $timeout, CommentService, AuthService, $location, $modal, $stateParams ) {


        // console.log($stateParams, $scope.themeData);
        /**
         * Default form data
         */
        this.formData = {
            notify : 0,
            User : null,
            Comment : {
                parent_id : 0,
                private_id : 0,
                youtube : ''
            }
        };

        this.form_opened = false;
        var $this = this;

        /**
         * Some default vars
         */

        $this.user_reply_id_value = false;


        /**
         * Watch for arguments on open form
         * @param {obj} $event event
         * @param {obj} User - user object
         */
        $scope.$on( 'openCommentForm', function( $event, Data ) {
            $this.user_reply_id_value = false;
            if ( typeof Data === "object" ) {
                // default form vars
                $this.formData = {
                    notify : Data.hasOwnProperty( 'parent_id' ) || Data.private ? 1 : 0,
                    Comment : {
                        parent_id : Data.hasOwnProperty( 'parent_id' ) ? Data.parent_id : 0,
                        private_id : Data.private || 0
                    },
                    Theme : Data.theme,
                    User : Data
                };

                if ( Data.user_reply_id_value ) {
                    $this.user_reply_id_value = Data.user_reply_id_value;
                }

            }


        } );



        /**
         * Get logged user data
         *
         */
        AuthService.isAuthorized().then( function( response ) {
            $this.user = response.data;
        } );





        $scope.$on( 'onProgress', function( event, args ) {
            $scope.progress = args;
        } )


        this.onFileSelect = function( $files ) {

            $scope.selectedFiles = [];
            $scope.progress = [];
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for ( var i = 0; i < $files.length; i++ ) {
                var $file = $files[i];
                if ( window.FileReader && $file.type.indexOf( 'image' ) > -1 ) {

                    var fileReader = new FileReader();

                    fileReader.readAsDataURL( $files[i] );

                    var loadFile = function( fileReader, index ) {

                        fileReader.onload = function( e ) {
                            $scope.dataUrls[index] = e.target.result;
                        }

                    }( fileReader, i );
                }
                $scope.progress[i] = -1;

            }
        };


        /**
         * Save comment
         * @returns {undefined}
         */
        this.submitForm = function() {

            angular.extend( $this.formData.Comment, { theme_id : $stateParams.id } );

            if ( $this.formData.Comment.private_id === 1 ) {
                $this.formData.Comment.private_id = $this.user_reply_id_value;
            }

            var promise = CommentService.save( $this.formData );

            promise.then( function( response ) {

                // upload files
                if ( $scope.selectedFiles ) {
                    CommentService.upload( $scope.selectedFiles, response.data ).
                            then( function( upload_response ) {
                                // console.log(upload_response,response.data);
                                afterSaveComment();
                            } );
                } else {
                    afterSaveComment()
                }

            }, errorSaveComment );
        };


        /**
         * After save comment
         * @returns {undefined}
         */
        var afterSaveComment = function() {
            $scope.commentForm.$setPristine();
            $this.formData = {
            };
            $scope.$emit( 'afterSavedComment' );
        };

        /**
         * Error Message
         * @param {type} response
         * @returns {undefined}
         */
        var errorSaveComment = function( response ) {
            $rootScope.$broadcast( "notification", { "type" : "danger", "text" : response.data.message } );
        };



    }
    ;


})();