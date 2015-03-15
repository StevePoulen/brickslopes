<?php

class RegisteredGames {
    private $adminGamesObj;
    private $requestMethod;

    public function __construct() {
        $this->adminGamesObj = new adminGamesModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "GET") {
            $this->get();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $payload = $_GET;
        $this->adminGamesObj->getAllGameInformation($payload['eventId']);
        header("HTTP/1.0 200 Success");
        $games = array();
        while ($dbObj = $this->adminGamesObj->result->fetch_object()) {
            if (! ISSET($games[$dbObj->gameId])) {
                $games[$dbObj->gameId] = array(
                    'gameName' => $dbObj->gameName,
                    'maxParticipants' => $dbObj->maxParticipants,
                    'registeredAfols' => array()
                );
            }

            if ($dbObj->firstName != "no_current_afol" && $dbObj->lastName != "no_current_afol") {
                array_push(
                    $games[$dbObj->gameId]['registeredAfols'],
                    array (
                        'firstName' => $dbObj->firstName, 
                        'lastName' => $dbObj->lastName,
                    )
                );
            }
        }

        $returnGames = array();

        foreach($games as $key => $game) {
            array_push(
                $returnGames,
                $game
            );
        }

        echo json_encode (
            $returnGames
        );
    }
}

new RegisteredGames();

?>
