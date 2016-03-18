<?php

App::uses('AppController', 'Controller');

class DaysController extends AppController {

    public $layout = 'ajax';
    public $uses = array(
        'Theme',
        'Day'
    );

    public function beforeFilter()
    {
        parent::beforeFilter();
        $this->RequestHandler->respondAs('json');
    }


    /**
     * View action
     */
    public function view($id = null)
    {
        $this->Day->recursive = -1;
        $row = $this->Day->findById($id);
        $this->set($row['Day']);
        $this->set('_serialize', array_keys($row['Day']));
    }


    /**
     * Save action
     */
    public function save()
    {

        $row = $this->Day->save($this->request->data['data']);
        $this->set($row['Day']);
        $this->set('_serialize', array_keys($row['Day']));
    }

        /**
         * Delete action
         */
     public function delete($id = null)
     {
            if(!$id) return ;

          $row['data'] =  $this->Day->delete($id);

          $this->set( $row  );
          $this->set('_serialize', array('data'));
     }

}
