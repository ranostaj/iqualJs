<?php

  App::uses('AppController', 'Controller');

  class LoginController extends AppController {

      public $layout = 'ajax';
      public $uses = array(
                'User',
                'UserLogin'
      );

      public function beforeFilter()
      {
          parent::beforeFilter();
          $this->RequestHandler->respondAs('json');
          $this->Auth->allow();
      }

      /**
       * Login action
       */
      public function index()
      {

          $data = $this->request->data;

          try
          {

              $this->request->data['User'] = $this->request->data;

              if (!$this->request->data)
              {
                  throw new Exception(__("Zadajte meno a heslo"));
              }

              if (!$this->Auth->login())
              {
                  throw new Exception(__("Nesprávne meno alebo heslo"));
              }


              $token = $this->generateToken();

              // set headers token
              $this->response->header('Authorization', 'Bearer ' . $token);

              // Rewrite new Auth token info
              $this->Session->write('Auth.User.token', $token);

              $user = $this->Auth->user();

              $remember = @$this->request->data['remember'] ? 1 : 0;

              $data['token'] = $this->User->saveToken($token, $remember);
              $data['user'] = $user;
              $data['role'] = $user['Role']['name'];

              // Save user login info
              $LoginHistory['user_id'] = $user['id'];
              $LoginHistory['browser'] = $_SERVER['HTTP_USER_AGENT'];
              $LoginHistory['ip'] = $this->request->clientIp();
              $this->UserLogin->save($LoginHistory);
          } catch (Exception $e)
          {
              throw new Exception($e->getMessage(), 403);
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      private function generateToken()
      {
          return String::uuid();
      }

      /**
       * Forgot
       * @throws Exception
       */
      public function forgot()
      {
          $data = $this->request->data;

          try
          {

              if (!$user = $this->User->findByUsername($data['username']))
                  throw new Exception(__("Tento užívateľ nebol nájdený"));

              // gen password
              $password = $this->genPassword();

              $update = array(
                        'password' => Security::hash($password, null, true)
              );

              $this->User->id = $user['User']['id'];
              if (!$this->User->save($update))
              {
                  throw new Exception(__("Chyba pri zmene hesla"));
              }

              //  send Password
              $sendData = array(
                        'template' => 'forgot-password-' . $this->getLanguage(),
                        'email' => $data['username'],
                        'subject' => __('Zmena hesla - iQual'),
                        'data' => array(
                                  'password' => $password
                        )
              );

              $this->CustomEmail->send($sendData);

              $data['message'] = __("Nové heslo Vám bolo úspešne odoslané");
          } catch (Exception $e)
          {
              throw new Exception($e->getMessage(), 500);
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       *  Logout
       *
       */
      public function logout()
      {
          $this->User->removeToken();
          $this->Session->destroy();
          $this->Auth->logout();

          $data = array();
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Register user
       */
      public function register()
      {

          $data = array();
          try
          {
              $save_data = $this->request->data['data'];

              $save_data['password'] = Security::hash($save_data['password'], null, true);
              if (!$this->User->save($save_data))
              {
                  throw new Exception(__("Chyba, údaje neboli uložené!"), 500);
              }

              $data['data'] = $this->User->findById($this->User->getInsertID());
              $data['message'] = __("Vaše konto bolo úspešne vytvorené, môžete sa prihlásiť");
              $data['show_message'] = isset($save_data['show_message']) ? $save_data['show_message'] : true;
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Auth check for user data
       */
      public function auth()
      {
          $user = $this->Auth->user();

          if (!$user)
          {
              throw new Exception(__("Nepovolený vstup"), 403);
          }

          $data['token'] = $this->request->data['token'];
          $data['user'] = $user;
          $data['role'] = $user['Role']['name'];
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

  }
