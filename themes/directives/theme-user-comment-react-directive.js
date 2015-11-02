/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
    'use strict';
    angular.module( 'theme.directives' ).
            directive( 'userCommentReact', userCommentReact );

    function userCommentReact() {

        return {
            scope : { },
            restrict : 'E',
            replace : true,
            templateUrl : 'js/themes/directives/templates/theme-user-comment-react.html',
            controller : 'ThemeUserReactController',
            controllerAs : 'ctrl'
        };
    }
    ;

})();
