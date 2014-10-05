<?php
    
class SamuraiAuthService {
    
    private $_userRepo;
    private $_groupRepo;

    public function __construct($userRepo, $groupRepo) {
        $this -> _userRepo = $userRepo;
        $this -> _groupRepo = $groupRepo;
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

    public function GetGroups($user) {
     
        $groups = array();
        $forumGroups = array();

        //user may or may not have an alliance, so we 
        //need to make sure it is there before we try
        //to add it as a group.
        if(is_array($user['character']['alliance'])) {
            array_push($groups, $user['character']['alliance']['id']);
        }

        array_push($groups, $user['character']['corporation']['id']);

        $mapping = $this -> _groupRepo -> GetGroupMapping();

        foreach( $groups as $value ) {            
            if(array_key_exists($value, $mapping)) {
                array_push($forumGroups, $mapping[$value]);
            }
        }

        return $forumGroups;
        
    }

}

?>

