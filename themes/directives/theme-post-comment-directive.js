

/**
 * Theme Post comment Directive
 * @param {type} param1
 * @param {type} param2
 *
 */



(function() {
    'use strict';
    angular.module( 'theme.directives' )
            .directive( 'postComment', PostComment );

    /**
     * Directive
     *
     */

    PostComment.$inject = ['$rootScope', 'AuthService'];

    function PostComment( $rootScope, AuthService ) {


        var directive = {
            scope : {
                showForm : '&',
                data : '='
            },
            restrict : 'E',
            replace : true,
            templateUrl : 'js/themes/directives/templates/theme-post-comment.html',
            controller : "ThemeCommentCtrl",
            controllerAs : 'comment',
            link : link
        }

        return directive;

        /////////////////////

        function link( scope, element, attr ) {
            // listen for open events
            scope.$on( 'openCommentForm', function( $event, args ) {
                openForm( element, scope );

            } );

            // listen for saved comment event
            scope.$on( 'afterSavedComment', function() {
                closeForm( element, scope );
            } );

            // Close form
            scope.closeForm = function() {
                closeForm( element, scope );

            }
        }
        ;


        function closeForm( element, scope ) {
            scope.form_opened = false;
            new PostSlide().CloseForm( {
                elem : element,
                height : 110
                , callback : function() {
                    scope.comment.formData = { };
                    scope.selectedFiles = [];

                    scope.$emit( 'closeCommentForm' );
                } } );
        }
        ;

        function openForm( element, scope ) {
            scope.form_opened = true;
            new PostSlide().OpenForm( { elem : element, height : 400, callback : function() {
                    angular.element( '.forum-textarea' ).focus();
                    angular.element( '.modal-backdrop' ).on( 'click', function() {
                        closeForm( element, scope );

                    } );
                } } );
        }



    }

    /**
     * Post Slide
     * @type
     */
    function PostSlide() {



        var _openForm = function( options ) {
            _showOverlay( options );
            _animate( options );
        };

        var _closeForm = function( options ) {
            _animate( options, _closeOverlay() );
        }

        var _animate = function( options ) {
            if ( angular.element( options.elem ).height() + 1 !== options.height )
            {
                options.elem.animate( {
                    height : options.height,
                    'z-index' : 1050 },
                {
                    duration : 400, complete : options.callback
                } );
            }
        }

        var _closeOverlay = function() {
            if ( $( '.comment-backdrop' ).length )
                $( '.comment-backdrop' ).fadeOut( 300, function() {
                    $( this ).remove()
                } );
        }

        var _showOverlay = function( options ) {
            setTimeout( function() {
                if ( !$( '.comment-backdrop' ).length ) {
                    var overlay = $( '<div/>', { class : "modal-backdrop comment-backdrop in", style : " display: none" } );
                    $( 'body' ).append( $( overlay ) );
                    $( overlay ).fadeIn( 200 );
                }
                $( '.js-forum-footer-close' ).removeClass( 'hide' );
            }, 300 );
        }


        return {
            OpenForm : _openForm,
            CloseForm : _closeForm,
        }

    }
    ;


})();



