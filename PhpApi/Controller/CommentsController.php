<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  App::uses('AppController', 'Controller');

  /**
   * CakePHP CommentsController
   * @author ranostajj
   */
  class CommentsController extends AppController {

      public $layout = 'ajax';
      public $uses = array(
                'User',
                'Theme',
                'Comment',
                "Image"
      );

      public function beforeFilter()
      {
          $this->RequestHandler->respondAs('json');
          $this->response->disableCache();
          $this->Auth->allow(array(
                    'view' ));
          parent::beforeFilter();
      }

      /**
       * List of comments
       * Just a basic list with threaded and all options
       */
      public function index()
      {

          $options = $this->request->query;
          $user_id = $this->getUserId();
          $data = array();
          $type = isset($this->request->query['type']) ? $this->request->query['type'] : 'all';
          $options['order'] = array('Comment.id DESC');
          // If is user role
          if($this->isUser())
          {
              $options['conditions'] = array(
                        'Comment.user_id'=>$user_id
                    );
          }

          $data['rows'] = $this->Comment->findAll($options, $this->user_role, $type);
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Save comment data
       * @todo Dorobit ulozenie mena a emailu respondenta do text fields okrem user_id
       */
      public function save()
      {



          $data = array();
          try
          {
              $new_comment_data = isset($this->request->data['data']['Comment']['id']) ? array() : array(
                        'user_id'  => $this->getUserId(),
                        'username' => $this->user_username,
                        'name'     => $this->user_name,
              );

              $saveData = array_merge($this->request->data['data']['Comment'], $new_comment_data);

              if (!empty($saveData['youtube']))
              {
                  preg_match_all("/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&\"\'>]+)/", $saveData['youtube'], $matches);

                  if (!isset($matches[5]) && empty($matches[5][0]))
                  {
                      throw new Exception(__("Neplatný kód youtube videa!"), 500);
                  }

                  $saveData['youtube'] = $matches[5][0];
              }



              // Disable save private message for user
              if ($this->user_role == 'user' && isset($saveData['private_id']))
              {
                  $saveData['private_id'] = 0;
              }


              // if private_id get user name
              if (isset($saveData['private_id']) && $saveData['private_id'] != 0)
              {
                  $user = $this->User->getUserData($saveData['private_id']);
                  $saveData['private_name'] = $user->name;
              }


              // Save DATA
              if (!$this->Comment->save($saveData))
              {
                  throw new Exception(__("Chyba, Odpoveď nebola uložená!"), 500);
              }

              $response_messages['saved_message'] = __("Vaša odpoveď bola odoslaná");


              // Notification email
              if (isset($this->request->data['data']['notify']) && $this->request->data['data']['notify'] == TRUE)
              {
                  if (isset($this->request->data['data']['User']['username']))
                  {
                      $email = $this->request->data['data']['User']['username'];
                  }
                  else
                  {

                      $user_to_reply = $this->Comment->findById($saveData['parent_id']);
                      $email = $user_to_reply['User']['username'];
                  }

                  // Theme Data
                  $this->Theme->bind(array(
                            'Project' ), 0);
                  $theme = $this->Theme->findById($saveData['theme_id']);


                  $parent = $this->Comment->find('first', array('recursive'=>1, 'conditions'=>array(
                      'Comment.id'=>$this->Comment->saved['parent_id']
                  )));


                  $comment = array(
                      'comment'=>$this->Comment->saved,
                      'parent'=>$parent ? $parent['Comment'] : false,
                      'parent_user'=>$parent ? $parent['User'] : false

                  );

                  $comment_data = Hash::merge($comment,  $theme ,array('user_role' => $this->user_role));

                  $mail_data = array(
                            'template' => 'comment-notify-' . $this->getLanguage(),
                            'data'     =>  $comment_data,
                            'email'    => $email,
                            'subject'  => __("Notifikacia z iQual.sk")
                  );

                  $this->CustomEmail->send($mail_data);
                  $response_messages['email'] = __("Notifikácia bola úspešne odoslaná");
              }




              $data['data'] = $this->Comment->findById($this->Comment->getInsertID() ? $this->Comment->getInsertID() : $this->request->data['data']['Comment']['id'] );
              $data['message'] = $response_messages;
              $data['show_message'] = isset($this->request->data['data']['show_message']) ? $this->request->data['data']['show_message'] : true;
          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }



      /**
       * Save comment data
       * @route /comments/diary/save
       * @params = post data [day_id,diary_user_id]
       */
      public function diarySave()
      {

          $data = array();
          try
          {
              $default_data =   array(
                  'user_id'  => $this->getUserId(),
                  'username' => $this->user_username,
                  'name'     => $this->user_name
              );

              $saveData = array_merge($this->request->data['data'], $default_data);

              // Save DATA
              if (!$this->Comment->save($saveData))
              {
                  throw new Exception(__("Chyba, Odpoveď nebola uložená!"), 500);
              }

              $data['data'] = $this->Comment->findById($this->Comment->getInsertID() ? $this->Comment->getInsertID() : $this->request->data['data']['id'] );

          } catch (Exception $exc)
          {
              throw new Exception($exc->getMessage(), $exc->getCode());
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));

      }

      /**
       * upload comment data
       */
      public function upload()
      {


          $data = (array) json_decode($this->request->data);


          try
          {

              if (!isset($_FILES['uploadFile']))
              {
                  throw new Exception(__("Chyba neexistujúci súbor"), 500);
              }

              // filename and path
              $filename = Security::hash($_FILES['uploadFile']['name']);
              $extenstion = strtolower(pathinfo($_FILES['uploadFile']['name'], PATHINFO_EXTENSION));
              $full_image_name = $filename . "." . $extenstion;
              $upload_paths = Configure::read('upload_paths');
              $file_path = $upload_paths['comments'] . '/' . $full_image_name;


              // UPLOAD FILE
              if (!move_uploaded_file($_FILES['uploadFile']['tmp_name'], $file_path))
              {
                  throw new Exception(__("Chyba súbor nebol nahraty"), 500);
              }

              // image resize

              $thumb = new Imagick($file_path);
              $imageprops = $thumb->getImageGeometry();

              if ($imageprops['width'] >= 400)
              {
                  $thumb->resizeImage(500, 400, Imagick::FILTER_LANCZOS, 1, true);
                  $thumb->writeImage($file_path);
              }

              // Save image into DB
              $save_data = array(
                        'comment_id' => $data['data']->Comment->id,
                        'name'       => $full_image_name
              );

              $this->Image->save($save_data);


              $data['files'] = $_FILES;
          } catch (Exception $ex)
          {
              throw new Exception($ex->getMessage(), $ex->getCode());
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * Find all reactions on user comments
       *
       */
      public function getAllReactions()
      {
          $options = $this->Site->parseRequestQuery($this->request->query);
          $data['rows'] = $this->Comment->findAllReactions($this->user_id, $this->user_role, $options);

          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

      /**
       * List of comments by theme and user
       * @param type $user_id
       * @param type $theme_id
       */
      public function user($user_id = null, $theme_id = null)
      {
          $data = array();
          $data['rows'] = $this->Comment->findUserComments($user_id, $theme_id);
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }


      /**
       * List of comments by day and user
       * @param type $diary_user_id
       * @param type $day_id
       */
      public function day($day_id = null,$diary_user_id = null)
      {

          $data = array();
          $conditions = array(
            'recursive'=>1,
            'conditions'=>array(
                'Comment.day_id'=>$day_id,
                'Comment.diary_user_id'=>$diary_user_id
            ),
             'order'=>'Comment.id ASC'
          );
          $data['rows'] = $this->Comment->find('all',$conditions);
          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }


      /**
       * List Comments for theme
       * @param null $theme_id
       * @param int $page
       * @throw error
       */
      public function theme($theme_id = null, $page = 0)
      {
          $data = array();
          $limit = 5;
          $options = $conditions = array();
          $show_comments = true;

          // logged user ID
          $user_id = $this->getUserId();

          try {
                $this->Theme->recursive = -1;
                $theme = $this->Theme->findById($theme_id);

                // Get the theme data
                if(!$theme) {
                    throw new Exception(__("Táto téma neexistuje!"), 500);
                }


              // If is user role
              if($this->isUser())
              {
                  // check if user has entered any comments yet
                  $show_comments = $this->Comment->countUserComments($user_id) ? true : false;
                  $conditions['Comment.private_id'] = array(0,$user_id);
              }


              // One to One conditions
              if($this->isUser() && $theme['Theme']['type'] == 1 )
              {
                  $conditions['Comment.user_id'] = array_merge($this->User->getAdminIds(),array( $user_id ));
              }

              // Display comments
              if($show_comments)
              {
                  $options['limit'] =  isset($this->request->query['limit']) ? $this->request->query['limit'] : $limit;
                  $options['offset'] = isset($this->request->query['limit']) ? $this->request->query['limit']*$page : $limit*$page;

                  $conditions['theme_id'] = $theme_id;

                  $options['conditions'] = $conditions;

                  $data['rows'] = $this->Comment->findAll($options, $this->user_role);
              }

          } catch(Exception $e) {
              throw new Exception($e->getMessage(), $e->getCode());
          }


          $this->set($data);
          $this->set('_serialize', array_keys($data));
      }

  }
