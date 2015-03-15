<?php

class adminGamesModel extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new AdminGamesMock();
        parent::__construct();
    }

    public function getAllGameInformation() {
        return $this->query();
    }
}

class AdminGamesMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('adminGamesDB.txt');
    }

    public function gameId() { return $this->getData(0); }
    public function gameName() { return $this->getData(1); }
    public function maxParticipants() { return $this->getData(2); }
    public function firstName() { return $this->getData(3); }
    public function lastName() { return $this->getData(4); }
}
?>
