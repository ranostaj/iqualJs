<?php

  /**
   * Application level Controller
   *
   */
  App::uses('Controller', 'Controller');

  class AppController extends Controller {

      var $components = array(
                'Auth',
                'Session',
                'Cookie',
                'CustomEmail',
                'Site',
                'RequestHandler' );
      var $helpers = array(
                "Time",
                "Html",
                "Form" );

      public function beforeFilter()
      {

          header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
          header('Pragma: no-cache'); // HTTP 1.0.
          header('Expires: 0'); // Proxies.

          $this->Auth->loginAction = array(
                    'plugin' => null,
                    'controller' => 'login',
                    'action' => 'index' );

          $this->Auth->authorize = array(
                    'Controller' );
          $this->Auth->authError = __("Pred vstupom do tejto sekcie sa musíte prihlásiť");
          $this->Auth->authenticate = array(
                    AuthComponent::ALL => array(
                              'userModel' => 'User',
                              'fields' => array(
                                        'username' => 'username',
                                        'password' => 'password' ),
                    ),
                    'Form'
          );



          // Logged user
          if ($this->Auth->user('id'))
          {

              $this->setUserData($this->Auth->user());

              if (!in_array($this->name, array(
                                'Login' )))
              {
                  // check User token
                  $this->checkUserToken();
              }
          }
          else
          {
              $token = $this->getUserToken();

              if ($token)
              {

                  $this->loadModel('User');
                  $user = $this->User->findUserByToken($token);
                  if ($user)
                  {
                      //  $login_data =  $user['User']+array('Role' => $user['Role']);
                      //  $this->Auth->login($login_data);
                  }
              }
          }

          // Language
          $headers = $this->getHeaders();
          if (isset($headers['lang']))
          {
              $this->setLanguage($headers['lang']);
          }
      }

      public function setUserData($data)
      {

          foreach ($data as $key => $val)
          {
              $this->{'user_' . strtolower($key)} = $val;
          }

          if (isset($data['Role']))
          {
              $this->user_role = $data['Role']['name'];
          }
      }

      /**
       * Check user Token
       */
      public function checkUserToken()
      {




          $data = array();
          try
          {
              $token = $this->getUserToken();

              if (!$this->refreshToken())
                  throw new Exception(__("Platnosť prihlásenia vypršala"), 403);

              if (!$token)
              {
                  throw new Exception(__("Nepovolený vstup"), 403);
              }

              if ($token != $this->user_token)
              {
                  $this->Auth->logout();
                  throw new Exception(__("Nepovolený vstup"), 403);
              }
          } catch (Exception $ex)
          {
              throw new Exception($ex->getMessage(), $ex->getCode());
          }
      }

      /**
       * Get user token
       */
      public function getUserToken()
      {


          $headers = $this->getHeaders();
          if (!isset($headers['Authorization']))
              return false;
          $token = explode(" ", $headers['Authorization']);
          return $token[1];
      }

      /**
       * Get request headers
       */
      private function getHeaders()
      {
          $headers = getallheaders();

          return $headers;
      }

      /**
       * Refresh user token
       * @return type boolean
       */
      private function refreshToken()
      {
          $this->loadModel('User');
          return $this->User->refreshToken($this->getUserToken());
      }

      /**
       * Set default language
       * @param type $lang
       */
      private function setLanguage($lang)
      {
          $this->Session->write('Config.language', $lang);
          Configure::write('Config.language', $lang);
      }

      public function beforeRender()
      {

          if ($this->Auth->user())
          {
              $this->setUserData($this->Auth->user());
              $this->set('auth', $this->Auth->user());
              $this->set('user_id', $this->user_id);
              $this->set('username', $this->Auth->user('username'));
              $this->set('user_name', $this->Auth->user('name'));
              $this->set('user_role', $this->user_role);
          }
      }

      public function isAuthorized($user)
      {


          if ($this->user_role !== 'admin')
          {
              $user_actions = Configure::read('allowed_user_actions');
              try
              {
                  if (!isset($user_actions[$this->name]))
                  {
                      throw new Exception(__("Nepovolený vstup"));
                  }

                  if (!preg_match($user_actions[$this->name], $this->action))
                  {
                      throw new Exception(__("Nepovolený vstup"));
                  }
              } catch (Exception $exc)
              {
                  throw new Exception($exc->getMessage(), 401);
              }
          }

          return true;
      }

      public function getUserId()
      {
          return $this->user_id;
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

      /**
       * Is admin
       * @return type
       */
      public function isAdmin()
      {
          return $this->user_role == 'admin';
      }

      /**
       * Is user
       * @return type
       */
      public function isUser()
      {
          return $this->user_role == 'user';
      }


      /**
       * Is clent
       * @return type
       */
      public function isClient()
      {
          return $this->user_role == 'client';
      }

      /**
       * Get Language
       * @return type
       */
      public function getLanguage()
      {
          return Configure::read('Config.language');
      }

  }
