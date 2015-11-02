
(function() {
    "use strict";
    angular.module( 'theme.controllers' )
            .controller( 'ThemeUserReactController', ThemeUserReactController );


    ThemeUserReactController.$inject = ['$scope', 'CommentFactory', '$rootScope', '$timeout', '$interval'];

    function ThemeUserReactController( $scope, CommentFactory, $rootScope, $timeout, $interval ) {

        this.CommentFactory = CommentFactory;
        this.rootScope = $rootScope;
        this.$timeout = $timeout;
        this.formData = { };
        this.CommentData = { };
        this.comments = [];
        this.moveListLeft = false;
        this.$ = angular.element;
        var $this = this;


        $rootScope.$on( 'userCommentReact:reload', function( event, data ) {
            //$this.list();
        } );


        var timer = $interval( function() {
            $this.list();
        }, 20000 );


        $scope.$on( '$destroy', function( event ) {
            $interval.cancel( timer );
        } );


        /**
         * Save comment
         * @returns {undefined}
         */
        this.save = function() {
            var $this = this;
            var text = this.formData.message;

            var Savedata = {
                theme_id : this.CommentData.Comment.theme_id,
                parent_id : this.CommentData.Comment.id,
                text : text
            };

            // save actual user comment
            this.CommentFactory.saveReaction( { Comment : Savedata, notify : 1 } ).then( function() {
                $this.__closeReply();
                $this.list();
            } );

        },
                /**
                 * Click on reply button
                 * @param {type} $comment
                 * @returns {undefined}
                 */
                this.reply = function( $comment ) {

                    this.moveListLeft = true;
                    this.CommentData = $comment;

                };
        /**
         * Click on delete button
         * @param {type} $comment
         * @returns {undefined}
         */
        this.deleteComment = function( $comment ) {
            var $this = this;
            var saveData = angular.extend( angular.copy( $comment ), { reaction : 1 } );
            this.CommentFactory.save( { Comment : saveData, show_message : false } ).then( function() {
                $this.list();
            } );

        };

        this.closeReply = function( $event ) {
            $event.preventDefault();
            this.__closeReply();
        };

        this.__closeReply = function() {
            this.moveListLeft = false;
            this.__clearForm();
        };
        this.__clearForm = function() {
            this.formData = { };
            this.CommentData = { };
        };
        this.list = function() {
            var $this = this;
            this.CommentFactory.getAllReactions().
                    then( function() {
                        $this.success( $this.CommentFactory.data );
                        $this.rootScope.$broadcast( 'userCommentReact:load', $this.CommentFactory.data )
                    } );

        };
        this.success = function( response ) {
            this.comments = response;
        };

        this.list();
    }
    ;




})();