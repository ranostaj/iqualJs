/**
 * Comment Service
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'theme.services' )
            .service( "CommentService", CommentService );

    CommentService.$inject = ['$q', '$http', '$rootScope', '$upload', 'ApiConst'];

    function CommentService( $q, $http, $rootScope, $upload, ApiConst ) {

        this.api = ApiConst.url;

        /**
         * List comments
         * @returns promise
         */
        this.list = function( $params ) {
            return $http.get( this.api + '/comments', {params:$params} );
        };


        /**
         * Theme comments
         * @returns promise
         */
        this.theme = function( $id,$page,$params ) {
            return $http.get( this.api + '/comments/theme/'+$id+'/'+$page, {params:$params} );
        };

        /**
         * List comments
         * @returns promise
         */
        this.user = function( param ) {
            if ( param.user_id === undefined || param.theme_id === undefined ) {
                return alert( "Error Missing user_id and theme_id" )
            }
            ;
            var user = param.user_id;
            var theme = param.theme_id;
            delete param.user_id;
            delete param.theme_id;
            return $http.get( this.api + '/comments/user/' + user + '/' + theme, { params : param } );
        };

        /**
         * List users reactions
         * @returns promise
         */
        this.listReactions = function( param ) {
            return $http.get( this.api + '/comments/getallreactions', { params : param } );
        }
        /**
         * Delete comment
         * @param int id - id
         * @returns promise
         */
        this.delete = function( id ) {
            return $http.get( this.api + '/comments/delete', { params : { id : id } } );
        }


        /**
         * View single comment
         * @param {type} id
         * @returns {unresolved}
         */
        this.view = function( $id ) {
            return $http.get( this.api + '/comments/view', { params : { id : $id } } );
        }

        /**
         * Save comment
         * @param {type} data
         * @returns promise
         */
        this.save = function( $data ) {
            return $http.post( this.api + '/comments/save', { data : $data } );
        }


        /**
         * Upload image
         * @returns {unresolved}
         */
        this.upload = function( $files, $model ) {
            var promises = [];

            var deferred = $q.defer();

            for ( var i = 0; i < $files.length; i++ ) {
                var upload = $upload.upload( {
                    url : this.api + '/comments/upload',
                    method : 'POST',
                    data : { data : $model },
                    file : $files[i],
                    fileFormDataName : 'uploadFile'
                } ).progress( function( evt ) {
                    $rootScope.$broadcast( 'onProgress', parseInt( 100.0 * evt.loaded / evt.total ) );
                } );
                promises.push( upload );
            }
            ;

            $q.all( promises ).then( function( values ) {

                deferred.resolve( values );
            } );

            return deferred.promise;
        };

    }
    ;


})();