<?php

  /**
   * Static content controller.
   *
   * This file will render views from views/pages/
   *
   * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
   * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
   *
   * Licensed under The MIT License
   * For full copyright and license information, please see the LICENSE.txt
   * Redistributions of files must retain the above copyright notice.
   *
   * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
   * @link          http://cakephp.org CakePHP(tm) Project
   * @package       app.Controller
   * @since         CakePHP(tm) v 0.2.9
   * @license       http://www.opensource.org/licenses/mit-license.php MIT License
   */
  App::uses('AppController', 'Controller');

  /**
   * Static content controller
   *
   * Override this controller by placing a copy in controllers directory of an application
   *
   * @package       app.Controller
   * @link http://book.cakephp.org/2.0/en/controllers/pages-controller.html
   */
  class PagesController extends Controller {

      public $layout = 'ajax';
      public $uses = array(
                "Comment",
                "User",
                "Theme" );
      var $helpers = array(
                "Time",
                "Html",
                "Form" );
      var $components = array(
                'Auth',
                'Session',
                'Cookie',
                'CustomEmail',
                'Site',
                'RequestHandler' );

      public function beforeFilter()
      {

          parent::beforeFilter();

          if (isset($this->params['lang']))
          {
              $this->Session->write('Config.language', $this->params['lang']);
              Configure::write('Config.language', $this->params['lang']);
          }


          $this->Auth->allow();
      }

      public function beforeRender()
      {


          if ($this->Auth->user())
          {
              $this->set('auth', $this->Auth->user());
              $this->set('user_id', $this->user_id);
              $this->set('username', $this->Auth->user('username'));
              $this->set('user_role', $this->user_role);
          }
      }

      public function index()
      {


          $data['language'] = Configure::read('Config.language');
          $data['text'] = __('Reakcia na otázku');
          $data['path'] = $_SERVER;
          $data['pass'] = $this->genPassword();
          $data['password'] = Security::hash($data['pass'], null, true);
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * View comment
       * @param type $comment_id
       * @param type $hash
       */
      public function comment($comment_id, $hash)
      {



          $this->layout = 'default';



          $comment = $this->Comment->find('first', array(
                    'conditions' => array(
                              'Comment.id' => $comment_id,
                              'Comment.hash' => $hash,
                              'Comment.reaction' => 0
                    )
          ));


          if (!$comment)
          {
              throw new NotFoundException(__("Požadovaná stránka nebola nájdená"), 404);
          }

          $parent = $this->Comment->find('first', array(
                    'conditions' => array(
                              'Comment.id' => $comment['Comment']['parent_id']
                    )
          ));

          if (!$parent)
          {

              $user_id = $comment['Comment']['private_id'];
          }
          else
          {
              $user_id = $parent['Comment']['user_id'];
          }

          $user = $this->User->findById($user_id);
          if ($this->Auth->user() && $user['User']['id'] != $this->Auth->user('id'))
          {
              $this->Auth->logout();
          }

          $data['comment'] = $comment;
          $data['user'] = $user;
          $this->set($data);
      }

      /**
       * Generovanie hesla
       * @param  integer $len [description]
       * @return [type]       [description]
       */
      public function genPassword($len = 6)
      {

          $alphabet = "abcdefghijklmnopqrstuwxyABCDEFGHIJKLMNPQRSTUWXY123456789";
          $pass = array(); //remember to declare $pass as an array
          $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
          for ($i = 0; $i <= $len; $i++)
          {
              $n = rand(0, $alphaLength);
              $pass[] = $alphabet[$n];
          }
          return implode($pass); //turn the array into a string
      }

  }
