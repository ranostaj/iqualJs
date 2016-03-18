/**
 * Common  Directives
 * @param {type} param1
 * @param {type} param2
 *
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('breadcrumb', breadcrumb);
    /**
     * Breadcrumb
     * @returns
     */
    breadcrumb.$inject = ['UserService', 'BaseConst'];
    function breadcrumb(UserService, BaseConst) {
        return {
            scope: {
                data: '='
            },
            restrict: 'E',
            replace: true,
            templateUrl: 'js/global/directives/templates/breadcrumb.html',
            link: function(scope, elem, attr) {
                scope.show_demo_info = BaseConst.enviroment() === 'demo' ? true : false;
                UserService.getUserData().then(function(userdata) {
                    scope.role = userdata.role;
                });
                scope.$watch('data', function(n, o) {

                    scope.links = n;
                });
            }
        };
    }
    ;
})();


'use strict';
(function() {
    angular.module('global.directives').
            directive('focusOn', focusOn);

    focusOn.$inject = ['$timeout'];
    function focusOn($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                if ($attr.ngIf) {
                    $scope.$watch($attr.ngIf, function(newValue) {
                        if (newValue) {
                            $timeout(function() {
                                $element.focus();
                            }, 0);
                        }
                    })
                }
            }
        };
    }

})();


/**
 * Loading button
 * @returns {undefined}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('loadingButton', loadingButton);



    loadingButton.$inject = ['$timeout', '$ocLazyLoad'];
    function loadingButton($timeout, $ocLazyLoad) {

        return {
            replace: true,
            restrict: 'A',
            scope: {
                click: '&',
                stopEvent: '=stop'
            },
            compile: function(element, attrs) {
                var style = attrs.style ? attrs.style : 'expand-left';
                element.replaceWith('<button type="submit" data-size="' + attrs.size + '"   data-style="' + style + '"  class="btn ladda-button"  > {{ "' + attrs.text + '" | translate}} </button></span>');
                var ladda;
                return {
                    pre: function(scope, elem, attr) {

                    },
                    post: function(scope, elem, attr) {

                        $ocLazyLoad.load({
                            serie: true,
                            cache: false,
                            files: [
                                'js/vendor/spin.min.js',
                                'js/vendor/ladda.min.js'
                            ]
                        }).then(function() {


                            ladda = Ladda.create(elem[0]);
                            elem.bind('click', function() {
                                ladda.start();
                                scope.stopEvent = false;
                                scope.click();
                            });
                            angular.element(elem).addClass(attr.class);
                            scope.$watch('stopEvent', function(n, o) {
                                if (n !== false && n !== undefined) {
                                    ladda.stop();
                                }
                            });
                        });
                    }

                }
            }

        }
    }
    ;
})();


/**
 * Message Directive
 * @returns {_L9.directives.message.Anonym$0}
 */
(function() {

    angular.module('global.directives').
            directive('message', message);
    function message() {

        return {
            scope: {
                text: '@'
            },
            template: '<div class="alert alert-info"> \n\
                       <p class="m-b-n"><i class="fa fa-{{type}}"></i> {{text}}</p></div>',
            link: function(scope, elem, attr) {
                scope.type = attr.type === undefined ? 'info' : attr.type;
            }

        }
    }

})();



var directives = {};
/**
 * Label on off
 * @returns
 */

(function() {

    angular.module('global.directives').
            directive('labelOnOff', labelOnOff);


    labelOnOff.$inject = ['UserService', 'ProjectService', 'ThemeService'];
    function labelOnOff() {

        return {
            scope: {
                data: '@',
                service: "@"
            },
            restrict: 'A',
            controller: function($scope, UserService, ProjectService, ThemeService) {
                var data = JSON.parse($scope.data);
                $scope.active = data.active;
                $scope.switch = function(active) {
                    var active_state = data.active = active == 1 ? 0 : 1;
                    switch ($scope.service) {
                        case "project":
                            ProjectService.save({Project: data}).then(function(response) {
                                $scope.active = response.data.data.Project.active;
                            });
                            break;
                        case "theme":
                            ThemeService.save({Theme: data}).then(function(response) {
                                $scope.active = response.data.data.Theme.active;
                            });
                            break;
                    }
                }
            },
            templateUrl: 'js/global/directives/templates/label-on-off.html',
            link: function(scope, elem, attr) {

            }
        };
    }
    ;
})();







/**
 * Active status
 * @returns {undefined}
 */
'use strict';
(function() {

    angular.module('global.directives').
            directive('status', status);

    function status() {

        return {
            scope: {
                active: '@'
            },
            replace: true,
            template: '<span class="label" ng-class="{\'label-danger\':active==0, \'label-success\':active==1 }" ><i class="fa fa-circle"></i></span>'
        };
    }
    ;

})();

/**
 * Switch directive
 * attr model
 * @returns {_L9.directives.switch.Anonym$3}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('switch', switchFn);

    function switchFn() {
        return {
            scope: {
                bindModel: '=model',
                change: '&',
                switchClass: '@'
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'js/global/directives/templates/switch.html',
            link: function(scope, elem, attr) {

                scope.switchChange = function(bindModel) {
                    scope.change({model: bindModel});
                }
            }

        };
    }
    ;

})();



/**
 * Change state directive
 *
 */


'use strict';
(function() {

    angular.module('global.directives').
            directive('changeState', changeState);


    function changeState() {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                change: '&',
                bindModel: '=ngModel',
                btnClass: '@'
            },
            template: '<div ng-class="{\'btn-group\': true, \'btn-group-xs\':btn ==\'btn-xs\'}">\n\
                     <label class="btn btn-success {{btnClass}}"   ng-model="bindModel" btn-radio="\'1\'" uncheckable>{{ "ACTIVE" | translate }}</label>' +
                    '<label class="btn btn-default {{btnClass}}"   ng-model="bindModel" btn-radio="null" uncheckable >{{ "ALL" | translate }}</label>' +
                    '<label class="btn btn-danger {{btnClass}}"    ng-model="bindModel" btn-radio="\'0\'" uncheckable >{{ "INACTIVE" | translate }}</label>\n\
                    </div>',
            link: function(scope, elem, attrs) {

                scope.btn = scope.btnClass ? scope.btnClass : 'btn-xs';
                scope.$watch('bindModel', function(n, o) {
                    scope.change();
                })
            }
        }

    }
})();


/**
 * Youtube validate
 * attr model
 * @returns {_L9.directives.switch.Anonym$3}
 */


'use strict';
(function() {

    angular.module('global.directives').
            directive('youtubeValidate', youtubeValidate);

    function youtubeValidate() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, c) {
                var regexp = new RegExp(/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/);
                scope.$watch(attr.ngModel, function(val, old) {
                    if (val === '' || val === undefined) {
                        c.$setValidity('youtube', true);
                    } else {
                        c.$setValidity('youtube', regexp.test(val));
                    }
                });
            }
        }
    }
})();





/**
 * Youtube iframe
 * @param {type} $sce
 * @returns {_L9.directives.youtube.Anonym$6}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('youtube', youtube);


    function youtube($sce, $modal) {

        var youtubeCtrl = function($scope, $modal) {


            $scope.lightbox = function() {

                $modal.open({
                    templateUrl: 'js/modal/templates/youtube-modal.html',
                    controller: function($scope, $modalInstance, $sce, code) {
                        console.log(code);
                        $scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + code);
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: 'lg',
                    resolve: {
                        code: function() {
                            return  $scope.code
                        }
                    }
                });
            }
        };
        return {
            restrict: 'EA',
            scope: {code: '='},
            replace: true,
            templateUrl: 'js/global/directives/templates/youtube.html',
            controller: youtubeCtrl
        };
    }
    ;

})();


/**
 * Unique user name validation
 * @param {type} UserFactory
 * @returns {_L9.directives.uniqueUser.Anonym$7}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('uniqueUser', uniqueUser);


    uniqueUser.$inject = ['UserFactory', '$rootScope', '$timeout'];

    function uniqueUser(UserFactory, $rootScope, $timeout) {


        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ngModel, function(n, o) {
                    if (ctrl.$viewValue !== '' && ctrl.$viewValue !== undefined) {
                        UserFactory.validate({username: n}).then(function(resp) {
                            ctrl.$setValidity('unique', false);
                            $timeout(function() {
                                $rootScope.$broadcast('unique:exists', UserFactory.data)
                            }, 400);
                        }, function() {
                            ctrl.$setValidity('unique', true);
                            $rootScope.$broadcast('unique:noexists', false)
                        });
                    }
                });
            }
        };
    }
    ;

})();



/**
 * User projects table
 * @param {type} UserFactory
 * @returns {undefined}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('userProjects', userProjects);

    userProjects.$inect = ['UserFactory', '$rootScope', '$q', '$filter'];

    function userProjects(UserFactory, $rootScope, $q, $filter) {

        var ctrl = function($scope, UserFactory) {

            $scope.deleteUser = function($event, $index, obj) {
                $event.preventDefault();
                UserFactory.deleteFromProject(obj).success(function() {
                    $scope.projects.splice($index, 1);
                    $rootScope.$broadcast('userProjects:delete', obj);
                });
            }

        };
        return {
            controller: ctrl,
            transclude: true,
            scope: {
                userUsername: '=',
                projectId: '='
            },
            templateUrl: 'js/global/directives/templates/user-projects.html',
            link: function(scope, elem, attr) {

                scope.$watch('userUsername', function(n, o) {
                    if (n !== undefined) {
                        UserFactory.view({username: n}).then(function(resp) {
                            scope.user = UserFactory.data.User;
                            scope.projects = UserFactory.data.Project;
                            $rootScope.$broadcast('userProjects', UserFactory.data);
                            scope.message = attr.message;
                        }, function(err) {
                            scope.projects = [];
                            scope.message = null;
                            $rootScope.$broadcast('userProjects', {});
                            $q.reject(err.data);
                        });
                    } else {
                        scope.projects = [];
                    }
                });
            }
        }
    }
    ;

})();

/**
 * password verify
 * @returns {_L9.directives.passwordVerify.Anonym$7}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('passwordVerify', passwordVerify);


    function passwordVerify() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, model) {
                if (!attrs.passwordVerify) {
                    console.error('passwordVerify expects a model as an argument!');
                    return;
                }
                scope.$watch(attrs.passwordVerify, function(value) {
                    // if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('passwordVerify', value === model.$viewValue);
                    //  }
                });
                model.$parsers.push(function(value) {

//               if (value === undefined || value === '') {
//                    model.$setValidity('passwordVerify', true);
//                    return value;
//                }
                    var isValid = value === scope.$eval(attrs.passwordVerify);
                    model.$setValidity('passwordVerify', isValid);
                    //return isValid ? value : undefined;
                    return value;
                });
            }
        };
    }
})();


/**
 * Exists in project
 * @returns {_L9.directives.globalNotification.Anonym$8}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('existsInProject', existsInProject);

    existsInProject.$inject = ['UserFactory', '$timeout', '$filter'];
    function existsInProject(UserFactory, $timeout, $filter) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, model) {
                scope.$watch(attrs.project, function(project_id, v) {
                    if (project_id !== undefined) {
                        scope.$watch(attrs.ngModel, function(value) {
                            if (model.$viewValue !== undefined && model.$viewValue !== '') {
                                UserFactory.view({username: value}).then(function(resp) {
                                    var exists = $filter('filter')(UserFactory.data.Project, function(value, index) {
                                        return value.id === project_id ? value : false;
                                    });
                                    model.$setValidity('existsInProject', !exists.length);
                                }, function() {
                                    model.$setValidity('existsInProject', true);
                                });
                            }
                        });
                    }
                });
            }
        };
    }
    ;

})();
/**
 * Notification
 * @returns {_L9.directives.globalNotification.Anonym$8}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('notification', notification);


    function notification() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/global/directives/templates/notification.html',
            controller: function($scope, $timeout, $rootScope)
            {
                $rootScope.$on("notification", function(ev, notification)
                {

                    if (!notification)
                        return false;
                    angular.element('.notification').addClass('fadeInDown');
                    $scope.type = notification.type;
                    $scope.messages = typeof notification.text === 'object' ? notification.text : [notification.text];
                    $scope.show = true;
                    $timeout(function()
                    {
                        angular.element('.notification').addClass('fadeOutUp');
                    }, 5000).then(function() {
                        $timeout(function() {
                            $scope.show = false;
                            angular.element('.notification').removeClass('fadeOutUp');
                        }, 1000);
                    });
                });
            }
        };
    }
    ;

})();


/**
 * Render user image
 * @param {type} UserService
 * @returns {_L9.directives.userImage.Anonym$11}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('userImage', userImage);

    userImage.$inject = ['UserService', '$rootScope'];

    function userImage(UserService, $rootScope) {

        return {
            replace: true,
            restrict: 'A',
            scope: {
                userData: '@'

            },
            template: ' <img src="img/avatars/icon-{{image}}.png" class="img-circle" alt="" width="{{width}}" />',
            link: function(scope, elem, attr) {
                var user_data = false;
                scope.width = attr.width ? attr.width : 40;
                user_data = scope.userData ? JSON.parse(scope.userData) : false;
                if (!user_data) {
                    UserService.getUserData().then(function(userdata) {
                        scope.image = userdata.user.pictogram_id;
                    });
                } else {
                    scope.image = user_data.pictogram_id;
                }

                $rootScope.$on('pictogram_change', function(event, data) {
                    if (data.user.id === user_data.id)
                        scope.image = data.pictogram;
                    if (!user_data)
                        scope.image = data.pictogram;
                });
            }
        }
    }
})();


/**
 * confirm directive
 * @param {type} $modal
 * @returns {_L9.directives.ngConfirm.Anonym$12}
 */


'use strict';
(function() {

    angular.module('global.directives').
            directive('ngConfirm', ngConfirm);


    function ngConfirm($modal) {

        var ModalInstanceCtrl = function($scope, $modalInstance, message, description) {
            $scope.message = message;
            $scope.description = description;
            $scope.ok = function() {
                $modalInstance.close();
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        };
        return {
            restrict: 'A',
            scope: {
                ngConfirmClick: "&"
            },
            link: function(scope, element, attrs) {

                element.bind('click', function() {

                    var message = attrs.ngConfirmMessage || "Naozaj vymazať ?";
                    var description = attrs.ngConfirmDescription || null;
                    //console.log(message);
                    var modalInstance = $modal.open({
                        templateUrl: 'js/modal/templates/confirm-modal.html',
                        controller: ModalInstanceCtrl,
                        resolve: {
                            message: function() {
                                return message
                            },
                            description: function() {
                                return description
                            }

                        }
                    });
                    modalInstance.result.then(function() {
                        scope.ngConfirmClick();
                    }, function() {

                    });
                });
            }
        }
    }
})();

/**
 * pagination counter
 * @returns {undefined}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('paginCounter', paginCounter);


    function paginCounter() {

        return {
            restrict: 'A',
            scope: {
                count: '='
            },
            template: '<div class="text-right"><small class="text-muted"> {{ "DISPLAYED_RESULTS"|  translate }} <strong>{{count ? count : 0}}</strong> {{ "RESULTS" | translate}}</small></div>'
        };

    }
})();



'use strict';
(function() {

    angular.module('global.directives').
            directive('ruller', ruller);

    ruller.$inject = ['$cookieStore'];

    function ruller($cookieStore) {

        return {
            scope: {
                elements: '@',
                max: '@',
                min: '@'
            },
            link: function(scope, elem, attr) {
                var elems = JSON.parse(scope.elements);
                var mainmin;
                var min = mainmin = scope.min;
                var max = scope.max;
                var from_elem = angular.element('#' + elems.from);
                var to_elem = angular.element('#' + elems.to);
                setTimeout(function() {
                    elem.height(elem.parent().height());
                }, 100)


                angular.element(elem).on('mousedown', function(e) {
                    e.preventDefault();
                    from_elem.removeClass('expand').addClass('ruller-content');
                    angular.element(document).on('mousemove', function(e) {
                        e.preventDefault();
                        var x = e.pageX - from_elem.offset().left;
                        if (x > min && x < max && e.pageX < (angular.element(window).width() - mainmin)) {
                            from_elem.css("width", x);
                            to_elem.css("margin-left", x);
                            $cookieStore.put('ruller', x);
                        }
                    });
                });
                angular.element(document).on('mouseup', function(e) {
                    from_elem.removeClass('ruller-content');
                    angular.element(document).unbind('mousemove');
                });
            }
        }
    }
})();

/**
 * Lightbox gallery
 * @returns {_L9.directives.gallery.Anonym$17}
 */


'use strict';
(function() {

    angular.module('global.directives').
            directive('gallery', gallery);

    gallery.$inject = ['$modal'];

    function gallery($modal) {

        return  {
            scope: {
                images: '=',
                thumb: '@',
                original: '@'
            },
            templateUrl: 'js/global/directives/templates/gallery.html',
            link: function(scope, elem, attr) {

                var paths = {thumb: scope.thumb, original: scope.original};
                scope.showImage = function(image, images) {

                    $modal.open({
                        templateUrl: 'js/modal/templates/lightbox-modal.html',
                        size: 'lg',
                        resolve: {
                            image: function() {
                                return angular.extend(image, paths);
                            },
                            images: function() {
                                var data = [];
                                angular.forEach(scope.images, function(img) {
                                    data.push(angular.extend(img, paths));
                                });
                                return data;
                            }

                        },
                        controller: function($scope, $modalInstance, image, images) {
                            $scope.images = images;
                            $scope.image = image;
                            $scope.showImage = function(img) {
                                console.log(img);
                                $scope.image = img
                            }

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };
                        }
                    });
                };
            }
        }


    }
})();

/**
 * Slim Scroll
 * @param {type} $timeout
 * @returns {_L9.directives.slimScroll.Anonym$28}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('slimScroll', slimScroll);

    slimScroll.$inject = ['$timeout'];
    function slimScroll($timeout) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                var $resize, $opts, $options;
                var setScroll = function(window_height) {

                    $options = {
                        height: eval(window_height ? window_height : window.innerHeight) - angular.element(elem).offset().top + 'px'
                    };
                    $opts = angular.extend({}, $options, scope.$eval(attrs.slimScroll));
                    angular.element(elem).slimScroll($opts);
                };
                angular.element(window).on('resize', function(e) {
                    $timeout(function() {
                        setScroll(e.target.window.innerHeight);
                    }, 500);
                });
                $timeout(function() {
                    setScroll();
                    scope.$apply();
                }, 100);
            }
        };

    }
})();

/**
 * Auto grow textarea
 * @returns {Function}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('autoGrow', autoGrow);



    function autoGrow() {
        return function(scope, element, attr) {

            var defaults = {
                'height': '30px',
                'overflow': 'hidden'
            }

            var attributes = angular.extend(defaults, scope.$eval(attr.autoGrow));
            angular.element(element).css(attributes);
            var update = function(value) {
                if (value !== undefined) {
                    if (element[0].scrollHeight > parseInt(attributes.height))
                        element.css("height", element[0].scrollHeight + "px");
                }
            };
            scope.$watch(attr.ngModel, function(n, o) {
                update(n);
            });
            attr.$set("ngTrim", "false");
        }
    }
    ;
})();

/**
 * Body class
 * @returns {undefined}
 */

'use strict';
(function() {

    angular.module('global.directives').
            directive('bodyClass', bodyClass);

    bodyClass.$inject = ['$location', '$rootScope', '$route'];

    function bodyClass($location, $rootScope, $route) {
        return function(scope, elem, attr) {

            $rootScope.$on("$stateChangeStart", function(event, next, current) {
                var url = next.name.replace(/\./g, '-');
                elem.attr('class', null).addClass(url);
            });
        };
    }
    ;
})();

/**
 * Set HTML lang
 * @returns {undefined}
 */
'use strict';
(function() {

    angular.module('global.directives').
            directive('htmlLang', htmlLang);

    htmlLang.$inject = ['$location', '$rootScope', 'TranslateFactory'];

    function htmlLang($location, $rootScope, TranslateFactory) {
        return function(scope, elem, attr) {


            $rootScope.$on("lang-change", function($event, $lang) {
                changeHtmlLang($lang);
            });


            var lang = TranslateFactory.getDefault();
            changeHtmlLang(lang.code);


            function changeHtmlLang($lang) {
                document.getElementsByTagName("html")[0].setAttribute("lang", $lang);
            }
        };
    }
    ;
})();


/**
 * Smart table directive counter
 * @returns {undefined}
 */
'use strict';
(function() {

    angular.module('global.directives').
            directive('stCounter', stCounter);

    function stCounter() {

        var directive = {
            scope: {},
            restrict: 'EA',
            require: '^stTable',
            link: link
        }

        return directive;

        /////
        function link(scope, elem, attr, ctrl) {

            scope.$watch(function() {
                return ctrl.tableState();
            }, function(newValue, oldValue) {

            })
        }
        ;
    }
    ;
})();




/**
 * Load loadScroll
 * @returns {undefined}
 */
'use strict';
(function() {

    angular.module('global.directives').
        directive('loadScroll', loadScroll);

    function loadScroll() {

        var directive = {
            restrict: 'A',
            link: link
        }

        return directive;

        /////
        function link(scope, elem, attr, ctrl) {
            var element = elem[0];
            elem.bind('scroll', function() {
                if(element.scrollTop + element.offsetHeight >= element.scrollHeight) {
                    scope.$apply(attr.loadScroll).then(function(response) {

                    })
                }

            })
        }

    }

})();


