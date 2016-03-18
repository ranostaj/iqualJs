<!DOCTYPE html>
<html lang="en" html-lang ng-app="forum" class="app">
    <head>
        <meta charset="utf-8" />
        <title>iQual</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="<?php echo BASE_PATH ?>/css/bootstrap.css" type="text/css" />
        <link rel="stylesheet" href="<?php echo BASE_PATH ?>/css/animate.css" type="text/css" />
        <link rel="stylesheet" href="<?php echo BASE_PATH ?>/css/font-awesome.min.css" type="text/css" />
        <link rel="stylesheet" href="<?php echo BASE_PATH ?>/css/font.css" type="text/css" />
        <link rel="stylesheet" href="<?php echo BASE_PATH ?>/css/app.css" type="text/css" />
        <link href="<?php echo BASE_PATH ?>/css/main.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo BASE_PATH ?>/css/custom.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo BASE_PATH ?>/css/public.css" rel="stylesheet" type="text/css"/>
    </head>
    <body class="public" ng-controller="PublicController">

        <header class="bg-dark dk header navbar navbar-fixed-top-xs">
            <div class="navbar-header aside-md">
                <a class="btn btn-link visible-xs" data-toggle="class:nav-off-screen,open" data-target="#nav,html">
                    <i class="fa fa-bars"></i>
                </a>
                <a href="#" class="navbar-brand"><img src="<?php echo BASE_PATH ?>/img/logo.png" class="m-r-sm"></a>
                <a class="btn btn-link visible-xs" data-toggle="dropdown" data-target=".nav-user">
                    <i class="fa fa-cog"></i>
                </a>
            </div>

            <?php
              if (isset($auth))
              {
                  ?>
                  <ul class="nav navbar-nav  m-n hidden-xs nav-user">
                      <li>
                          <a href="<?php echo BASE_PATH ?>/#/<?php echo $auth['Role']['name'] ?>">
                              <span class="font-bold" translate>HOME</span>
                          </a>
                      </li>
                  </ul>


                  <ul class="nav navbar-nav navbar-right m-n hidden-xs nav-user">
                      <li dropdown >
                          <a href="#" href="javascript:void(null)"   dropdown-toggle >
                              <img ng-src="<?php echo BASE_PATH ?>/img/flags/{{language.code}}.gif" /> ({{language.code}})<b class="caret"></b>
                          </a>

                          <ul class="dropdown-menu animated fadeInRight">
                              <span class="arrow top"></span>
                              <li ng-repeat="lang in languages">
                                  <a href="javascript:void(null)"  ng-click="selectLanguage( lang )">
                                      <img ng-src="<?php echo BASE_PATH ?>/img/flags/{{lang.code}}.gif" /> {{lang.name}}
                                  </a>
                              </li>

                          </ul>
                      </li>
                      <li>
                          <a href="javascript::void(null)"  >
                              <span class="thumb-sm avatar pull-left">
                                  <?php echo $this->Html->Image(BASE_PATH . '/img/avatars/icon-' . $auth['pictogram_id'] . '.png') ?>
                              </span>
                              <?php echo $auth['name'] ?>
                          </a>

                      </li>
                      <li>
                          <a href="#" ng-click="Logout( $event )"><i class="fa fa-power-off"></i> {{ 'LOGOUT' | translate }}</a>
                      </li>
                  </ul>
              <?php } ?>

        </header>


        <header class="header bg-white b-b b-light">
            <div class="container">
                <h2 class=" font-thin m-t-sm">{{ 'ANSWER_REACTION' | translate }}</h2>
            </div>
        </header>

        <div class="container">
            <div class="m-t-lg">
                <?php echo $this->fetch('content'); ?>
            </div>
        </div>



        <script src="<?php echo BASE_PATH ?>/js/vendor/angular.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-route.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/ui-bootstrap.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/fileupload/angular-file-upload.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-timeago.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-cookie.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-translate.min.js"></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-translate-storage-cookie.min.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-translate-storage-local.min.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/vendor/angular-translate-loader-static-files.min.js"></script>
        <!-- APP scripts -->
        <script src="<?php echo BASE_PATH ?>/js/public/app.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/global/constants/global-constants.js"  ></script>


        <!-- SERVICES -->
        <script src="<?php echo BASE_PATH ?>/js/users/services/user-service.js"  ></script>
        <script src="<?php echo BASE_PATH ?>/js/users/services/auth-service.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/themes/services/comment-service.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/global/directives/global-directives.js" ></script>

        <!-- FACTORIES -->
        <script src="<?php echo BASE_PATH ?>/js/global/factories/translate-factory.js" ></script>
        <script src="<?php echo BASE_PATH ?>/js/themes/factories/comment-factory.js"  ></script>

        <!-- CONTROLLER -->
        <script src="<?php echo BASE_PATH ?>/js/public/controllers.js" ></script>

    </body>
</html>
