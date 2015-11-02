/**
 * @desc Project Table list directive
 * @param projects="=" = JSON string
 * @usage <div project-list-table  ></div>
 *
 */
'use strict';
(function() {

    /**
     * Module name
     */
    angular
            .module( 'project.directives' )
            .directive( 'projectListTable', projectListTable )
            .controller( 'projectListTableCtrl', projectListTableCtrl );
    /**
     * Directive
     * @returns
     */
    function projectListTable() {

        return {
            scope : {
                filter : '@'
            },
            restrict : 'A',
            replace : true,
            templateUrl : 'js/projects/directives/templates/project-list-table.html',
            controller : projectListTableCtrl,
            controllerAs : 'ctrl'
        };
    }
    ;
    /**
     * Directive controller
     *
     */
    projectListTableCtrl.$inject = ['$scope', 'ProjectFactory', '$timeout'];
    function projectListTableCtrl( $scope, ProjectFactory, $timeout ) {


        var $this = this;
        $this.projects = [];
        $this.pages = [5, 10, 15];
        $this.onPage = 10;
        $this.isLoading = false;
        $this.results = true;
        $this.changeActive = changeActive;
        $this.deleteRow = deleteRow;
        $this.filters = $scope.$eval( $scope.filter );

        /**
         * Load data per page
         * @param {type} tableState
         * @returns {undefined}
         */
        this.loadData = function callServer( tableState ) {
            $this.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || $this.onPage;

            ProjectFactory.getPage( start, number, tableState, $this.filters ).then( function( result ) {


                var number_to = eval( parseInt( number ) + parseInt( start ) );
                $this.projects = result.data;

                $this.table = {
                    start : start + 1,
                    number : number_to < result.total ? number_to : result.total,
                    total : result.total
                };


                tableState.pagination.numberOfPages = result.numberOfPages;

                $this.isLoading = false;

                $this.results = $this.projects !== undefined ? true : false;


            } );
        };
        /**
         * Change active
         * @param {type} state
         * @param {type} $project
         * @returns {undefined}
         */
        function changeActive( state, $project ) {
            ProjectFactory.save( { 'Project' : { id : $project, active : state === true ? 1 : 0 } } );
        }
        ;


        /**
         * Delete row
         * @returns {undefined}
         */
        function deleteRow( id ) {
            var promise = ProjectFactory.delete( id );
            promise.then( deleteSuccess );
        }


        /**
         * Delete success - vymaze zaznam z DB a z pola this.projectData
         * @param object data - data  (Id vymazaneho projektu)
         * @returns {undefined}
         */
        function deleteSuccess( data ) {
            $timeout( function() {
                angular.forEach( $this.projects, function( value, i ) {
                    if ( value.Project.id === data.data.id ) {
                        $this.projects.splice( i, 1 );
                    }
                } );
            }, 400 )
        }

    }
    ;

})();

