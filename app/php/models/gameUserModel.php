<?php

class gameUserModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getGameUserInformation($data) {
        return $this->query($this->selectGameUserQuery($data));
    }

    public function addGameUserInformation($data) {
        return $this->query($this->insertGameUserQuery($data));
    }

    public function deleteGameUserInformation($data) {
        return $this->query($this->deleteGameUserQuery($data));
    }

    private function selectGameUserQuery($data) {
        return "
            SELECT 
                guc.gameId as gameId,
                guc.userId as userId,
                guc.eventId as eventId,
                guc.gameTeamId as gameTeamId,
                guc.type as type,
                g.game as gameTitle
            FROM
                gamesUsersConnector guc,
                games g
            WHERE
                guc.userId = '{$this->escapeCharacters($data['userId'])}'
                AND guc.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND guc.gameId = g.gameId
        ;
      ";
    }

    private function insertGameUserQuery($data) {
        $gameTeamId = (ISSET($data['gameTeamId']) ? $this->escapeCharacters($data['gameTeamId']) : 'NULL');
        return "
            INSERT INTO
                gamesUsersConnector
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
                {$gameTeamId},
                '{$this->escapeCharacters($data['type'])}'
          )
        ;
      ";
    }

    private function deleteGameUserQuery($data) {
        return "
            DELETE FROM
                gamesUsersConnector
            WHERE
                gameId = '{$this->escapeCharacters($data['gameId'])}'
                AND userId = '{$this->escapeCharacters($data['userId'])}'
                AND eventId = '{$this->escapeCharacters($data['eventId'])}'
        ;
      ";
    }
}
?>
