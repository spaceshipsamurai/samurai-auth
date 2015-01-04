<?php
    
class SamuraiAuthService {
    
    private $_userRepo;
    private $_groupRepo;
    private $_keyRepo;

    public function __construct($userRepo, $groupRepo, $keyRepo) {
        $this -> _userRepo = $userRepo;
        $this -> _groupRepo = $groupRepo;
        $this -> _keyRepo = $keyRepo;
    }

    public function Authenticate($username, $password) {
        
        $user = $this -> _userRepo -> getUser($username);

        if(!is_array($user)) {
            //no user found
            return FALSE;
        }

        $hashed_password = hash_hmac('sha256', $password,  $user['salt']);
    
        if(!($hashed_password === $user['password']))
        {
	        //invalid password
	        return FALSE;
        }

        return $user;

    }

    public function SyncUser($userId, $forumId){
        $this->_userRepo->updateForumUserId($userId, $forumId);
    }

    public function GetGroups($user) {
     
        $groups = array();
        $forumGroups = array();

        $character = $this->_keyRepo->getCharacter($user['_id'], $user['primary']);

        if(!$this->_keyRepo->hasValidKey($character)) {
            return $forumGroups;
        }

        //user may or may not have an alliance, so we 
        //need to make sure it is there before we try
        //to add it as a group.
        if(is_array($character['alliance'])) {
            array_push($groups, $character['alliance']['id']);
        }

        array_push($groups, $character['corporation']['id']);

        $mapping = $this -> _groupRepo -> GetGroupMapping();

        //for alliance/group mapping
        foreach( $groups as $value ) {            
            if(array_key_exists($value, $mapping)) {
                array_push($forumGroups, $mapping[$value]);
            }
        }

        $groups = $this->_groupRepo->getGroups($user['_id']);
        foreach( $groups as $group ) {
            if(array_key_exists('forumGroupId', $group))
            {
                array_push($forumGroups, $group['forumGroupId']);
            }
        }

        return $forumGroups;
        
    }

}

?>

