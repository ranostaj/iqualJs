<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppModel', 'Model');

  /**
   * CakePHP Image
   * @author ranostajj
   */
  class Image extends AppModel {

      public $belongsTo = array(
                "Comment" );
      public $virtualFields = array(
                "image" => "name"
      );

  }
