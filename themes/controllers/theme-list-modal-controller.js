
/**
 * Theme list Controller
 * @param {type} $scope
 * @param {type} ThemeService
 * @returns {_L9.pageHeaderCtrl}
 */
"use strict";

(function() {

    angular.module( 'theme.controllers' )
            .controller( 'ThemeListModalCtrl', ThemeListModalCtrl );

    ThemeListModalCtrl.$inject = ['$scope', 'ThemeFactory', '$location', '$modal', '$timeout', '$modalInstance', 'project_id'];

    function ThemeListModalCtrl( $scope, ThemeFactory, $location, $modal, $timeout, $modalInstance, project_id ) {

        var $this = this;
        $this.themes = [];
        $this.project_id = project_id ? project_id : null;
        $this.filters = { };
        $this.changeActive = changeActive;
        $this.loadData = callServer;
        $this.pages = [5, 10, 15];
        $this.onPage = 5;
        $this.isLoading = false;
        $this.results = true;
        $this.cancel = cancelModal;
        ///////////////////////////


        /**
         * Close modal window
         * @returns {undefined}
         */
        function cancelModal() {
            $modalInstance.dismiss( 'cancel' );
        }
        ;

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

            ThemeFactory.getPage( start, number, tableState, { project_id : $this.project_id } ).then( function( result ) {


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
         * @param int id
         * @returns {undefined}
         *
         */
        function deleteRow( id ) {
            var promise = ThemeFactory.delete( id );
            promise.then( deleteSuccess );
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
        function deleteSuccess( data ) {
            $timeout( function() {
                angular.forEach( $this.themes, function( value, i ) {
                    if ( value.Theme.id == data.data.id ) {
                        $this.themes.splice( i, 1 );
                    }
                } );
            }, 400 );
        }



    }
    ;
})();


