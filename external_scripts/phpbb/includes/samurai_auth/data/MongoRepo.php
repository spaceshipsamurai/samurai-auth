<?php

class MongoRepo {
    
    private $connectionString;

    public function __construct($connection) {        
        $this->connectionString = $connection;
    }

    protected function Connect($dbName, $collectionName) {
        $m = new MongoClient($this -> connectionString);
        $collection = $m->selectCollection($dbName, $collectionName);
        return $collection;
    }

}

?>