<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppModel', 'Model');

  /**
   * CakePHP ThemeImage
   * @author ranostajj
   */
  class ThemeImage extends AppModel {

      public $belongsTo = array(
                "Theme" );

  }
