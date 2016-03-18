<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppModel', 'Model');

  /**
   * CakePHP Comment
   * @author ranostajj
   */
  class Comment extends AppModel {

      public $belongsTo = array(
                "User",
                "Theme" );
      public $hasMany = array(
                "Image" );
      public $actsAs = array(
                'Tree' );
      public $saved = null;

      public function beforeSave($options = array())
      {
          if (!isset($this->data['Comment']['id']))
          {
              $this->data['Comment']['hash'] = String::uuid();
          }
          return true;
      }

      public function afterSave($created, $options = array())
      {
          $this->saved = $this->data['Comment'];
          return true;
      }

      /**
       * Find all records
       * @param type $options
       * @param type $user_role
       * @param type $type
       * @return boolean
       */
      public function findAll($options = array(), $user_role, $type = 'threaded')
      {
          return $type == 'all' ? $this->find($type, $options) : $this->findTree(0, $user_role, $options);
      }


      /**
       * Fond comments tree
       * @param type int $parent
       * @param type string $user_role loged user role
       * @param type array $options
       * @return array
       *
       */
      private function findTree($parent = 0, $user_role, $options = array())
      {

          $cond = $options;
          $opt = isset($options['conditions']) ? $options['conditions'] : array();
          $out = array();

          $cond['conditions'] = array( 'parent_id' => $parent ) + $opt;

          $this->recursive = -1;
          $query = "SELECT *
                FROM comments AS Comment
                INNER JOIN users AS User ON User.id= Comment.user_id
                WHERE Comment.parent_id  = $parent
                ";

          if(isset($opt['theme_id'])) {
              $query .= " AND Comment.theme_id  = " . $opt['theme_id'];
          }

          if(isset($opt['Comment.private_id'])) {
              $query .= " AND Comment.private_id  IN (" . implode(",", $opt['Comment.private_id']) . ")";
          }

          if(isset($opt['Comment.user_id'])) {

              if(is_array( $opt['Comment.user_id'])) {
                  $query .= " AND Comment.user_id  IN (" . implode(",", $opt['Comment.user_id']) . ")";
              } else {
                  $query .= " AND Comment.user_id = ".$opt['Comment.user_id'];
              }
          }

          $query .= " ORDER by Comment.id DESC";

          if(isset($cond['limit']) && $parent == 0) {
              $offset = isset($cond['offset']) ? $cond['offset'] : 0;
              $query .= " LIMIT $offset," . $cond['limit'];
          }

          //echo $query;

          $rows = $this->query( $query);

          foreach ($rows as $key => $val)
          {
              $image = $this->query("SELECT Image.name AS image FROM images AS Image WHERE Image.comment_id=" . $val['Comment']['id']);
              if ($image)
              {
                  foreach ($image as $img)
                  {
                      $val['Image'][] = $img['Image'];
                  }
              }

              $out[$key] = $this->filterData($val, $user_role);
              $children = $this->findTree($val['Comment']['id'], $user_role, $cond);
              if ($children)
              {
                  foreach ($children as $k => $child)
                  {
                      $out[$key]['children'][$k] = $this->filterData($child, $user_role);
                  }
              }
          }


          return $out;
      }

      /**
       * filter user data
       * @param type $data
       * @param string $user_role User gropu
       * @return array
       */
      private function filterData($data = array(), $user_role = 'admin')
      {

          if ($user_role !== 'admin')
          {

              unset(
                      $data['User']['password'], $data['User']['username'], $data['User']['token']
              );

              $name = explode(" ", $data['User']['name']);
              $lastname = '';
              if (isset($name[1]))
              {
                  //  $lastname = strtoupper(mb_substr($name[1], 0, 1));
              }

              $data['User']['name'] = $name[0] . $lastname;
          }
          return $data;
      }

      /**
       * Fond comments tree
       * @param type int $parent
       * @param type string $user_role loged user role
       * @param type array $options
       * @return array
       *
       */
      public function findUserComments($user_id = null, $theme_id = null)
      {
          App::uses('User', 'Model');
          $user = new User();
          $users = $user->find('all', array(
                    'conditions' => array(
                              'role_id' => 1 ),
                    'recursive'  => -1 ));
          $ids = Hash::extract($users, '{n}.User.id');

          return $this->tree(0, array_merge(array(
                            $user_id ), $ids), $theme_id);
      }

      /**
       * Find tree user comments
       * @param type $parent
       * @param type $user
       * @param type $theme
       * @return type
       */
      private function tree($parent = 0, $user, $theme)
      {

          $this->recursive = -1;
          $query = "SELECT *
                FROM comments AS Comment
                INNER JOIN users AS User ON User.id= Comment.user_id
                WHERE
                ";

          if ($parent)
          {
              $query .= " Comment.parent_id  = $parent AND";
          }

          $query .= "
                Comment.theme_id  =  $theme
                AND Comment.user_id  IN (" . implode(",", $user) . ")
                ORDER by Comment.id DESC";

          $rows = $this->query($query);


          $out = array();




          foreach ($rows as $key => $val)
          {

              $comment = $val['Comment'];
              $comment['user_role'] = $val['User']['role_id'];


              $children = $this->tree($comment['id'], $user, $theme);
              $out[$key] = $comment;

              if ($children)
              {
                  foreach ($children as $k => $child)
                  {
                      $out[$key]['children'][$k] = $child;

                      foreach ($out as $k_item => $item)
                      {

                          if ($child['id'] === $item ['id'])
                          {
                              unset($out[$k_item]);
                          }
                      }
                  }
              }
          }


          return $out;
      }

      /**
       * Find user reactions
       * @param int $user user id
       * @param string $user_role admin|user
       * @param $options
       *
       */
      public function findAllReactions($user, $user_role, $options = array())
      {
          $conditions = $results = array();
          if ($options)
          {
              foreach ($options as $k => $opt)
              {
                  $conditions[] = $k . ' = ' . $opt;
              }
          }

          $cond = $conditions ? " AND " . implode(" AND ", $conditions) : null;

          $rows = $this->query("SELECT Comment. *, Theme.*, User.*
                FROM comments AS a
                INNER JOIN comments AS Comment ON Comment.parent_id = a.id
                INNER JOIN themes AS Theme ON Theme.id = Comment.theme_id
                INNER JOIN users AS User ON User.id = Comment.user_id
                WHERE a.user_id   = $user
                AND   Theme.active = 1
                AND   Comment.user_id  != $user
                AND   Comment.reaction=0 " . $cond . "
                ORDER by Comment.id DESC");

          if ($rows)
          {
              foreach ($rows as $r)
              {
                  $results[] = $this->filterData($r, 'user');
              }
          }

          return $results;
      }


      /**
       * Count user comments
       * @param null $user_id
       * @return int
       */
      public function countUserComments($user_id = null)
      {
          $options = array(
              'recursive'=>-1,
              'conditions'=>array('user_id'=>$user_id)
          );
          return $this->find('count', $options);
      }



      public function afterFind($results,  $primary = false) {
          foreach ($results as $key => $val) {
              if (isset($val['Comment']['created'])) {
                  $results[$key]['Comment']['created'] = strtotime($val['Comment']['created']);
              }
          }
          return $results;
      }


  }
