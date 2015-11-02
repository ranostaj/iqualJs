/*
 * Comment Factory
 *
 */


'use strict';
(function() {

    angular.module( 'theme.factories' )
            .factory( 'CommentFactory', CommentFactory );


    CommentFactory.$inject = ['$http', 'CommentService'];
    function CommentFactory( $http, CommentService ) {

        var factory = {
            data : [],
            getList : getList,
            getAllReactions : getAllReactions,
            saveReaction : saveReaction,
            getLastComments : getLastComments,
            save : save,
            user : user


        }

        return factory;

        /////////////////////////


        /**
         * Comments list
         * @params params = {user_id:, theme_id}
         * @returns {unresolved}
         */
        function user( params ) {
            return  CommentService.user( params )
                    .success( __success )
                    .error( __error );
        }


        function save( data ) {
            return CommentService.save( data );
        }
        ;

        /**
         * Comments list
         * @returns {unresolved}
         */
        function getList( data ) {
            return  CommentService.list( data )
                    .success( __success )
                    .error( __error );
        }
        ;

        /**
         * Comments list
         * @returns {unresolved}
         */
        function getAllReactions( data ) {
            return  CommentService.listReactions( data )
                    .success( __success )
                    .error( __error );
        }
        ;


        /**
         * Save user reaction
         * @param {type} data
         * @returns {unresolved}
         */
        function saveReaction( data ) {
            return CommentService.save( data ).then( function( response ) {
                return save( { Comment : { id : data.Comment.parent_id, reaction : 1 } } );
            } );
        }
        ;


        /**
         * Last comments
         * @params obj {by_user:true} - komenty prihlaseneho usra
         * @returns {unresolved}
         */
        function getLastComments( params ) {

            var defaults = {
                limit : 5,
                type : 'all',
                order : 'newest',
                by_user : false
            }
            return CommentService.list( angular.extend( defaults, params ) )
                    .success( __success )
                    .error( __error );

        }

        function __success( response ) {
            factory.data = response.rows;
        }

        function __error( error ) {

        }




    }
    ;


}());
