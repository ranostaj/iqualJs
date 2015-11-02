/**
 * New user Account
 * @param {type} param1

 * @usage <div new-account ></div>
 */



(function() {
    'use strict';
    angular.module( 'user.directives' )
            .directive( 'newAccount', newAccount );


    /**
     * Directive
     */

    newAccount.$inject = ['UserFactory', '$modal', 'BaseConst'];

    function newAccount( UserFactory, $modal, BaseConst ) {

        var directive = {
            restrict : 'A',
            scope : { },
            transclude : true,
            templateUrl : "js/users/directives/templates/new-account-tpl.html",
            link : link
        };

        return directive;
        ///////////////

        function link( scope, elem, attr ) {

            scope.allow_create_account = BaseConst.enviroment() !== 'live' ? true : false;
            scope.newAccount = function() {
                openModal();
            };
        }
        ;

        /**
         * Open modal
         * @param {type} $attr
         * @param {type} $event
         * @returns {undefined}
         */
        function openModal() {
            $modal.open( {
                controller : 'newAccountModalCtrl as ctrl',
                templateUrl : 'js/modal/templates/new-account-modal.html',
                size : 'md'
            } );
        }
    }
    ;


})();