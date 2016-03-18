<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppController', 'Controller');

  /**
   * CakePHP TemplatesController
   * @author ranostajj
   */
  class TemplatesController extends AppController {

      public $layout = 'ajax';

      public function beforeFilter()
      {
          $this->RequestHandler->respondAs('json');
          parent::beforeFilter();
      }

      /**
       * LEFT NAVIGATION template
       *
       */
      public function navigation()
      {
          $this->response->disableCache();
      }

  }
