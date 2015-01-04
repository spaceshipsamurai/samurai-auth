<?php

require 'MongoRepo.php';

class UserRepo extends MongoRepo {
    
    private $users;

    public function __construct($connectionString) {
        parent::__construct($connectionString);

        $this->users = $this->Connect('SamuraiAuth', 'users');
    }

    public function getUser($username) {
        
        $authUser = $this->users->findOne(array('email' => strtolower($username)));

        return $authUser;
    }

    public function updateForumUserId($userId, $forumId) {
        
        $user = $this->users->findOne(array('_id' => new MongoID($userId)));

        if(!is_null($user))
        {
            $user['services']['forum']['forumId'] = $forumId;
            $this->users->save($user);
        }
        
    }

}

?>