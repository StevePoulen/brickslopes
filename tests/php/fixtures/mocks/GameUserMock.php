<?php

class GameUserMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/gameUserDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->gameId = $this->gameId();
        $this->eventId = $this->eventId();
        $this->userId = $this->userId();
        $this->gameTeamId = $this->gameTeamId();
        $this->type = $this->type();
        $this->gameTitle = $this->gameTitle();
    }

    public function gameId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function userId() { return $this->getData(2); }
    public function gameTeamId() { return $this->getData(3); }
    public function type() { return $this->getData(4); }
    public function gameTitle() { return $this->getData(5); }
}
?>
