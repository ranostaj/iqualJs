

<div>
    <ul class="nav navbar-nav  m-n hidden-xs nav-user" >
        <li class="active">
            <a ui-sref="<?php echo $user_role ?>.home"  >
                <i class="fa fa-dashboard icon">
                    <b class="bg-danger"></b>
                </i>
                <span translate>HOME</span>
            </a>
        </li>


        <?php if ($user_role == 'admin') : ?>
              <li  dropdown    >
                  <a href="javascript:void(null)"   dropdown-toggle >
                      <i class="fa fa-file-o icon">
                          <b class="bg-warning"></b>
                      </i>

                      <span>{{ 'PROJECTS' |  translate }} <i class="fa fa-angle-down text"></i>  </span>
                  </a>
                  <ul class="dropdown-menu" >
                      <li   >
                          <a href="javascript:void(null)"  ng-click="addProject( $event )">
                              <i class="fa fa-plus"></i>
                              <span translate>
                                  CREATE_PROJECT
                              </span>
                          </a>
                      </li>
                      <li  >
                          <a ui-sref="admin.project" >
                              <i class="fa fa-list-alt"></i>
                              <span translate >PROJECT_LIST</span>
                          </a>
                      </li>

                  </ul>
              </li>

              <li dropdown>
                  <a href="javascript:void(null)"  dropdown-toggle>
                      <i class="fa fa-flask icon">
                          <b class="bg-success"></b>
                      </i>

                      <span>{{ 'TOPICS' |  translate }} <i class="fa fa-angle-down text"></i></span>
                  </a>
                  <ul class="dropdown-menu">
                      <li>
                          <a href="javascript:void(null)" add-new-theme >
                              <i class="fa fa-plus"></i>
                              <span translate>CREATE_TOPIC</span>
                          </a>
                      </li>
                      <li>
                          <a ui-sref="admin.theme">
                              <i class="fa fa-list-alt"></i>
                              <span translate>TOPICS_LIST</span>
                          </a>
                      </li>

                  </ul>
              </li>
              <li dropdown>
                  <a href="javascript:void(null)"  dropdown-toggle >
                      <i class="fa fa-user icon">
                          <b class="bg-primary"></b>
                      </i>

                      <span>{{ "USERS" |  translate }}<i class="fa fa-angle-down text"></i></span>
                  </a>
                  <ul class="dropdown-menu">
                      <li>
                          <a ui-sref="admin.user"">
                              <i class="fa fa-list-alt"></i>
                              <span translate>USERS_LIST</span>
                          </a>
                      </li>

                  </ul>
              </li>
          <?php endif; ?>
    </ul>
    <ul class="nav navbar-nav navbar-right m-n hidden-xs nav-user">
        <li dropdown ng-if="allow_language" >
            <a href="#" href="javascript:void(null)"   dropdown-toggle >

                <img ng-src="img/flags/{{language.code}}.gif" /> ({{language.code}})<b class="caret"></b>
            </a>

            <ul class="dropdown-menu animated fadeInRight">
                <span class="arrow top"></span>
                <li ng-repeat="lang in languages">
                    <a href="javascript:void(null)"  ng-click="selectLanguage( lang )">
                        <img ng-src="img/flags/{{lang.code}}.gif" /> {{lang.name}}
                    </a>
                </li>

            </ul>
        </li>

        <?php if ($user_role != 'client') : ?>
              <li class="hidden-xs">
                  <a href="#" ng-click="showNotifications( $event )" >
                      <i class="fa fa-bell"></i>
                      <span ng-show="notifications" class="badge badge-sm up bg-danger m-l-n-sm count animated fadeInDown" style="display: inline-block;">{{notifications}}</span>
                  </a>

              </li>
          <?php endif; ?>
        <li dropdown >
            <a href="#" href="javascript:void(null)"   dropdown-toggle >
                <span class="thumb-sm avatar pull-left">
                    <div user-image></div>
                </span>
                <?php echo $user_name ?><b class="caret"></b>
            </a>

            <ul class="dropdown-menu animated fadeInRight">
                <span class="arrow top"></span>
                <li>
                    <a href="#"  ng-click="changePassword( $event )"   >
                        <i class="fa fa-lock"></i>  {{ 'PASSWORD_CHANGE' |  translate }}

                    </a>
                </li>
                <li>
                    <a href="#"  ng-click="pictogram( $event )"   >

                        <i class="fa fa-picture-o"></i>  {{ 'PICTOGRAM' |  translate }}
                    </a>
                </li>


            </ul>
        </li>
        <li>
            <a href="#" ng-click="Logout( $event )"><i class="fa fa-power-off"></i>
                {{ 'LOGOUT' |  translate }}

            </a>

        </li>
    </ul>

    <?php if ($user_role != 'client') : ?>
          <sidebar-notification data="{{notifications}}" open="open_notification">
              <user-comment-react></user-comment-react>
          </sidebar-notification>
      <?php endif; ?>
</div>









