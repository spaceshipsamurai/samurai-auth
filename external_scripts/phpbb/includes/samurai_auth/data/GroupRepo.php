<?php

class GroupRepo extends MongoRepo {
    
    private $groupCollection;
    private $memberCollection;

    public function __construct($connectionString) {
        parent::__construct($connectionString);

        $this->groupCollection = $this->Connect('SamuraiAuth', 'groups');
        $this->memberCollection = $this->Connect('SamuraiAuth', 'members');
    }

    public function GetGroupMapping() {
        
        //Auth Group : Forum Group
        return array(
            99001904 => 8 // Spaceship Samurai : Spaceship Samurai
        );
    }

    public function GetGroups($userId) {        
        
        $cursor = $this->memberCollection->find(array('user' => new MongoID($userId), 'status' => 'Active'));
        $gids = array();

        foreach($cursor as $membership) {
            array_push($gids, new MongoID($membership['group']));
        }

        $groups = $this->groupCollection->find(array('_id' => array( '$in' => $gids)));

        return iterator_to_array($groups);
    }

}

?>