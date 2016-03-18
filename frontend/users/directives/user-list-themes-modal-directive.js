/**
 * Theme list Table in modal with listing
 * @param {type} param1
 * @param {type} param2
 * @usage <div user-list-themes-modal user-id="@"></div>
 */

'use strict';
(function() {

    angular.module( 'user.directives' )
            .directive( 'userListThemesModal', userListThemesModal );
    /**
     * Directive
     * @returns
     */
    userListThemesModal.$inject = ['$modal'];
    function userListThemesModal( $modal ) {

        var directive = {
            scope : {
                userId : '@'
            },
            restrict : 'A',
            link : link
        };
        return directive;
        ///////////////////


        /**
         * Hanlde click event
         * @param {type} scope
         * @param {type} elem
         * @param {type} attr
         * @returns {undefined}
         */
        function link( scope, elem, $attr ) {
            elem.bind( 'click', function( $event ) {
                openModal( $attr, $event );
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
                templateUrl : 'js/modal/templates/user-list-themes-modal.html',
                size : 'lg',
                controller : ['$scope', '$modalInstance', 'user_id', function( $scope, $modalInstance, user_id ) {
                        $scope.user_id = user_id;


                        $scope.cancel = function() {
                            $modalInstance.dismiss( 'cancel' );
                        }

                    }],
                controllerAs : 'ctrl',
                resolve : {
                    user_id : function()
                    {
                        return $attr.userId;
                    }
                }
            } );
        }

    }

})();

