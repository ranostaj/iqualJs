
/**
 * Project controller
 * @returns {undefined}
 */

"use strict";

(function() {

    angular.module( 'project.controllers' )
            .controller( 'ProjectController', ProjectController );


    ProjectController.$inject = ['$scope', '$location', '$rootScope', '$timeout',
        'AuthService', '$modal', 'ProjectService', 'UserService', 'UserFactory',
        'filterFilter', '$q', '$log',
        '$stateParams'];



    function ProjectController(
            $scope,
            $location,
            $rootScope,
            $timeout,
            AuthService,
            $modal,
            ProjectService,
            UserService,
            UserFactory,
            filterFilter,
            $q, $log, $stateParams ) {

        $scope.formData = { Project : { youtube : 0, image : 0 } };
        $scope.user_added = false;
        $scope.filters = { user_role : null };

        $scope.tabs = {
            info : true,
            users : false,
            themes : false,
            mail : false
        };

        $scope.selectTab = function( $tab ) {
            angular.forEach( $scope.tabs, function( val, key ) {
                $scope.tabs[key] = false;
            } );
            $scope.tabs[$tab] = true;
        };


        $scope.breadcrumb = [
            { title : "Zoznam projektov", url : 'admin.project' }
        ];

        var deferred = $q.defer();

        $scope.addUserFormData = {
            role_id : '2',
            Theme : []
        };

        /**
         * Load single project
         */

        if ( $stateParams.id ) {

            var promise = ProjectService.view( $stateParams.id );
            promise.then( function( response ) {
                filterData( response );
                $timeout( function() {
                    $scope.projectForm.$dirty = false;
                }, 300 );
            } );
        }

        /**
         * Change active
         * @param {type} state
         * @param {type} $project
         * @returns {undefined}
         */
        $scope.changeActive = function( state, $project ) {
            ProjectService.save( { 'Project' : { id : $project.Project.id, active : state == true ? 1 : 0 } } );
        }

        /**
         * Odstrananie respondenta z projektu
         * @param {type} index
         * @returns {undefined}
         */
        $scope.delRow = function( index, role ) {
            angular.forEach( $scope.formData.User, function( elem, i ) {
                if ( elem.id === index ) {
                    UserFactory.deleteFromProject( { user : elem.id, project : $stateParams.id } ).then( function( response ) {
                        $scope.formData.User.splice( i, 1 );
                    } );
                }
            } );
        };



        /**
         *  Kontrola vstupneho suboru
         *  @param {type} $files
         *  @returns {undefined}
         *
         */
        $scope.selectFiles = function( $files ) {

            var extension = $files[0].name.split( '.' );

            try {
                console.dir( $files[0] );
                if ( extension[1].toLowerCase() !== 'csv' ) {
                    alert( 'Neplatný formát súboru, povolený je len CSV' );
                }

                getCsvData( $files[0] );

            } catch (e) {
                document.getElementById( 'file' ).value = "";
            }
        };


        /**
         * Save project Data
         * @returns {undefined}
         */
        $scope.saveProject = function() {
            var promise = ProjectService.save( $scope.formData );
            promise.then( saveSuccess, saveError );
        };


        $scope.clearForm = function( $event ) {
            $event.preventDefault();
            $scope.addUserFormData = { role_id : '2' }
            $scope.addUserForm.$setPristine();
            $scope.addUserForm.$setUntouched();
        }


        /**
         * Filter added users
         * @param {type} $role
         * @returns {undefined}
         */
        $scope.filterUsers = function( $role ) {
            $scope.filters.user_role = $role == 'all' ? null : { role_id : $role };
        }
        /**
         * Add new user
         * @returns {undefined}
         */
        $scope.addUser = function() {

            if ( !$scope.addUserFormData.id )
            {
                $scope.addUserFormData.id = Math.floor( (Math.random() * 10000000) + 1000000 );
                $scope.addUserFormData.imported = true;
                $scope.addUserFormData.status = 'success';
                $scope.addUserFormData.pictogram_id = Math.floor( (Math.random() * 5) + 1 );
            }

            // send notification to user
            $scope.addUserFormData.notify = true;

            var role = $scope.addUserFormData.role_id;
            var user_data = $scope.addUserFormData;


            // Ak ma projekt temy, zobraz temy na vyber
            if ( $scope.formData.Theme.length ) {
                openThemes().result.then( function( response ) {
                    user_data = angular.extend( user_data, { Theme : response ? response : { } } );
                } );
            }
            ;


            $scope.user_added = true;
            $scope.projectForm.$dirty = true;
            $scope.formData.User.unshift( user_data );

            $scope.addUserFormData = {
                role_id : role
            };

            $scope.addUserForm.$setPristine();

        };



        /**
         * Open themes modal available for current project
         * @returns {unresolved}
         */
        var openThemes = function() {


            return  $modal.open( {
                templateUrl : 'js/modal/templates/add-user-themes-modal.html',
                size : 'lg',
                controller : themesModalCtrl,
                resolve : {
                    themeData : function() {
                        return $scope.formData;
                    },
                    userData : function() {
                        return $scope.addUserFormData;
                    }
                }
            } );


        }

        /**
         * themes modal Ctrl
         * @param {type} $scope
         * @param {type} $modalInstance
         * @param {type} ThemeFactory
         * @param {type} $filter
         * @param {type} themeData
         * @param {type} userData
         * @returns {undefined}
         */
        var themesModalCtrl = function( $scope, $modalInstance, ThemeFactory, $filter, themeData, userData ) {
            $scope.themes = angular.copy( themeData );
            $scope.userData = angular.copy( userData );
            $scope.addedThemes = [];


            if ( $scope.userData.Theme ) {
                angular.forEach( $scope.themes.Theme, function( theme, i ) {
                    var data = $filter( 'filter' )( $scope.userData.Theme, { id : theme.id } );
                    if ( data.length ) {
                        $scope.themes.Theme[i].add = true;
                        $scope.addedThemes.push( data );
                    }
                } );
            }
            ;

            /**
             * Zrusit modal
             * @returns {undefined}
             */
            $scope.cancel = function() {
                $modalInstance.dismiss( 'cancel' );

            };

            $scope.add = function( $theme ) {
                $theme = angular.extend( $theme, { add : true } );
                $scope.addedThemes.push( $theme );
            };

            $scope.ok = function() {
                $modalInstance.close( $scope.addedThemes );
            };

            $scope.remove = function( $theme ) {
                $theme.add = false;
                angular.forEach( $scope.addedThemes, function( th, i ) {
                    if ( $theme.id == th.id )
                        $scope.addedThemes.splice( i, 1 );
                } );

            };

            $scope.all = function() {
                var data = [];
                angular.forEach( $scope.themes.Theme, function( th, i ) {
                    if ( !$scope.addedThemes.length )
                        data.push( th );
                    $scope.themes.Theme[i].add = !$scope.addedThemes.length
                } );

                $scope.addedThemes = data

            };
        }
        /**
         * Filter data recieved from API
         * @param {type} response
         * @returns {undefined}
         */
        var filterData = function( response ) {


            $scope.formData = response.data;
            UserService.getUserData().then( function( response ) {
                if ( $scope.formData.Project.uname == '' && $scope.formData.Project.email == '' ) {
                    $scope.formData.Project.uname = response.user.name;
                    $scope.formData.Project.email = response.user.username;
                }
            } );


        };

        /**
         * Read CSV data
         * @param {type} file
         * @returns {undefined}
         */
        var getCsvData = function( file ) {
            if ( !window.FileReader )
                alert( 'FileReader are not supported in this browser.' );
            var reader = ReadUserFile.readFile( file );

            reader.then( function( data ) {
                angular.forEach( data, function( elem, i ) {

                    // Random pictogram ID
                    var extObj = {
                        pictogram_id : Math.floor( (Math.random() * 5) + 1 ),
                        // upload role user
                        role_id : 2
                    };

                    UserService.find( { username : elem.username } ).then( function() {
                        $scope.formData.Respondent.unshift( angular.extend( elem, { status : 'error' }, extObj ) );
                    }, function() {
                        var extend_data = angular.extend( elem, { status : 'success' }, extObj );
                        $scope.formData.Respondent.unshift( extend_data );

                    } );
                } );
                $scope.user_added = true;
            } );

        };


        /**
         * Save success
         * @param {type} response
         * @returns {undefined}
         */
        var saveSuccess = function( response ) {
            filterData( { data : response.data.project } );
        };



        var saveError = function( response ) {

        };





        /**
         * Vlozi user name do pola name ak uz existuje
         */
        $rootScope.$on( 'userProjects', function( event, response ) {

            if ( response.User ) {
                $scope.showUserProjectsTable = true;
                $scope.addUserFormData = angular.extend( response.User, { Theme : response.Theme } );

            } else {
                if ( $scope.addUserFormData.name )
                    $scope.addUserFormData = '';
            }
        } );

        /**
         * Event po vymazani usera zo zoznamu vyhladanych projektov a update aktualneho zoznamu
         */
        $rootScope.$on( 'userProjects:delete', function( event, response ) {
            angular.forEach( $scope.formData.Respondent, function( elem, i ) {
                if ( elem.id === response.user ) {
                    $scope.formData.Respondent.splice( i, 1 );
                }
            } );
        } );



    }



})();