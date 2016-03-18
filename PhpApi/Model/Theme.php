<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppModel', 'Model');


  /**
   * CakePHP Theme
   * @author ranostajj
   */
  class Theme extends AppModel {

      public $hasAndBelongsToMany = array(
                "User"=>array(
                    'fields'=>array("*", "(SELECT COUNT(*) FROM comments WHERE user_id=User.id and theme_id=ThemesUser.theme_id) AS comments")
                ) );
      public $belongsTo = array(
                'Project' );
      public $hasMany = array(
                "Days",
                "ThemeImage" => array(
                          'dependent' => true
                )
      );
      public $virtualFields = array(
                'created_format' => "DATE_FORMAT(Theme.created, '%d.%m.%y - %H:%i')",
                'respondents'    => '(SELECT count(*) FROM themes_users WHERE theme_id=Theme.id)',
                'comments'       => '(SELECT count(*) FROM comments WHERE  theme_id=Theme.id)'
      );

      public $actsAs = array('Containable');

      /**
       * Theme query
       * @param array $conditions
       * @param array $fields
       * @return array
       */
      public function themeQuery($conditions = array(), $fields = array(
                "*" ), $type = 'all', $recursive = 3)
      {



          $this->recursive = $recursive;

          $options['fields'] = $fields;
          $options['joins'] = array(
                    array(

                              'table'      => 'themes_users',
                              'alias'      => 'ThemeUser',
                              'type'       => 'LEFT',
                              'conditions' => array(
                                        'ThemeUser.theme_id=Theme.id' )
                    ),
          );


          $options['conditions'] = $this->filterConditions($conditions);
          if (isset($conditions['limit']))
          {
              $options['limit'] = $conditions['limit'];
          }
          if (isset($conditions['offset']))
          {
              $options['offset'] = $conditions['offset'];
          }
          $options['group'] = array(
                    "Theme.id" );

          $count_options = $options;
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


          return array(
                    'rows'  => $this->find($type, $options),
                    'total' => $this->find('count', $count_options)
          );
      }


      /**Get Users by theme Id
       * @param null $theme_id
       * @param array $conditions
       */
      public function getUsersByThemeId($theme_id = null, $conditions = array())
      {
          $options = [
              'recursive'=>1,
              'conditions'=>Hash::merge(['Theme.id'=>$theme_id],[]),
              'contain'=>array("User"=>array(
                   "conditions"=>array("User.role_id"=>2),

              ))
          ];
          $array =  Hash::extract($this->find('all', $options), '{n}.User');
          return $array[0];
      }
  }
