<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppController', 'Controller');

  /**
   * CakePHP ProjectsController
   * @author ranostajj
   */
  class ProjectsController extends AppController {

      public $layout = 'ajax';
      public $uses = array(
                "Project",
                "Theme",
                "ThemesUser",
                "User" );

      public function beforeFilter()
      {
          $this->RequestHandler->respondAs('json');
          parent::beforeFilter();
      }

      /**
       * List of projects
       */
      public function index()
      {

          $options = $this->request->query;
          $data = array();

          if ($this->isAdmin())
          {
              if (isset($options['user_id']))
              {
                  $rows = $this->Project->getListTableByUser($options['user_id'], $this->request->query['limit'], $this->request->query['offset']);
              }
              else
              {

                  $rows = $this->Project->getAll($options);
              }

              foreach ($rows['rows'] as $row)
              {
                  $data['rows'][] = $row;
              }
              $data['total'] = $rows['total'];
          }
          else
          {
              $data['rows'] = $this->Project->getByUser($this->user_id);
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Remove project
       * @todo povolit zmazanie projektu
       */
      public function delete()
      {
          $data = array();
          if ($this->request->is('delete'))
          {
              $data['id'] = $this->request->query['id'];
              $this->Project->delete($this->request->query['id']);
          }
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Save project data
       */
      public function save()
      {


          $data = array();
          try
          {

              if (!$this->request->data['data'])
              {
                  throw new Exception("Empty post data!", 500);
              }

              $post_data = $this->request->data['data'];

              // User data
              if (isset($post_data['User']) && count($post_data['User']))
              {
                  $user_post_data = $post_data['User'];

                  // Set Email component for User model
                  $this->User->setComponent($this->CustomEmail);

                  $save_user_data = array();
                  $project_id = $post_data['Project']['id'];




                  foreach ($user_post_data as $k => $user_data)
                  {

                      if (isset($user_data['Theme']) && count($user_data['Theme']))
                      {
                          $tmp_theme = array();

                          $this->ThemesUser->query("DELETE FROM themes_users "
                                  . " WHERE theme_id IN (SELECT id FROM themes WHERE project_id=$project_id)"
                                  . " AND user_id = $user_data[id] ");

                          foreach ($user_data['Theme'] as $theme)
                          {
                              $tmp_theme[] = $theme['id'];
                          }


                          $save_user_data[$k]['Theme'] = array(
                                    'Theme' => $tmp_theme );


                          unset($save_user_data[$k]['User']['Theme'], $user_post_data[$k], $post_data['User'][$k]);
                      }

                      $save_user_data[$k]['User'] = $user_data;
                  }


                  if ($save_user_data)
                  {

                      if (!$this->User->saveAllData($save_user_data, $post_data['Project']))
                      {
                          $errors = $this->User->validationErrors;
                          $err = array();

                          if ($errors)
                          {
                              foreach ($errors as $k => $error)
                              {

                                  if (is_array($error))
                                  {

                                      foreach ($error as $k2 => $e)
                                      {
                                          $err[] = $e[0] . " - " . $user_post_data[$k][$k2];
                                      }
                                  }
                              }
                          }

                          throw new Exception(__("Chyba, User nebol uložený!") . implode(",", $err), 500);
                      }
                  }

                  // vyhodime uzivatelov co boli importovani kdedze budu vrateni z  $this->User->inserted
                  foreach ($user_post_data as $k => $user_data)
                  {
                      if (isset($user_data['imported']))
                      {
                          unset($user_post_data[$k]);
                      }
                  }

                  // merge new inserted users
                  $post_data['User'] = array_merge($this->User->inserted, $user_post_data);

                  foreach ($post_data['User'] as $k => $usr)
                  {
                      $usr['notify'] = false;
                      $post_data['User'][$k] = $usr;
                  }
              }



              if (!$this->Project->saveAll($post_data))
              {
                  throw new Exception(__("Chyba, Projekt nebol uložený!"), 500);
              }

              $project_id = $this->Project->getInsertID() ? $this->Project->getInsertID() : $post_data['Project']['id'];
              $project_data = $this->Project->findById($project_id);

              $data['show_message'] = isset($post_data['show_message']) ? $post_data['show_message'] : true;
              $data['post_data'] = $this->request->data['data'];
              $data['project'] = $project_data;
              $data['message'] = __("Projekt bol úspešne uložený");
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }



          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * View single project
       */
      public function view()
      {
          $data = array();

          $conditions = $this->postConditions(array(
                    'Project' => $this->request->query ));

          if ($conditions)
              $data = $this->Project->find('first', array(
                        'conditions' => $conditions ));

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * List of users into project
       * @param type $project_id
       */
      public function users($project_id = null)
      {
          $data = array();

          $data = $this->User->Project->find('first', array(
                    'conditions' => array(
                              'Project.id' => $project_id
                    ) ));
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }



      /**
       * List of themes in project
       * @param type $project_id
       */
      public function getThemes($project_id = null)
      {
          $data = array();
          $model_array = array();
          $conditions = [ 'Theme.project_id' => $project_id];


          if(isset($this->request->query['models'])) {
             $model_array = explode(",",$this->request->query['models']);
             array_walk($model_array, function(&$item, $key) {
                     $item =  ucwords($item);
              });
          }


         if(!$this->isAdmin()) {
            $conditions = Hash::merge($conditions,['user_id'=>$this->getUserId()]);
         }

          if(isset($this->request->query['active'])) {
              $conditions = Hash::merge($conditions,['Theme.active'=>$this->request->query['active']]);
          }

          $joins =  [
              array(
                  'table'      => 'themes_users',
                  'alias'      => 'ThemeUser',
                  'type'       => 'LEFT',
                  'conditions' => array('ThemeUser.theme_id=Theme.id' )
              )
          ];

          $data['rows'] = $this->Theme->find('all', array(
              'recursive'=>-1,
              'conditions' =>$conditions,
              'contain'=>$model_array,
              'joins'=> $joins,
              'group'=>['Theme.id']
          ));

          $data['total'] = $this->Theme->find('count',['conditions'=>$conditions, 'joins'=> $joins,'group'=>['Theme.id']]);
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }



      /**
       * Send users massmail from project
       * @params int $project_id
       * @url  /projects/mail/:id  [POST]
       */

      public function mail($project_id = null)
      {
          $data = $this->request->data;

          if (!isset($data['users']))
          {
              throw new Exception(__("Chyba zoznam uívateľov"), 500);
          }

          if (empty($data['message']))
          {
              throw new Exception(__("Chyba správa"), 500);
          }

          if (empty($data['subject']))
          {
              throw new Exception(__("Chyba predmet správy"), 500);
          }

          if (empty($project_id))
          {
              throw new Exception(__("Chyba projekt"), 500);
          }

          $project = $this->Project->findById($project_id);

          foreach ($data['users'] as $user)
          {
              $mail_data = array(
                  'template' => 'massmail-' . $this->getLanguage(),
                  'data'    => array(
                      'content' => $data['message'],
                      'project'=>$project['Project']
                  ),
                  'email'   => $user['username'],
                  'subject' => $data['subject'] . " - iQual"
              );

              $this->CustomEmail->send($mail_data);
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

  }
