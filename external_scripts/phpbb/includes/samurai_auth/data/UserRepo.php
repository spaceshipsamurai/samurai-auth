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

}

?>