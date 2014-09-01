<?php

class gamesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getGameInformation($data) {
        return $this->query($this->selectQuery($data));
    }

    public function addGameInformation($data) {
        $gameId = $this->query($this->insertQuery($data));
        if ($gameId > 0) {
            $this->query($this->insertGameEventQuery($data, $gameId));
        }

        return $gameId;
    }

    private function selectQuery($data) {
        return "
            SELECT 
                g.gameId as gameId,
                gec.eventId as eventId, 
                gec.display as display,
                g.game as game,
                g.fee as fee,
                g.description as description,
                g.image as image,
                g.maxParticipants as maxParticipants,
                g.currentParticipants as currentParticipants,
                g.openRegistration as openRegistration,
                ga.gameAwardId as gameAwardId,
                ga.award as award,
                ga.place as place
            FROM
                gamesEventsConnector gec,
                games g LEFT JOIN 
                    gameAwards ga on
                        g.gameId = ga.gameId
                        
            WHERE
                gec.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND gec.gameId = g.gameId
                AND gec.display = 'YES'
                ORDER by g.game, ga.place
        ;
      ";
    }

    private function insertGameEventQuery($data, $gameId) {
        $display = (ISSET($data['display']) ? $data['display'] : 'YES');
        
        return "
            INSERT INTO
                gamesEventsConnector
            (
                eventId, 
                gameId,
                display
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($gameId)}',
                '{$this->escapeCharacters($display)}'
          )
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                games 
            (
                game,
                description,
                image,
                fee,
                maxParticipants,
                currentParticipants,
                openRegistration
            )
        VALUES
          (
                '{$this->escapeCharacters($data['game'])}',
                '{$this->escapeCharacters($data['description'])}',
                '{$this->escapeCharacters($data['image'])}',
                '{$this->escapeCharacters($data['fee'])}',
                '{$this->escapeCharacters($data['maxParticipants'])}',
                '{$this->escapeCharacters($data['currentParticipants'])}',
                '{$this->escapeCharacters($data['openRegistration'])}'
          )
        ;
      ";
    }
}
?>
