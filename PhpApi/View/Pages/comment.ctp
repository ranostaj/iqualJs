
<div >
    <div class="animated fadeInDown" ng-hide="answered">
        <div class="row">
            <div class="col-md-6">
                <h2 class="m-t-none font-thin"><?php echo $comment['Theme']['name'] ?> </h2>

                <?php echo $comment['Theme']['text'] ?>
            </div>

            <div class="col-md-6">
                <section class="panel panel-default">
                    <h4 class="font-thin padder">{{ 'FROM' | translate }}:
                        <span class="label label-info font-thin">
                            <?php echo $comment['User']['name'] ?></span>
                    </h4>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <p><?php echo $comment['Comment']['text'] ?></p>
                            <small class="block text-muted"><i class="fa fa-clock-o"></i>
                                <span class="text-sm text-muted " time-ago from-time="<?php echo $comment['Comment']['created'] ?>"></span>
                            </small>
                        </li>

                    </ul>
                </section>

                <section class="panel panel-default">
                    <form ng-submit="saveComment( $event )" name="commentForm">
                        <textarea class="form-control no-border" required ng-model="FormData.text" rows="3" auto-grow="{'height': '100px'}"
                                  placeholder="{{ 'INSERT_YOUR_ANSWER_HERE' | translate }}"></textarea>

                        <input type="hidden" ng-model="FormData.theme_id" ng-init="FormData.theme_id = '<?php echo $comment['Theme']['id'] ?>'"  />
                        <input type="hidden" ng-model="FormData.parent_id" ng-init="FormData.parent_id = '<?php echo $comment['Comment']['id'] ?>'"  />

                        <footer class="panel-footer bg-light lter">
                            <button ng-disabled="commentForm.$invalid" class="btn btn-info pull-right btn-sm">
                                {{ 'SEND_ANSWER' | translate }}
                            </button>
                            <ul class="nav nav-pills nav-sm">
                            </ul>
                        </footer>
                    </form>
                </section>
            </div>

        </div>




        <script type="text/ng-template" id="myModalContent.html">
            <div class="modal-header">
            <div class="alert alert-danger" ng-show="loginError">
            <p><i class="fa fa-warning"></i> {{'WRONG_PASSWORD' | translate }}</p>
            </div>
            <h3 class="modal-title"> {{'LOGIN_AS' | translate }}: <?php echo $user['User']['username'] ?></h3>
            </div>
            <div class="modal-body">

            <form>

            <div class="form-group">
            <label class="control-label" translate>ENTER_PASSWORD</label>
            <input type="password" ng-model="Login.password" id="inputPassword" placeholder=" {{'ENTER_PASSWORD' | translate }}" class="form-control input-lg">
            </div>

            <input type="hidden" ng-model="Login.username" ng-init="Login.username='<?php echo $user['User']['username'] ?>'"  />
            </form>

            </div>
            <div class="modal-footer">
            <button class="btn btn-primary" ng-click="UserLogin($event)">{{'LOGIN_BTN' | translate }} </button>
            </div>
        </script>

    </div>

    <div class="animated" ng-if="answered"   ng-class="{'fadeInUp':answered, 'hide':!answered}" >
        <div class="alert alert-success" >
            <h3 class="m-t-none font-thin"><i class="fa fa-check-circle"></i>{{'ANSWER_SEND'| translate }}</h3>
        </div>
    </div>
</div>