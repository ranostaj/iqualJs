<?php

  /**
   * CakePHP CustomEmail
   * @author ranostajj
   */
  App::uses('CakeEmail', 'Network/Email');

  class CustomEmailComponent extends Component {

      public $components = array();
      public $email;
      public $debug = true;

      /**
       * @todo Zrusit logovanie emailov
       * @param type $controller
       */
      public function initialize(Controller $controller)
      {
          $this->debug = Configure::read('debug') == 2 ? true : false;
          $this->email = new CakeEmail(array(
                    'log' => $this->debug ));
      }

      /**
       * Send email function
       * $data =  array(
       *          'template'=>
       *          'email'=>
       *          'subject'=>
       *          'data'=>array()
       *  )
       * @param <type> $data
       */
      public function send($data)
      {


          $template = @$data['template'] ? $data['template'] : 'default';

          $this->email->from('iqual@iqual.sk');
          $this->email->to($data['email']);

          if (isset($data['attachment']))
              $this->email->attachments($data['attachment']);

          $this->email->subject($data['subject']);
          $this->email->viewVars($data['data']);
          $this->email->template($template, 'default');
          $this->email->emailFormat('html');

          if ($this->debug)
          {
              $this->log("send mail " . $data['email'] . " s: " . $data['subject'] . " Data: " . print_r($data['data'], true), 'debug');
          }
          else
          {
              $response = $this->email->send();
          }
      }

  }
