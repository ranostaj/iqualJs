/**
 * Project Table Directive
 * @param {type} param1
 * @param projects="=" = JSON string
 * @usage <div project-users project-id="@"  ></div>
 *
 */

(function() {
    'use strict';
    angular.module( 'project.directives' )
            .directive( 'projectUsers', projectUsers );


    projectUsers.$inject = ['$modal', 'UserFactory', 'ProjectFactory']
    /**
     * Directive
     * @returns
     */
    function projectUsers( $modal, UserFactory, ProjectFactory ) {

        var directive = {
            scope : {
                projectId : '@'
            },
            restrict : 'A',
            link : link
        };

        return directive;
        ///////////////////////



        /**
         * Hanlde click event
         * @param {type} scope
         * @param {type} elem
         * @param {type} attr
         * @returns {undefined}
         */
        function link( scope, elem, $attr ) {
            elem.bind( 'click', function( $event ) {
                openModal( $attr, $event );
            } );
        }
        ;


        /**
         * Open modal
         * @param {type} $attr
         * @param {type} $event
         * @returns {undefined}
         */
        function openModal( $attr, $event ) {
            $event.preventDefault();
            $modal.open( {
                controller : 'projectUsersCtrl as ctrl',
                templateUrl : 'js/modal/templates/project-users-modal.html',
                size : 'lg',
                resolve : {
                    ResolveData : function()


                    {
                        return ProjectFactory.users( $attr.projectId ).then( function( response ) {

                            return   {
                                data : ProjectFactory.data,
                                project_id : $attr.projectId
                            };
                        } );
                    }
                }
            } );
        }
    }



})();

