<?php

  /**
   * Application model for CakePHP.
   *
   * This file is application-wide model file. You can put all
   * application-wide model-related methods here.
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
   * @package       app.Model
   * @since         CakePHP(tm) v 0.2.9
   * @license       http://www.opensource.org/licenses/mit-license.php MIT License
   */
  App::uses('Model', 'Model');

  /**
   * Application model for Cake.
   *
   * Add your application-wide methods in the class below, your models
   * will inherit them.
   *
   * @package       app.Model
   */
  class AppModel extends Model {

      public $useDbConfig = DATASOURCE;

      /**
       * Set Model komponent
       * @param object $component
       */
      public function setComponent($component)
      {
          $this->component = $component;
      }

      /**
       * Radnom string
       * @param type $len
       * @return type
       */
      public function radnomString($len = 6)
      {
          return substr(str_shuffle("abcdefghijkmnpqrstuvwxABCDEFGHJKLMNPQRSTUVWX"), 0, $len);
      }

      /**
       * Vrati data o prihlasenom uzivatelovi
       * @param type $name
       * @return type
       *
       */
      public function getUser($name = 'id')
      {
          return AuthComponent::user($name);
      }

      /**
       * Bind models
       *
       * @param array $bindModels
       * @param int $recursive
       *
       */
      function bind($bindModels = array(), $recursive = 2)
      {
          $bind = array();
          foreach ($bindModels as $key => $model)
          {
              $model_name = is_array($model) ? $key : $model;


              if (in_array($model_name, array_keys($this->hasMany)))
                  $bind['hasMany'][$key] = $model;

              if (in_array($model_name, array_keys($this->hasOne)))
                  $bind['hasOne'][$key] = $model;


              if (in_array($model_name, array_keys($this->belongsTo)))
                  $bind['belongsTo'][$key] = $model;

              if (in_array($model_name, array_keys($this->hasAndBelongsToMany)))
                  $bind['hasAndBelongsToMany'][$key] = $model;
          }

          if ($bind)
          {
              $this->unbindModelAll();
              $this->bindModel($bind);
              $this->recursive = $recursive;
          }
      }

      /**
       * Unbind all models
       */
      function unbindModelAll()
      {
          foreach (array(
            'hasOne' => array_keys($this->hasOne),
            'hasMany' => array_keys($this->hasMany),
            'belongsTo' => array_keys($this->belongsTo),
            'hasAndBelongsToMany' => array_keys($this->hasAndBelongsToMany)
          ) as $relation => $model)
          {
              $this->unbindModel(array(
                        $relation => $model ));
          }
      }

      public function saveAssociated($data = null, $options = array())
      {
          foreach ($data as $alias => $modelData)
          {
              if (!empty($this->hasAndBelongsToMany[$alias]))
              {
                  $habtm = array();
                  $Model = ClassRegistry::init($this->hasAndBelongsToMany[$alias]['className']);
                  foreach ($modelData as $modelDatum)
                  {
                      if (empty($modelDatum['id']))
                      {
                          $Model->create();
                      }
                      $Model->save($modelDatum);
                      $habtm[] = empty($modelDatum['id']) ? $Model->getInsertID() : $modelDatum['id'];
                  }
                  $data[$alias] = array(
                            $alias => $habtm );
              }
          }
          return parent::saveAssociated($data, $options);
      }

      /**
       * log
       *
       */
      public function sqlLog()
      {
          $log = $this->getDataSource()->getLog(false, false);
          pr($log);
      }

      /**
       * Filter through query conditions
       *
       */
      public function filterConditions($conditions)
      {
          $filter_fileds = array(
                    'order',
                    'limit',
                    'offset',
                    'page',
          );

          if ($conditions)
          {
              foreach ($conditions as $key => $val)
              {
                  if (preg_match("/^_/", $key))
                  {
                      unset($conditions[$key]);
                  }

                  if (in_array($key, $filter_fileds))
                  {
                      unset($conditions[$key]);
                  }
              }
          }

          return $conditions;
      }

  }
