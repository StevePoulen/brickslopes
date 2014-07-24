<?php

class gamesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getGameInformation($data) {
        return $this->query($this->selectQuery($data));
    }

    public function getGameUserInformation($data) {
        return $this->query($this->selectGameUserQuery($data));
    }

    public function addGameInformation($data) {
        $gameId = $this->query($this->insertQuery($data));
        if ($gameId > 0) {
            $this->query($this->insertGameEventQuery($data['eventId'], $gameId));
        }

        return $gameId;
    }

    public function addGameUserInformation($data) {
        return $this->query($this->insertGameUserQuery($data));
    }

    private function selectGameUserQuery($data) {
        return "
            SELECT 
                guc.gameId as gameId,
                guc.userId as userId,
                guc.eventId as eventId,
                guc.gameTeamId as gameTeamId,
                guc.type as type
            FROM
                gamesUsersConnector guc
            WHERE
                guc.gameId = '{$this->escapeCharacters($data['gameId'])}'
                AND guc.userId = '{$this->escapeCharacters($data['userId'])}'
                AND guc.eventId = '{$this->escapeCharacters($data['eventId'])}'
        ;
      ";
    }

    private function selectQuery($data) {
        return "
            SELECT 
                g.gameId as gameId,
                gec.eventId as eventId, 
                gec.display as display,
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

    private function insertGameUserQuery($data) {
        $gameTeamId = (ISSET($data['gameTeamId']) ? $this->escapeCharacters($data['gameTeamId']) : 'NULL');
        return "
            INSERT INTO
                gamesEventsConnector
            (
                gameId,
                userId, 
                eventId, 
                gameTeamId, 
                type 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['gameId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['eventId'])}',
                '{$gameTeam}',
                '{$this->escapeCharacters($data['type'])}'
          )
        ;
      ";
    }

    private function insertGameEventQuery($eventId, $gameId) {
        return "
            INSERT INTO
                gamesEventsConnector
            (
                eventId, 
                gameId
            )
        VALUES
          (
                '{$this->escapeCharacters($eventId)}',
                '{$this->escapeCharacters($gameId)}'
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
                maxParticipants,
                currentParticipants,
                openRegistration
            )
        VALUES
          (
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
