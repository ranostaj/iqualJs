/**
 * @desc Theme add form
 * @param theme =
 * @usage <div theme-add-form theme="=" ></button>
 *
 */
'use strict';

(function() {

    /**
     * Module name
     */
    angular
            .module( 'theme.directives' )
            .directive( 'themeAddForm', themeAddForm )
            .controller( 'themeAddCormCtrl', themeAddCormCtrl );


    /**
     * Directive
     * @returns
     */
    function themeAddForm() {

        var directive = {
            scope : {
                theme : '=',
                saveFn : '&'
            },
            restrict : 'A',
            replace : true,
            templateUrl : 'js/themes/directives/templates/theme-add-form.html',
            controller : themeAddCormCtrl,
            controllerAs : 'ctrl',
            link : function( scope, elem, attr ) {

            }
        };

        return directive;

    }
    ;

    themeAddCormCtrl.$inject = ['$scope', 'ProjectFactory', 'ThemeFactory'];
    /**
     * Directive controller
     * @param {type} $scope
     * @param {type} ProjectFactory
     * @returns {_L9.themeAddCormCtrl}
     */
    function themeAddCormCtrl( $scope, ProjectFactory, ThemeFactory ) {

        var $this = this;
        this.formData = { };

        $scope.$watch( 'theme', function( data ) {
            $this.formData = data;
        } );

        ProjectFactory.dropdown().then( function( response ) {
            $this.projects = response;
        } );


        this.changeActive = function() {
            var status = $this.formData.Theme.active == 1 ? 'aktivna' : 'neaktívna';
            saveTheme( status );
        };

        this.changeType = function() {
            var status = $this.formData.Theme.type == 1 ? 'one to one' : 'public';
            saveTheme( status );
        };

        var saveTheme = function( status ) {
            ThemeFactory.save( { 'Theme' : $this.formData.Theme } );
        }

    }

})();

