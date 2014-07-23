<?php

class GamesMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/gamesDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->gameId = $this->gameId();
        $this->eventId = $this->eventId();
        $this->game = $this->game();
        $this->description = $this->description();
        $this->image = $this->image();
        $this->maxParticipants = $this->maxParticipants();
        $this->currentParticipants = $this->currentParticipants();
        $this->openRegistration = $this->openRegistration();
        $this->award = $this->award();
        $this->place = $this->place();
        $this->gameAwardId = $this->gameAwardId();
    }

    public function gameId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function game() { return $this->getData(2); }
    public function description() { return $this->getData(3); }
    public function image() { return $this->getData(4); }
    public function maxParticipants() { return $this->getData(5); }
    public function currentParticipants() { return $this->getData(6); }
    public function openRegistration() { return $this->getData(7); }
    public function gameAwardId() { return $this->getData(8); }
    public function award() { return $this->getData(9); }
    public function place() { return $this->getData(10); }
}
?>
