<?php

class gameUserModel extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new GameUserMock();
        parent::__construct();
    }

    public function getGameUserInformation($data) {
        return $this->query();
    }

    public function addGameUserInformation($data) {
        return $this->query();
    }

    public function deleteGameUserInformation($data) {
        if(!ISSET($GLOBALS['deleteGameUserInformation'])) {
            $GLOBALS['deleteGameUserInformation'] = array();
        }
        try {
            array_push(
                $GLOBALS['deleteGameUserInformation'],
                array (
                    'gameId' => $data['gameId'],
                    'userId' => $data['userId'],
                    'eventId' => $data['eventId']
                )
            );
        } catch (exception $err) {}
        return $this->query();
    }
}

class GameUserMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('gameUserDB.txt');
    }

    public function gameId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function userId() { return $this->getData(2); }
    public function gameTeamId() { return $this->getData(3); }
    public function type() { return $this->getData(4); }
    public function gameTitle() { return $this->getData(5); }
}
?>
