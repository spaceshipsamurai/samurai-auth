<?php

class GroupRepo extends MongoRepo {
    
    public function __construct($connectionString) {
        parent::__construct($connectionString);
    }

    public function GetGroupMapping() {
        
        //Auth Group : Forum Group
        return array(
            99001904 => 8 // Spaceship Samurai : Spaceship Samurai
        );
    }

}

?>