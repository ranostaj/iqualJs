<?php

App::uses('AppModel', 'Model');

/**
 * CakePHP Day
 * @author ranostajj
 */
class Day extends AppModel {

    public $belongsTo = array(
        "Theme" );
    public $hasMany = array(
        "Comment" );

}
