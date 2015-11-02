
/**
 * Theme list Controller for theme list directive
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */
"use strict";

(function() {

    angular.module( 'theme.controllers' )
            .controller( 'ThemeListCtrl', ThemeListCtrl );

    ThemeListCtrl.$inject = ['$scope', 'ThemeFactory', 'ProjectFactory', '$location', '$modal', '$timeout'];

    function ThemeListCtrl( $scope, ThemeFactory, ProjectFactory, $location, $modal, $timeout ) {


        var $this = this;
        $this.themes = $scope.themes ? $scope.themes : [];
        $this.filters = $scope.filters ? $scope.$eval( $scope.filters ) : { };
        $this.isLoading = false;
        $this.changeActive = changeActive;
        $this.loadData = callServer;
        $this.pages = [5, 10, 15, 20];
        $this.onPage = 15;
        $this.results = true;
        $this.deleteRow = deleteRow;
        ///////////////////////////


        /**
         * DropDown projects
         */
        function getProjectsDropDown() {
            ProjectFactory.dropdown().then( function( result ) {
                $this.projects = result;
            } )
        }

        getProjectsDropDown();

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

            ThemeFactory.getPage( start, number, tableState, $this.filters ).then( function( result ) {


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
         * @returns {undefined}
         */
        function deleteRow( id ) {
            var promise = ThemeFactory.delete( id );
            promise.then( deleteSuccess, error );
        }


        /**
         * Change active
         * @param {type} state
         * @param {type} $theme
         * @returns {undefined}
         */
        function changeActive( state, $theme ) {
            ThemeFactory.save( { 'Theme' : { id : $theme, active : state === true ? 1 : 0 } } );
        }

        /**
         * Delete success - vymaze zaznam z DB a z pola this.projectData
         * @param object data - data  (Id vymazaneho projektu)
         * @returns {undefined}
         */
        var deleteSuccess = function( data ) {
            $timeout( function() {
                angular.forEach( $this.themes, function( value, i ) {
                    if ( value.Theme.id == data.data.id ) {
                        var elem = angular.element( '.theme-item' )[i];
                        angular.element( elem ).addClass( 'fadeOutDown' );
                        $timeout( function() {
                            $this.themes.splice( i, 1 );
                        }, 400 ).then( function() {
                            angular.element( elem )
                                    .removeClass( 'fadeOutDown' )
                                    .addClass( 'fadeInUp' );
                        } );
                    }
                } );
            }, 400 )
        }


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


