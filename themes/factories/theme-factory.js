/*
 * Theme Factory
 *
 */


'use strict';
(function() {

    angular.module( 'theme.factories' )
            .factory( 'ThemeFactory', ThemeFactory );

    ThemeFactory.$inject = ['$http', 'ThemeService'];
    function ThemeFactory( $http, ThemeService ) {

        var factory = {
            data : [],
            total : 0,
            getList : getList,
            getUserThemes : getUserThemes,
            uploadFile : uploadFile,
            save : save,
            deleteImage : deleteImage,
            delete : deleteItem,
            view : view,
            getPage : getPage,
            users:users
        };

        return factory;

        ///////////////////////////////////


        /**
         * Data for table
         * @param {type} start
         * @param {type} number
         * @param {type} params
         * @param {obj} filter_data
         * @returns {unresolved}
         */
        function getPage( start, number, params, filter_data ) {
            var tableParams = params.search.predicateObject ? params.search.predicateObject : { };
            var params = angular.extend( { limit : number, offset : start }, tableParams, filter_data );
            return getList( params ).then( function() {
                return  {
                    data : factory.data,
                    total : factory.total,
                    numberOfPages : Math.ceil( factory.total / number )
                };

            } );
        }
        ;


        /**
         * Themes list
         * @returns {unresolved}
         */
        function getList( data ) {
            return  ThemeService.list( data )
                    .success( __success )
                    .error( __error );
        }
        ;


        /**
         * User themes
         * @params obj
         * @returns {unresolved}
         */
        function getUserThemes( params ) {

            return ThemeService.list( params )
                    .success( __success )
                    .error( __error );
        }


        /**
         * Upload File
         * @param {type} $file
         * @param {type} $formData
         * @returns {unresolved}
         */
        function uploadFile( $file, $formData ) {
            return ThemeService.upload( $file, $formData );
        }
        ;


        /**
         * Save theme
         * @param {type} params
         * @returns {unresolved}
         */
        function save( params ) {
            return ThemeService.save( params );
        }


        /**
         * Load Theme users
         * @param int $theme_id
         * @returns promise
         */
        function users( $theme_id ) {
            return ThemeService.users( $theme_id, {}).then(function(response){
                factory.data = response.data;
            });
        }

        /**
         * Delete theme image
         * @param {type} params
         * @returns promise
         */
        function deleteImage( params ) {
            return ThemeService.deleteImage( params );
        }



        /**
         * Delete theme
         * @param {type} params
         * @returns {unresolved}
         */
        function deleteItem( params ) {
            return ThemeService.delete( params );
        }


        /**
         * View Theme data
         * @param {type} data
         * @returns {unresolved}
         */
        function view( data ) {
            return ThemeService.view( data ).then( function( response ) {
                factory.data = response.data;
            } );
        }
        ;


        function __success( response ) {
            factory.data = response.rows;
            if ( response.total !== undefined )
                factory.total = response.total;
        }

        function __error( error ) {
        }


    }
    ;


}());
