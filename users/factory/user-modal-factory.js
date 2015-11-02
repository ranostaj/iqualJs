
/*
 * User Modal Factory
 *
 */


"use strict";
(function() {

    angular.module( 'user.factories' )
            .factory( 'UserModalFactory', UserModalFactory );

    UserModalFactory.$inject = ['UserFactory', '$modal'];

    function UserModalFactory( UserFactory, $modal ) {

        var factory = {
            open : open

        }

        return factory;

        ////////////////////////////


        /**
         * List of users
         * @param {type} data
         * @returns {undefined}
         */
        function open( data ) {
            $modal.open( {
                templateUrl : 'js/modal/templates/user-modal-factory.html',
                controller : "UserListModalCtrl",
                size : 'lg',
                resolve : {
                    ResolveData : function() {
                        return UserFactory.list( data.data ).then( function() {
                            var foreignKey = JSON.stringify( data.data ).match( /(\w+_(id))/ );
                            if ( !data.type )
                                return alert( 'missing data type' );
                            return { users : UserFactory.data, id : data.data[foreignKey[0]], type : data.type };
                        } );
                    }
                }
            } );
        }



    }
    ;


}());

