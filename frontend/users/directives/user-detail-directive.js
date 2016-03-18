/**
 * @desc User Details Directive
 * @param  user-id="@" - integer
 * @usage <button view-user-details user-id="@"></button>
 *
 */
"use strict";
(function() {

    /**
     * Module name
     */
    angular
            .module( 'user.directives' )
            .directive( 'viewUserDetails', viewUserDetails )
            .controller( 'viewUserModalCtrl', viewUserModalCtrl );


    /**
     * Directive
     * @returns {undefined}
     */
    function viewUserDetails( $modal, UserFactory, UserService, $rootScope ) {

        var directive = {
            scope : {
                userId : '@'
            },
            restrict : 'EA',
            link : link
        };

        return directive;

        /**
         * Link function
         * @param {type} scope
         * @param {type} element
         * @param {type} attr
         * @returns {undefined}
         */
        function link( scope, element, attr ) {
            UserService.getUserData().then( function( response ) {
                if ( response.role === 'admin' ) {
                    element.bind( 'click', openModal.bind( this, attr ) );
                }
            } );
        }
        ;

        /**
         * Open modal
         * @param {type} $attr
         * @param {type} $event
         * @returns {undefined}
         */
        function openModal( $attr, $event ) {
            $event.preventDefault();
            $modal.open( {
                controller : 'viewUserModalCtrl as ctrl',
                templateUrl : 'js/modal/templates/user-detail-modal.html',
                size : 'lg',
                resolve : {
                    user : function() {
                        return  UserFactory.view( { id : $attr.userId } ).then( function() {
                            return UserFactory.data
                        } );
                    }
                }
            } );
        }



    }
    ;


    /**
     * Modal Controller
     * @param {type} $scope
     * @param {type} $modalInstance
     * @returns {undefined}
     */


    viewUserModalCtrl.$inject = ['$scope', '$modalInstance', 'user', '$rootScope', 'CommentFactory', 'UserFactory'];

    function viewUserModalCtrl( $scope, $modalInstance, user, $rootScope, CommentFactory, UserFactory ) {

        var $this = this;
        $this.user = user;
        var user = angular.copy( $this.user );
        $this.edit_name = false;
        this.comments = [];
        this.saveUser = saveUser;
        this.changeTheme = changeTheme;

        ///////////////////////////////


        function changeTheme() {
            CommentFactory.user( { user_id : $this.user.User.id, theme_id : $this.theme_id } )
                    .then( function( data ) {
                        $this.comments = CommentFactory.data;
                    } )
        }

        function saveUser() {
            UserFactory.save( $this.user ).then( function( data ) {
            }, function( error ) {
                $this.user = user;
            } );
        }

        $rootScope.$on( 'removeUserFromTheme', function( event, data ) {
            UserFactory.view( { id : data.data.user } ).then( function() {
                $this.user = UserFactory.data;
            } );
        } );

        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        };
    }



})();

