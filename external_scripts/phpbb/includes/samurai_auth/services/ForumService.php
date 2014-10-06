<?php

class ForumService {

    private $db;

    public function __constructor($db) {
        $this -> db = $db;
    }
        
    public function SyncGroups($groups, $userId) {        
        $forumGroups = group_memberships(FALSE, $userId, FALSE);

        if(!group_memberships(2, $userId, TRUE)) {
            group_user_add(2, $userId);
        }

        //Add any missing groups
        foreach($groups as $group) {
            if(!group_memberships($group, $userId, TRUE)) {
                group_user_add($group, $userId);
            }
        }

        //Remove Groups they're no longer in
        foreach($forumGroups as $group)
        {
            if(!in_array($group['group_id'], $groups) && $group['group_id'] != 2)
            {
                group_user_del($group['group_id'], $userId);
            }
        }

    }

}

?>

