<?php

  App::uses('AppController', 'Controller');

  class UsersController extends AppController {

      public $layout = 'ajax';
      public $uses = array(
                'User',
                'Theme',
                'Role',
                'Autologin',
                'ProjectsUser',
                'ThemesUser',
                'LogUser' );

      public function beforeFilter()
      {
          $this->RequestHandler->respondAs('json');
          parent::beforeFilter();
          $this->Auth->allow(array(
                    "valid",
          ));
      }

      /**
       * List of users
       */
      public function index()
      {

          $fields = array(
                    "*" );
          $conditions = $data = array();
          $options['group'] = array(
                    "User.id" );


          $conditions = $this->Site->parseRequestQuery($this->request->query);
          $data['rows'] = array();

          // NOT in theme users list conditions
          if (isset($this->request->query['_not_in_theme']) && isset($this->request->query['theme_id']))
          {
              $theme_id = $this->request->query['theme_id'];
              $project_id = $this->request->query['project_id'];
              $this->Theme->recursive = 0;
              $theme = $this->Theme->findById($theme_id);

              if ($theme['Theme']['project_id'] == $project_id)
              {
                 $users_id = $this->InThemeUsers($theme_id);
                  if (!empty($users_id))
                  {
                      $conditions['NOT'] = array(
                                "User.id" => $users_id );
                  }
                  // $conditions['theme_id !='] =  $conditions['theme_id'];
              }

              unset($conditions['theme_id']);
          }



          // Count Comments in theme ID for each user
          if (isset($this->request->query['_count_comments']) && isset($this->request->query['theme_id']))
          {
              $theme_id = $this->request->query['theme_id'];
              $this->User->virtualFields = array(
                        'comments' => "(SELECT COUNT(*) FROM comments WHERE user_id=User.id AND theme_id= $theme_id)"
              );
          }


          if (isset($this->request->query['_recursive']))
          {
              $this->User->recursive = $this->request->query['_recursive'];
          }

          unset($conditions['.not.in.theme']);
          $result = $this->User->userQuery($conditions, $fields, $options);



          foreach ($result['rows'] as $row)
          {
              $data['rows'][] = $row;
          }

          $data['total'] = $result['total'];

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Theme Users
       * @param type $theme_id
       * @return type
       */
      private function InThemeUsers($theme_id)
      {
          $users_id = array();
          $notin_theme_cond = array(
                    "ThemeUser.theme_id" => $theme_id );
          $this->User->recursive = 0;
          $users = $this->User->userQuery($notin_theme_cond);


          foreach ($users['rows'] as $key => $val)
          {
              $users_id[$key] = $val['User']['id'];
          }

          return $users_id;
      }

      /**
       * List of User themes
       * @param type $user_id
       * @return type
       */
      public function themes($user_id = null)
      {
          $data = array();
          $conditions = array_merge($this->Site->parseRequestQuery($this->request->query), array(
                    "ThemeUser.user_id" => $user_id ));
          if ($this->isAdmin())
          {
              $data = $this->Theme->themeQuery($conditions, array(
                        "*" ), 'all', -2);
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       *
       * @throws Exception
       */
      public function valid()
      {
          $data = array();


          if (!$this->request->query)
          {
              throw new Exception(__("Error data!"), 501);
          }

          $conditions = $this->postConditions(array(
                    'User' => $this->request->query ));

          $data = $this->User->find('first', array(
                    'conditions' => $conditions ));


          if (!$data)
          {
              throw new Exception(__("Tento užívateľ nebol nájdený!"), 501);
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * View single user
       * @throws Exception
       */
      public function view()
      {
          $data = array();


          if (!$this->request->query)
          {
              $conditions = array(
                        "User.id" => $this->user_id );
          }
          else
          {
              $conditions = $this->user_role != 'user' ? $this->postConditions(array(
                                'User' => $this->request->query )) : array(
                        "User.id" => $this->user_id );
          }



          if ($conditions)
              $data = $this->User->find('first', array(
                        'conditions' => $conditions ));

          if (!$data)
          {
              throw new Exception(__("Tento užívateľ nebol nájdený!"), 501);
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Remove user
       * @todo Vymazat aj vsetky priradene temy k userovi a projektu
       */
      public function delete()
      {
          $data = array();
          if ($this->request->is('delete'))
          {
              $data['id'] = $this->request->query['id'];
              $this->User->delete($this->request->query['id']);
          }
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Save User data
       */
      public function save()
      {



          $data = array();
          try
          {



              $save_data = $this->request->data['data'];


              // Ak je prihlaseny user tak prepiseme user ID
              if ($this->user_role == 'user' OR $this->user_role == 'client')
              {
                  $save_data['User']['id'] = $this->user_id;
              }

              // ak je user admin
              if ($this->user_role == 'admin' && !isset($save_data['User']['id']))
              {
                  $save_data['User']['id'] = $this->user_id;
              }

              if (!$this->User->save($save_data))
              {
                  foreach ($this->User->validationErrors as $error)
                  {
                      $errors[] = implode("\n", $error);
                  }
                  throw new Exception(__("Chyba, údaje neboli uložené! " . "\n\n" . implode("\n", $error)), 500);
              }


              $data['data'] = $this->User->findById($this->User->getInsertID() ? $this->User->getInsertID() : $save_data['User']['id'] );
              $data['message'] = __("Užívateľ bol úspešne uložený");
              $data['show_message'] = isset($save_data['show_message']) ? $save_data['show_message'] : true;
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }



          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Save User password
       */
      public function password()
      {


          $data = array();
          try
          {
              $user_id = isset($this->request->data['data']['id']) ? $this->request->data['data']['id'] : $this->user_id;

              $save_data = array(
                        'password' => Security::hash($this->request->data['data']['password'], null, true),
                        'id'       => $this->user_id
              );
              if (!$this->User->save($save_data))
              {
                  throw new Exception(__("Chyba, údaje neboli uložené!"), 500);
              }


              $data['data'] = $this->User->findById($user_id);
              $data['message_modal'] = __("Heslo bolo úspešne zmenené");
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * List users roles
       */
      public function roles()
      {
          $this->Role->recursive = 0;
          $data['rows'] = $this->Role->find('all');
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Delete User from Project
       */
      public function deleteproject()
      {
          $data = array();

          if ($this->request->is('post'))
          {

              $data = $this->request->data;
              $user_id = $data['user'];
              $project_id = $data['project'];


              try
              {

                  $this->ProjectsUser->query("DELETE FROM projects_users "
                          . "WHERE user_id=$user_id "
                          . "AND project_id=$project_id");


                  $this->ThemesUser->query("DELETE FROM themes_users "
                          . " WHERE theme_id IN (SELECT id FROM themes WHERE project_id=$project_id )"
                          . " AND user_id = $user_id ");
              } catch (Exception $ex)
              {
                  throw new Exception($ex->getMessage(), 500);
              }



              $data['message'] = __("Užívateľ bol úspešne odstránený z projektu");
              $data['show_message'] = isset($data['show_message']) ? $data['show_message'] : true;
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Delete User from Theme
       */
      public function deleteFromTheme()
      {
          $data = array();

          if ($this->request->is('post'))
          {

              $data = $this->request->data;
              $user_id = $data['user'];
              $theme_id = $data['theme'];


              try
              {

                  $this->ThemesUser->query("DELETE FROM themes_users "
                          . " WHERE theme_id=" . $theme_id
                          . " AND user_id = $user_id ");
              } catch (Exception $ex)
              {
                  throw new Exception($ex->getMessage(), 500);
              }



              $data['message'] = __("Užívateľ bol úspešne odstránený z témy");
              $data['show_message'] = isset($data['show_message']) ? $data['show_message'] : true;
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

  }
