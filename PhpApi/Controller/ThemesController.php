<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

App::uses('AppController', 'Controller');
App::uses('CakeTime', 'Utility');

  /**
   * CakePHP ThemesController
   * @author ranostajj
   */
  class ThemesController extends AppController {

      public $layout = 'ajax';
      public $uses = array(
                "Project",
                "Theme",
                "User",
                "Day",
                "Comment",
                "ThemeImage" );

      public function beforeFilter()
      {
          parent::beforeFilter();
          $this->RequestHandler->respondAs('json');
          $this->response->disableCache();
      }

      /**
       * List of themes
       */
      public function index()
      {

          $fields = array( "*" );

          $data = $conditions =  [];
          $get_query = $this->request->query;

          if($intersect = array_intersect_key($get_query,['limit', 'offset']))
          {
              $conditions = $intersect;
          }

          if(isset($get_query['active']))
          {
              $conditions['Theme.active'] =  $conditions['Project.active'] = $get_query['active'];
          }

          if(isset($get_query['name']))
          {
              $conditions['Theme.name'] =   $get_query['name'];
          }

          if(isset($get_query['project_id']))
          {
              $conditions['Theme.project_id'] =   $get_query['project_id'];
          }


          if ($this->isAdmin())
          {
              $result = $this->Theme->themeQuery($conditions, $fields, 'all', -2);
          }
          else
          {
              $conditions['user_id'] = $this->user_id;
              $conditions['Project.active'] = 1;
              $result = $this->Theme->themeQuery($conditions, $fields, 'all', -3);
          }



          foreach ($result['rows'] as $row)
          {
              $data['rows'][] = $row;
          }

          $data['total'] = $result['total'];
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Save theme data
       */
      public function save()
      {


          $data = array();

          try
          {
              if (!$this->User->Theme->saveAll($this->request->data['data']))
              {
                  throw new Exception(__("Chyba, Téma nebola uložená!"), 500);
              }


              $data['data'] = $this->Theme->findById($this->Theme->getInsertID() ? $this->Theme->getInsertID() : $this->request->data['data']['Theme']['id']);
              $data['message'] = isset($this->request->data['data']['message']) ? $this->request->data['data']['message'] : __("Téma bola úspešne uložená");
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }


          $data['show_message'] = isset($this->request->data['data']['show_message']) ? $this->request->data['data']['show_message'] : true;
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * View single theme
       * @route api/themes/view?id=:id
       */
      public function view()
      {
          $data = array();

          $conditions = $this->postConditions(array(
                    'Theme' => $this->request->query ));

          if ($this->isUser())
          {
              $conditions['ThemeUser.user_id'] = $this->user_id;
          }


          if ($conditions)
          {

              $results = $this->Theme->themeQuery($conditions, array(
                        "*" ), 'first', 1);
          }


          if (!count($results['rows']))
          {
              throw new Exception(__("Táto téma neexistuje"), 500);
          }

          $data = $results['rows'];
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Upload Images
       */
      public function upload()
      {

          $this->disableCache();
          $upload_path = Configure::read('upload_paths');
          $data = array();

          $image = new Imagick();
          $allowed = '/jpg|png/';

          try
          {
              $file = $_FILES['file0'];
              $data = (array) json_decode((string) $this->request->data);


              // if file
              if (!$file)
              {
                  throw new Exception(__("Vložte fotografiu"));
              }

              $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

              // extension
              if (!preg_match($allowed, $extension))
              {
                  throw new Exception(__("Nesprávny formát fotografie vložte: ") . $allowed);
              }

              //size
              if ($file['size'] > 10485760)
              {
                  throw new Exception(__("Veľkost suboru je viac ako") . "10MB");
              }

              $hash = String::uuid();
              $foto_name = $hash . '.' . $extension;

              $foto_large_path = $upload_path['themes'] . DS . $foto_name;
              $foto_small_path = $upload_path['themes'] . DS . 's' . DS . $foto_name;

              // upload
              if (!move_uploaded_file($file['tmp_name'], $foto_large_path))
              {
                  throw new Exception(__("Chyba fotografia nebola uložená!"));
              }


              // resizing
              $image->readImage($foto_large_path);

              $image->resizeImage(800, 0, imagick:: FILTER_LANCZOS, 1, false);
              //$image->cropThumbnailImage(200, 200);
              $image->setImageFormat('jpg');
              $image->writeImage($foto_large_path);

              // small
              $image->cropThumbnailImage(150, 150);
              $image->setImageFormat('jpg');
              $image->writeImage($foto_small_path);

              // posleme ako vysledok
              $data['foto'] = $foto_name;
          } catch (Exception $e)
          {
              throw new Exception($e->getMessage(), 500);
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Remove Theme
       */
      public function delete()
      {
          $data = array();
          if ($this->request->is('delete'))
          {
              $data['id'] = $this->request->query['id'];
              $this->Theme->delete($this->request->query['id']);
          }
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * theme image
       */
      public function image()
      {
          $data = array();
          $upload_path = Configure::read('upload_paths');

          if ($this->request->is('delete'))
          {
              $data['id'] = $this->request->query['id'];
              $img = $this->ThemeImage->findById($data['id']);
              if ($img)
              {
                  if ($this->ThemeImage->delete($data['id']))
                  {
                      unlink($upload_path['themes'] . DS . 's' . DS . $img['ThemeImage']['image']);
                      unlink($upload_path['themes'] . DS . $img['ThemeImage']['image']);
                      $data['message'] = __("Obrázok bol vymazaný");
                  }
              }
          }
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }


      /**
       * Excluded users
       * @param $theme_id
       */
      public function exUsers($theme_id = 11)
      {
          $data = array();

          $theme = $this->Theme->find('first', array(
             'recursive'=>-1,
              'conditions'=>array('id'=>$theme_id)
          ));

          $data['rows'] =  $this->User->getExcludedInTheme($theme_id, $theme['Theme']['project_id']);
          $this->set($data);
          $this->set('_serialize', array_keys($data));

      }


      /**
       *    Users in theme
       *    @param int $theme_id
       */
      public function users($theme_id = null)
      {
          $data  =  $this->Theme->getUsersByThemeId($theme_id, array('User.role_id'=>2));
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       *    Days in theme
       *    @param int $theme_id
       */
      public function days($theme_id = null, $user_id = null)
      {

          if(!$theme_id) return;

          $options = array(
                'recursive'=>-1,
                'conditions'=>array(
                    'Day.theme_id'=>$theme_id
                ),
                'order'=>array('data ASC')
            );



          $rows  =  $this->Day->find('all', $options);

          foreach($rows as $key=>$row) {

              $row['Day']['isFuture'] =   false;
              $row['Day']['isPast'] = false;
              $row['Day']['isToday'] = false;



              $row['Day']['comments'] =  $this->Comment->find('count',array(
                    'conditions'=>array(
                            'Comment.user_id'=>!$this->isUser() ? $user_id : $this->getUserId(),
                            'Comment.day_id'=>$row['Day']['id']
                    )
                ));


              if(CakeTime::isFuture($row['Day']['data'])) {
                  $row['Day']['isFuture'] = true;
              }
              if(CakeTime::isPast($row['Day']['data'])) {
                  $row['Day']['isPast'] = true;
              }
              if(CakeTime::isToday($row['Day']['data'])) {
                  $row['Day']['isToday'] = true;
              }

             $data[] = $row['Day'];
          }

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }
  }
