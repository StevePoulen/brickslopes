<?php

class adminGamesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getAllGameInformation($eventId) {
        return $this->query($this->selectAllRegisteredGamesQuery($eventId));
    }

    private function selectAllRegisteredGamesQuery($eventId) {
        return "
            SELECT 
                g.gameId as gameId, 
                g.maxParticipants as maxParticipants,
                g.game as gameName, 
                IFNULL(u.firstName, 'no_current_afol') as firstName, 
                IFNULL(u.lastName, 'no_current_afol') as lastName,
                r.paid as paid
            FROM 
                games g 
                    LEFT JOIN gamesEventsConnector gec 
                        ON g.gameId = gec.gameId 
                    LEFT JOIN gamesUsersConnector guc 
                        ON g.gameId = guc.gameId 
                    LEFT JOIN users u 
                        ON guc.userId = u.userId 
                    LEFT JOIN registrations r
                        ON u.userId = r.userId
                        AND r.eventId = $eventId
            WHERE 
                gec.eventId = '$eventId'
            ORDER BY
                gameName, firstName, lastName
        ;
      ";
    }
}
?>
