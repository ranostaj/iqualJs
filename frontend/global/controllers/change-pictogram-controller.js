
/**
 * pictogram Modal Ctrl
 * @param {type} $scope
 * @param {type} $modalInstance
 * @param {type} UserFactory
 * @param {type} userData
 * @returns {undefined}
 */

"use strict";
(function() {

    angular.module( 'global.controllers' ).controller( 'pictogramCtrl', pictogramCtrl );

    pictogramCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'UserFactory', 'userData'];

    function pictogramCtrl( $scope, $rootScope, $modalInstance, UserFactory, userData ) {

        $scope.pictogramModel = userData.user.pictogram_id;

        $scope.changeModel = function( image ) {
            $scope.pictogramModel = image;

        };

        $scope.$watch( 'pictogramModel', function( n, o ) {
            console.log( n, userData.user.pictogram_id );

            if ( n !== userData.user.pictogram_id ) {
                UserFactory.save( { User : { id : userData.id, pictogram_id : n } } ).then( function( response ) {
                    $scope.pictogramModel = n;

                    $rootScope.$broadcast( "notification", { "type" : "success", "text" : "piktogram uložený" } );
                    $rootScope.$broadcast( 'pictogram_change', { pictogram : $scope.pictogramModel, user : response.data.data.User } );
                    localStorage.setItem( 'user', JSON.stringify( response.data.data.User ) );
                } );
            }

        } );
        // close modal
        $scope.cancel = function() {
            $modalInstance.dismiss( 'cancel' );
        };
    }
    ;



})();