
/**
 * Theme list Controller for theme list directive
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */
"use strict";

(function() {

    angular.module( 'user.controllers' )
            .controller( 'UserListThemes', UserListThemes );

    UserListThemes.$inject = ['$scope', 'ThemeFactory', 'UserFactory', '$location', '$modal', '$timeout', '$rootScope'];

    function UserListThemes( $scope, ThemeFactory, UserFactory, $location, $modal, $timeout, $rootScope ) {

        var $this = this;
        $this.themes = [];
        $this.user_id = $scope.userId;
        $this.filters = { };
        $this.isLoading = false;
        $this.changeActive = changeActive;
        $this.loadData = callServer;
        $this.pages = [5, 10, 15];
        $this.onPage = 5;
        $this.results = true;
        $this.deleteRow = deleteRow;
        ///////////////////////////



        /**
         * Load data per page
         * @param {type} tableState
         * @returns {undefined}
         */
        function callServer( tableState ) {
            $this.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || $this.onPage;

            UserFactory.themes( start, number, tableState, { user_id : $this.user_id } ).then( function( result ) {

                var number_to = eval( parseInt( number ) + parseInt( start ) );
                $this.themes = result.data;

                $this.table = {
                    start : start + 1,
                    number : number_to < result.total ? number_to : result.total,
                    total : result.total
                };


                tableState.pagination.numberOfPages = result.numberOfPages;

                $this.isLoading = false;

                $this.results = $this.themes !== undefined ? true : false;


            } );
        }
        ;


        /**
         * Delete row
         * @@param {obj} Theme obj
         * @returns {undefined}
         */
        function deleteRow( $theme ) {
            var promise = UserFactory.deleteFromTheme( { theme : $theme.Theme.id, user : $this.user_id } );
            promise.then( deleteSuccess, error );
        }


        /**
         * Change active
         * @param {type} state
         * @param {type} $theme
         * @returns {undefined}
         */
        function changeActive( state, $theme ) {
            ThemeFactory.save( { 'Theme' : { id : $theme, active : state == true ? 1 : 0 } } );
        }

        /**
         * Delete success - vymaze zaznam z DB a z pola this.projectData
         * @param object data - data  (Id vymazaneho projektu)
         * @returns {undefined}
         */
        var deleteSuccess = function( data ) {
            $timeout( function() {
                angular.forEach( $this.themes, function( value, i ) {
                    if ( value.Theme.id === data.data.theme ) {
                        $this.themes.splice( i, 1 );
                        $this.loadData;
                        $rootScope.$broadcast( 'removeUserFromTheme', data );
                    }
                } );
            }, 400 );
        };


        /**
         * Handle request error
         * @param {type} error
         * @returns {undefined}
         */
        var error = function( error ) {

        }


    }
    ;
})();


