/*
 * Project Factory
 *
 */

'use strict';
(function() {

    angular.module( 'project.factories' )
            .factory( 'ProjectFactory', ProjectFactory );

    ProjectFactory.$inject = ['$http', 'ProjectService', '$q', '$translate'];
    function ProjectFactory( $http, ProjectService, $q, $translate ) {
        var factory = {
            data : [],
            total : 0,
            getList : getList,
            findById : findById,
            delete : deleteItem,
            save : save,
            dropdown : dropdown,
            getPage : getPage,
            users : users,
            themes:themes,
            sendMail: sendMail

        };
        return factory;
        ///////////////////


        /**
         * Data for table
         * @param {type} start
         * @param {type} number
         * @param {type} params
         * @returns {unresolved}
         */
        function getPage( start, number, params, filters ) {
            var filters = filters ? filters : { };


            return getList( angular.extend( { _recursive : 1, limit : number, offset : start, order : 'id DESC' }, filters ) ).then( function() {
                return  {
                    data : factory.data,
                    total : factory.total,
                    numberOfPages : Math.ceil( factory.total / number )
                };

            } );
        }
        ;
        /**
         * Themes  list
         * @param {int} $project_id projekt ID
         * @param {obj} $params
         * @returns promise
         */
        function themes( $project_id, $params ) {
            return  ProjectService.themes($project_id, $params )
                .success( __success )
                .error( __error );
        }
        ;

        /**
         * Projects list
         * @returns {unresolved}
         */
        function getList( data ) {
            return  ProjectService.list( data )
                    .success( __success )
                    .error( __error );
        }
        ;
        /**
         * Projects view
         * @returns {unresolved}
         */
        function findById( id ) {
            return  ProjectService.view( id );
        }
        ;


        /**
         * Projects Users
         * @returns {unresolved}
         */
        function users( id ) {
            return  ProjectService.users( id ).then( function( response ) {
                factory.data = response.data.User;
            } );
        }
        /**
         * Delete project
         * @param {type} params
         * @returns {unresolved}
         */
        function deleteItem( params ) {
            return ProjectService.delete( params );
        }
        ;
        /**
         * Save project
         * @param {type} params
         * @returns {unresolved}
         */
        function save( params ) {
            return ProjectService.save( params );
        }
        ;
        /**
         * Dropdown
         * @param {type} data
         * @returns {$q@call;defer.promise}
         */
        function dropdown( data ) {
            var defer = $q.defer();
            var promise = getList( angular.extend( { _dropdown : true, order : 'newest' }, data ) );
            var list = [];

            promise.then( function() {
                angular.forEach( factory.data, function( elem, i ) {
                    list.push( elem.Project )
                } )

                defer.resolve( list );
            } );
            return defer.promise;
        }

        function __success( response ) {
            factory.data = response.rows;
            factory.total = response.total;
        }

        function __error( error ) {

        }


        /**
         * Send users email
         * @param int $id project id
         * @param object $data
         * @returns  promise
         */
        function sendMail( $id, $data ) {
            return ProjectService.sendMail( $id, $data );
        }


    }
    ;
}());
