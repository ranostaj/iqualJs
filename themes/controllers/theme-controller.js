/**
 * Theme controller
 * @returns {undefined}
 */

(function() {
    "use strict";
    angular.module( 'theme.controllers' )
            .controller( 'ThemeController', ThemeController );


    ThemeController.$inject = ['$scope',
        '$location',
        '$rootScope',
        '$http',
        'AuthService',
        '$modal',
        'ProjectService',
        'ThemeService',
        'ThemeFactory',
        'UserService',
        'ReadUserFile',
        '$q', '$filter', '$stateParams'];


    function ThemeController(
            $scope,
            $location,
            $rootScope,
            $http,
            AuthService,
            $modal,
            ProjectService,
            ThemeService,
            ThemeFactory,
            UserService,
            ReadUserFile,
            $q, $filter, $stateParams ) {


        $scope.formData = {
            ThemeImage : []
        };

        $scope.theme_id = $stateParams.id;

        $scope.htmlContent = "";

        /**
         * Tabs
         */
        $scope.tabs = {
            info : true,
            foto : false,
            project : false,
            users : false
        };

        $scope.selectTab = function( $tab ) {
            angular.forEach( $scope.tabs, function( val, key ) {
                $scope.tabs[key] = false;
            } );
            $scope.tabs[$tab] = true;
        };

        // uzivatelia priradeny k projektu
        $scope.users = [];

        // uzivatelia priradeny k teme
        $scope.theme_users = [];




        $scope.breadcrumb = [
            { title : "Zoznam tem" }
        ];


        /**
         * Load single theme
         */

        if ( $stateParams.id ) {
            var promise = ThemeFactory.view( $stateParams.id );
            promise.then( function( response ) {
                $scope.formData = ThemeFactory.data;
                $scope.theme_users = ThemeFactory.data.User;

                loadUsers( {
                    theme_id : $stateParams.id,
                    project_id : ThemeFactory.data.Theme.project_id
                } );

            } );

        }

        /**
         * Change active
         * @param {type} state
         * @param {type} $project
         * @returns {undefined}
         */
        $scope.changeActive = function( state, $theme ) {
            ThemeService.save( { 'Theme' : { id : $theme.Theme.id, active : state == true ? 1 : 0 } } );
        }

        /**
         * Load selected users
         * @param {type} param
         * @returns {undefined}
         */
        var loadUsers = function( param ) {
            $scope.users = [];

            var defaults = {
                project_id : $scope.formData.Theme.project_id,
                theme_id : $scope.formData.Theme.id
            };
            var params = angular.extend( defaults, param );

            // load themes users
            if ( params.theme_id !== undefined ) {
                ThemeService.view( params.theme_id ).then( function( response ) {
                    if ( response.data.Theme.project_id !== params.project_id ) {
                        $scope.theme_users = [];
                    } else {
                        $scope.theme_users = response.data.User;
                    }
                } );
            }

            // Load users not in theme yet
            UserService.notInTheme( params.theme_id ).then( function( response ) {
                angular.forEach( response.data.rows, function( elem, index ) {
                    $scope.users.push( elem.User );
                } );
            } )
        }



        /**
         * Load users for selected project ID
         * @returns {undefined}
         */
        $scope.loadUsers = function( param ) {
            loadUsers( param );
        };

        $scope.removeUser = function( $user ) {
            $scope.users.splice( 0, 0, $user );
            $scope.theme_users = $filter( 'filter' )( $scope.theme_users, { id : $user.id }, function( actual, expected ) {
                return actual !== expected ? true : false;
            } );
        };

        $scope.addUser = function( $user ) {
            $scope.theme_users.splice( 0, 0, $user );
            $scope.users = $filter( 'filter' )( $scope.users, { id : $user.id }, function( actual, expected ) {
                return actual !== expected ? true : false;
            } );
        };

        /**
         * Pridaj vsetkych
         * @returns {undefined}
         */
        $scope.addAll = function() {
            var deferred = $q.defer();
            var prom = angular.forEach( $scope.users, function( elem, i ) {
                $scope.theme_users.push( elem );
            } );

            $q.all( prom ).then( function( val ) {
                $scope.users = [];
            } );
        }


        /**
         * Vymaz vsetkych
         * @returns {undefined}
         */
        $scope.deleteAll = function() {
            var deferred = $q.defer();
            var prom = angular.forEach( $scope.theme_users, function( elem, i ) {
                $scope.users.push( elem );
            } );

            $q.all( prom ).then( function( val ) {
                $scope.theme_users = [];
            } );
        }


        /**
         * Save themes Data
         * @returns {undefined}
         */
        $scope.saveTheme = function() {
            $scope.formData.User = $scope.theme_users;
            var promise = ThemeService.save( $scope.formData );
            promise.then( saveSuccess, saveError );

        };

        /**
         * Foto upload
         * @param {type} $file
         * @returns {undefined}
         */
        $scope.onFileSelect = function( $file ) {
            $scope.uploadProgress = true;
            $scope.upload = ThemeFactory.uploadFile( $file, $scope.formData );
            $scope.upload.progress( function( evt ) {
                var percent = parseInt( 100.0 * evt.loaded / evt.total );
                $scope.uploadProgress = percent;
            } ).success( function( data, status, headers, config ) {
                $scope.uploadProgress = false;
                $scope.formData.ThemeImage.push( {
                    image : data.foto
                } );
            } );
        };



        /**
         * Delete image
         * @param {type} index
         * @param {type} id
         * @returns {undefined}
         */
        $scope.deleteImage = function( index, id ) {
            ThemeFactory.deleteImage( { id : id } ).then( function( resp ) {
                $scope.formData.ThemeImage.splice( index, 1 );
            } );
        }

        /**
         * Save success
         * @param {type} response
         * @returns {undefined}
         */
        var saveSuccess = function( response ) {
            // fill new form data
            $location.path( 'admin/theme/view/' + response.data.data.Theme.id );
        }


        var saveError = function( response ) {

        }


    }

})();