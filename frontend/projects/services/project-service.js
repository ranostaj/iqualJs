/**
 * Project Service
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'project.services' ).service( "ProjectService", ProjectService );

    ProjectService.$inject = ['$q', '$http', '$rootScope', 'ApiConst'];

    function ProjectService( $q, $http, $rootScope, ApiConst ) {

        this.api = ApiConst.url;

        /**
         * Zoznam projektov
         * @returns promise
         */
        this.list = function( data ) {
            return $http.get( this.api + '/projects', { params : data } );
        }

        /**
         * Vymazanie projektu
         * @param int id - id projektu
         * @returns promise
         */
        this.delete = function( id ) {
            return $http.delete( this.api + '/projects/delete', { params : { id : id } } );
        }


        /**
         * View single project
         * @param {type} id
         * @returns {unresolved}
         */
        this.view = function( id ) {
            return $http.get( this.api + '/projects/view', { params : { id : id } } );
        }

        /**
         * View users list
         * @param {type} id
         * @returns {unresolved}
         */
        this.users = function( id ) {
            return $http.get( this.api + '/projects/users/' + id );
        }

        /**
         * Save project
         * @param {type} data
         * @returns promise
         */
        this.save = function( data ) {
            return $http.post( this.api + '/projects/save', { data : data } );
        }


        /**
         * Themes list
         * @param {type} data
         * @returns promise
         */
        this.themes = function( $project_id, $params ) {
            return $http.get( this.api + '/projects/'+$project_id+'/themes', { params : $params } );
        }

        /**
         * Send users email
         * @param $id
         * @param {type} data
         * @returns {undefined}
         */
        this.sendMail = function( $id, data ) {
            return $http.post( this.api + '/projects/mail/'+$id, data );
        }

    }

})();