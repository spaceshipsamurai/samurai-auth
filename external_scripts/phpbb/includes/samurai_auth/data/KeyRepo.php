<?php

class KeyRepo extends MongoRepo {
    
    private $characters;
    private $keys;

    public function __construct($connectionString) {
        parent::__construct($connectionString);

        $this->characters = $this->Connect('SamuraiAuth', 'characters');
        $this->keys = $this->Connect('SamuraiAuth', 'keys');
    }

    public function getCharacter($userId, $characterId) {        
        $character = $this->characters->findOne(array('user' => new MongoID($userId), '_id' => new MongoID($characterId)));
        return $character;
    }

    public function hasValidKey($character)
    {
        $key = $this->keys->findOne(array('_id' => new MongoID($character['key'])));

        if(!is_null($key)) {
            return $key['status'] == 'Valid';
        }

        return FALSE;

    }

}

?>