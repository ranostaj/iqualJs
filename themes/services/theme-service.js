/**
 * Theme Service
 * @returns {undefined}
 */

"use strict";

(function() {


    angular.module( 'theme.services' )
            .service( "ThemeService", ThemeService );


    ThemeService.$inject = ['$q', '$http', '$rootScope', '$upload', 'ApiConst'];
    function ThemeService( $q, $http, $rootScope, $upload, ApiConst ) {

        this.api = ApiConst.url;

        /**
         * Zoznam themes
         * @returns promise
         */
        this.list = function( param ) {
            return $http.get( this.api + '/themes', { params : param } );
        }


        /**
         * Theme users
         * @param int $theme_id
         * @param object @params
         * @returns promise
         */
        this.users = function( $theme_id, $params ) {
            return $http.get( this.api + '/themes/users/'+$theme_id, { params : $params });
        }


        /**
         * Vymazanie theme
         * @param int id - id
         * @returns promise
         */
        this.delete = function( id ) {
            return $http.delete( this.api + '/themes/delete', { params : { id : id } } );
        }


        /**
         * Vymazanie Theme image
         * @param int id - id
         * @returns promise
         */
        this.deleteImage = function( params ) {
            return $http.delete( this.api + '/themes/image', { params : params } );
        }


        /**
         * View single theme
         * @param {type} id
         * @returns {unresolved}
         */
        this.view = function( id ) {
            return $http.get( this.api + '/themes/view', { params : { id : id } } );
        }

        /**
         * Save theme
         * @param {type} data
         * @returns promise
         */
        this.save = function( data ) {
            return $http.post( this.api + '/themes/save', { data : data } );
        }


        /**
         * Upload File
         * @param {type} $file
         * @param {type} $formData
         * @returns {unresolved}
         */
        this.upload = function( $file, $formData ) {
            return $upload.upload( {
                url : this.api + '/themes/upload',
                method : 'POST',
                withCredentials : true,
                data : { data : $formData },
                file : $file,
                fileName : 'file',
                fileFormDataName : 'file',
            } );
        }

    }


})();