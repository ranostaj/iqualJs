/**
 * User controller
 * @returns {undefined}
 */




(function() {
    "use strict";
    angular.module( 'user.controllers' )
            .controller( 'UserController', UserController );

    UserController.$inject = ['$scope',
        '$rootScope',
        '$location',
        '$modal',
        'ThemeFactory',
        'UserFactory',
        '$q',
        '$timeout'];

    var UserModalController = function( $scope, $modalInstance, data ) {
        $scope.data = data;
    };



    function UserController(
            $scope,
            $rootScope,
            $location,
            $modal,
            ThemeFactory,
            UserFactory,
            $q,
            $timeout
            ) {

        this.breadcrumb = [{ title : "Zoznam užívateľov" }];


        // variables
        var $this = this,
                /**
                 * Modal Options
                 * @type type
                 */
                modal_options = {
                    templateUrl : 'js/modal/templates/user-modal.html',
                    controller : UserModalController,
                    resolve : {
                        data : function() {
                            return $this.user;
                        }
                    }
                };


        this.viewUser = function( id ) {
            UserFactory.view( { id : id } ).then( function() {
                $this.user = UserFactory.data;
                $modal.open( modal_options );
            } );

        };

    }
    ;





})();