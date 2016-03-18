<?php

  /*
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */

  /**
   * CakePHP SiteComponent
   * @author ranostajj
   */
  class SiteComponent extends Component {

      public $components = array(
                'RequestHandler'
      );

      /**
       * Pase GET request valid fro SQL conditions
       *
       */
      public function parseRequestQuery($query = array())
      {

          $conditions = array();
          if ($query)
          {
              foreach ($query as $key => $val)
              {

                  if (preg_match('/:/', $val))
                  {
                      $field = str_replace("_", ".", $key);


                      if (json_decode($val))
                      {
                          $json_fields = (array) json_decode($val);
                          foreach ($json_fields as $f => $v)
                          {
                              if ($v != null)
                                  $conditions[$key . "." . $f] = $v;
                          }
                      } else
                      {
                          $conditions[$field] = $val;
                      }
                  }
                  else
                  {
                      $field = str_replace("_", ".", $key);
                      $conditions[$field] = $val;
                  }
              }
          }

          return $conditions;
      }

  }
