<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP User
 * @author ranostajj
 */
class User extends AppModel {

    public $inserted = array();
    public $project = array();
    public $component = null;
    public $belongsTo = array(
        "Role",
    );
    public $hasAndBelongsToMany = array(
        "Theme" => array(
            'unique' => false),
        "Project");
    public $validate = array(
        'username' => array(
            'rule1' => array(
                'required'   => true,
                'rule'       => array(
                    'minLength',
                    2),
                'message'    => 'Vypltne prihlasovacie meno',
                'allowEmpty' => false,
                'on'         => 'create'
            ),
            'rule2' => array(
                'rule'    => 'validatecheckmail',
                'message' => "Užívateľ s týmto e-mailom už existuje, zvoľte iný",
                'on'      => 'update'
            ),
        ),
    );
    public $virtualFields = array(
      'comments' => "(SELECT COUNT(*) FROM comments WHERE user_id=User.id)",
    );
    public $expire_token = null;

    public function __construct()
    {
        $login_conf = Configure::read('login');
        $this->expire_token = date("Y-m-d H:i:s", time() + $login_conf['expire_token']);
        parent::__construct();
    }

    public function beforeSave($options = array())
    {


        // ak user je imported reove id
        if (isset($this->data['User']['imported']))
        {
            if ($this->data['User']['status'] === 'error')
            {
                return false;
            }
            unset($this->data['User']['id']);
        }


        if (isset($this->data['User']['notify']) && $this->data['User']['notify'] == true)
        {
            $lang = Configure::read('Config.language');
            $password = $this->radnomString();
            $this->data['User']['password'] = Security::hash($password, null, true);
            $this->data['User']['pass'] = $password;

            $sendMail = array(
                'template' => $this->data['User']['role_id'] == 2 ? 'new-user-' . $lang : 'new-client-' . $lang,
                'email'    => $this->data['User']['username'],
                'subject'  => __("Nove konto"),
                'data'     => array(
                    'user'    => $this->data['User'],
                    'project' => $this->project
                )
            );
            $this->sendEmail($sendMail);
        }

        return true;
    }

    /**
     * Send user mail
     * @param type $data
     */
    public function sendEmail($data = array())
    {

        $this->component->send($data);
    }

    public function afterFind($results, $primary = false)
    {

        foreach ($results as $key => $res)
        {
            //  unset($results[$key]['User']['password']);
        }

        return $results;
    }

    /**
     * Save new token
     * @param string $token
     * @param int $remember
     * @return string
     */
    public function saveToken($token, $remember)
    {


        $data = array(
            'token'        => $token,
            'expire_token' => $remember ? null : $this->expire_token,
            'remember'     => $remember,
            'id'           => $this->getUser()
        );

        return $this->save($data) ? $token : false;
    }

    /**
     * Remove Token
     * @return string
     */
    public function removeToken()
    {
        $data = array(
            'token'        => null,
            'id'           => $this->getUser(),
            'expire_token' => null
        );

        return $this->save($data);
    }

    /**
     * Refresh user token
     * @param string token
     */
    public function refreshToken($token)
    {
        if (!$user = $this->findUserByToken($token))
            return false;

        if (!$user['User']['remember'])
        {
            // check for expiration
            if (strtotime($user['User']['expire_token']) < time())
            {
                return false;
            }

            $data = array(
                'expire_token' => $this->expire_token,
                'id'           => $this->getUser()
            );

            $this->save($data);
        }

        return true;
    }

    /**
     * Find user byt token id
     * @param type $token
     * @return type
     */
    public function findUserByToken($token)
    {
        $user = $this->findByToken($token);
        return $user;
    }

    /**
     * User query
     * @param array $conditions
     * @param array $fields
     * @return array
     */
    public function userQuery($conditions = array(), $fields = array(
        "*"), $options = array())
    {

        if (isset($conditions['User_name']))
        {
            $conditions['User.name LIKE'] = '%' . $conditions['User_name'] . '%';
            unset($conditions['User_name']);
        }

        if (isset($conditions['username']))
        {
            $conditions['username LIKE'] = '%' . $conditions['username'] . '%';
            unset($conditions['username']);
        }

        $options['fields'] = $fields;
        $options['joins'] = array(
            array(
                'table'      => 'themes_users',
                'alias'      => 'ThemeUser',
                'type'       => 'LEFT',
                'conditions' => array(
                    'ThemeUser.user_id=User.id')
            ),
            array(
                'table'      => 'projects_users',
                'alias'      => 'ProjectUser',
                'type'       => 'LEFT',
                'conditions' => array(
                    'ProjectUser.user_id=User.id')
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

        //pr($options);

        $count_options = $options;
        foreach ($count_options as $key => $opt)
        {
            if (in_array($key, array(
                        'order',
                        'limit',
                        'offset',
                        'page',
                        'fields')))
            {
                unset($count_options[$key]);
            }
        }


        return array(
            'rows'  => $this->find('all', $options),
            'total' => $this->find('count', $count_options)
        );
    }

    /**
     * Validate username
     * @param email $string
     * @return boolean
     */
    function validateCheckMail($string)
    {
        $user_id = isset($this->data['User']['id']) ? $this->data['User']['id'] : null;
        $username = @$string['username'] ? $string['username'] : @$string['email'];
        $data = $this->find('first', array(
            'conditions' => array(
                'User.username' => $username,
                'User.id !='    => $user_id)));
        return $data ? FALSE : TRUE;
    }

    /**
     * Gt admin IDS
     */
    public function getAdminIds()
    {
        $this->bind(array(
            'Role'));
        $out = array();
        $options = array(
            'fields'     => array(
                'User.id'),
            'conditions' => array(
                'Role.name' => 'admin'
            )
        );
        $res = $this->find('all', $options);
        foreach ($res as $key => $val)
        {
            $out[] = $val['User']['id'];
        }

        return $out;
    }

    /**
     * Get User data
     * @param type $user_id
     * @return type object
     */
    public function getUserData($user_id)
    {

        $this->unbindModelAll();
        $data = $this->findById($user_id);

        return (object) $data['User'];
    }

    function afterSave($created, $options = array())
    {



        if ($this->project)
        {
            $this->data['User']['notify'] = false;
            $this->inserted[] = $this->data['User'];
        }
        return true;
    }

    /**
     * Save user data
     * @param type $user
     * @param type $project
     * @return type
     */
    public function saveAllData($user, $project)
    {
        $this->project = $project;
        return $this->saveAll($user);
    }


    public function getExcludedInTheme($theme_id, $project_id)
    {

        $db = $this->getDataSource();
        $conditions = array(
            $db->expression(' User.id NOT IN (SELECT user_id FROM themes_users WHERE theme_id='.$theme_id.')'),
            "ProjectUser.project_id" => $project_id
        );

        $options = array(
            'conditions'=>$conditions,
            'recursive'=>-1,
            'group'=>array("User.id"),
            'joins'=> array(
                array(
                    'table'      => 'themes_users',
                    'alias'      => 'ThemeUser',
                    'type'       => 'LEFT',
                    'conditions' => array(
                        'ThemeUser.user_id=User.id')
                ),
                array(
                    'table'      => 'projects_users',
                    'alias'      => 'ProjectUser',
                    'type'       => 'LEFT',
                    'conditions' => array(
                        'ProjectUser.user_id=User.id')
                ),
            )

        );
        return $this->find('all', $options);
    }

    /**
     * Nastavi virtual fields
     * @param array $array
     */
    public function setVirtualFields($fields = array()) {
       $this->virtualFields = Hash::merge( $this->virtualFields,$fields);
        return this;
    }

}
