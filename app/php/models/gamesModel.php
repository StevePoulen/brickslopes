<?php

class gamesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getGameInformation($data) {
        return $this->query($this->selectQuery($data));
    }

    public function addGameInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($data) {
        return "
            SELECT 
                g.gameId as gameId,
                g.eventId as eventId, 
                g.game as game,
                g.description as description,
                g.image as image,
                g.maxParticipants as maxParticipants,
                g.currentParticipants as currentParticipants,
                g.openRegistration as openRegistration,
                ga.gameAwardId as gameAwardId,
                ga.award as award,
                ga.place as place
            FROM
                games g,
                gameAwards ga
            WHERE
                g.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND g.gameId = ga.gameId
                ORDER by g.game, ga.place
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                games 
            (
                eventId, 
                game,
                description,
                image,
                maxParticipants,
                currentParticipants,
                openRegistration
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['game'])}',
                '{$this->escapeCharacters($data['description'])}',
                '{$this->escapeCharacters($data['image'])}',
                '{$this->escapeCharacters($data['maxParticipants'])}',
                '{$this->escapeCharacters($data['currentParticipants'])}',
                '{$this->escapeCharacters($data['openRegistration'])}'
          )
        ;
      ";
    }
}
?>
