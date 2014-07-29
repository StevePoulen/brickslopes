<?php

class gamesModel extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new GamesMock();
        parent::__construct();
    }

    public function getGameInformation($data) {
        return $this->query();
    }
}

class GamesMock extends modelObjects {
    public function __construct() {
        parent::__construct('gamesDB.txt');
    }

    public function gameId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function game() { return $this->getData(2); }
    public function description() { return $this->getData(3); }
    public function image() { return $this->getData(4); }
    public function maxParticipants() { return $this->getData(5); }
    public function currentParticipants() { return $this->getData(6); }
    public function openRegistration() { return $this->getData(7); }
    public function display() { return $this->getData(8); }
    public function gameAwardId() { return $this->getData(9); }
    public function award() { return $this->getData(10); }
    public function place() { return $this->getData(11); }
}
?>
