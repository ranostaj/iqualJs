<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppModel', 'Model');

  /**
   * CakePHP ProjectModel
   * @author ranostajj
   */
  class Project extends AppModel {

      public $hasMany = array(
                "Theme" => array(
                          'dependent' => true ) );
      public $hasAndBelongsToMany = array(
                "User" );
      public $virtualFields = array(
                // Pocet respondentov v projekte
                'users' => "(SELECT count(*) FROM projects_users WHERE project_id=Project.id)",
                'themes' => "(SELECT count(*) FROM themes WHERE project_id=Project.id)"
      );

      public function beforeSave($options = array())
      {

      }

      /**
       * Project list
       * @param array $options
       * @return type
       */
      public function getAll($options = array())
      {

          //$this->bind(array( "Theme" ));



          if (isset($options['order']))
          {

              switch ($options['order'])
              {
                  default:
                  case 'newest':
                      $options['order'] = array(
                                "Project.id DESC" );
                      break;
                  case 'oldest':
                      $options['order'] = array(
                                "Project.id ASC" );
                      break;
              }
          }

          $new_options = $options;
          foreach ($options as $key => $opt)
          {
              if (!preg_match("/^_/", $key))
              {

                  if (!in_array($key, array(
                                    'order',
                                    'limit',
                                    'offset',
                                    'page',
                                    'fields' )))
                  {
                      $new_options['conditions'] = array(
                                $key => $opt );
                      unset($new_options[$key]);
                  }
              }
          }

          // dropdown
          if (isset($options['_dropdown']) && $options['_dropdown'] == true)
          {
              $this->recursive = -1;
          }

          // Recursive
          if (isset($options['_recursive']) && $options['_recursive'])
          {
              $this->recursive = $options['_recursive'];
          }

          // unset limit offset for count option
          $count_options = $new_options;

          foreach ($count_options as $key => $opt)
          {
              if (in_array($key, array(
                                'order',
                                'limit',
                                'offset',
                                'page',
                                'fields' )))
              {
                  unset($count_options[$key]);
              }
          }

          //pr($count_options);
          // pr($new_options);
          return array(
                    'rows' => $this->find('all', $new_options),
                    'total' => $this->find('count', $count_options),
                  //  'sgl' => $this->sqlLog()
          );
      }

      /**
       * Project list by user
       * @param int $user_id
       * @param $limit
       */
      public function getByUser($user_id, $limit = 1, $offset = 0)
      {
          $this->unbindModelAll();
          $options['conditions'] = array(
                    'Project.active' => 1 );

          $options['joins'] = array(
                    array(
                              'table' => 'projects_users',
                              'alias' => 'ProjectUser',
                              'type' => 'INNER',
                              'conditions' => array(
                                        'ProjectUser.project_id=Project.id and ProjectUser.user_id=' . $user_id )
                    ),
          );
          $options['limit'] = $limit;
          $options['offset'] = $offset;

          // $this->sqlLog();
          return $this->find($limit == 1 ? 'first' : 'all', $options);
      }

      /**
       * List table project by user
       * @param type $user_id
       * @param type $limit
       * @param type $offset
       * @return type
       */
      public function getListTableByUser($user_id, $limit = 1, $offset = 0)
      {
          $this->unbindModelAll();

          $options['joins'] = array(
                    array(
                              'table' => 'projects_users',
                              'alias' => 'ProjectUser',
                              'type' => 'INNER',
                              'conditions' => array(
                                        'ProjectUser.project_id=Project.id ' )
                    ),
                    array(
                              'table' => 'users',
                              'alias' => 'User',
                              'type' => 'INNER',
                              'conditions' => array(
                                        'ProjectUser.user_id=' . $user_id )
                    ),
          );
          $options['limit'] = $limit;
          $options['offset'] = $offset;
          $options['options'] = array(
                    'ProjectUser.user_id' => $user_id );
          $options['group'] = array(
                    "Project.id" );

          $count_options['joins'] = $options['joins'];
          $count_options['group'] = $options['group'];

          // $this->sqlLog();
          return array(
                    'rows' => $this->find('all', $options),
                    'total' => $this->find('count', $count_options),
                  //'sgl' => $this->sqlLog()
          );
      }

  }
