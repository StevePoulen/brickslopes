<?php

class gameAwards extends db {
    function __construct() {
        parent::__construct();
    }

    public function addGameAwardInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                gameAwards 
            (
                gameId, 
                eventId, 
                award,
                place
            )
        VALUES
          (
                '{$this->escapeCharacters($data['gameId'])}',
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['award'])}',
                '{$this->escapeCharacters($data['place'])}'
          )
        ;
      ";
    }
}
?>
