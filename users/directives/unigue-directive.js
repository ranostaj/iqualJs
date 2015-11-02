/**
 * Unique directive
 * @param {type} param1
 * @param {type} param2
 */


'use strict';
(function() {

    angular.module( 'user.directives' )
            .directive( 'userUniq', userUniq );


    /**
     * Directive
     */

    userUniq.$inject = ['UserService'];
    function userUniq( UserService ) {
        return {
            restrict : 'A',
            scope : {
                data : '@'
            },
            template : "{{result}}",
            link : function( scope, elem, attr ) {
                var promise = UserService.find( { username : attr.data } );
                promise.then( function( data ) {
                    console.log( data );
                    scope.result = data;
                } );
            }

        }
    }


})();