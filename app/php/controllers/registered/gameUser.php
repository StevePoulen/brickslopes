<?php

class GameUser {
    private $gamesObj;
    private $userId;
    private $requestMethod;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->gamesObj = new gamesModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "GET") {
            $this->get();
        } else if ($requestMethod == "POST") {
            $this->post();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->gamesObj->getGameUserInformation($_GET);
        if ($this->gamesObj->result) {
            $gamesUsersMap = array();
            while($dbObj = $this->gamesObj->result->fetch_object()) {
                array_push(
                    $gamesUsersMap,
                    array(
                        'eventId' => $dbObj->eventId,
                        'gameId' => $dbObj->gameId,
                        'userId' => $dbObj->userId,
                        'gameTeamId' => $dbObj->gameTeamId,
                        'type' => $dbObj->type
                    )
                );
            }
            header("HTTP/1.0 200 Success");
            echo json_encode (
                $gamesUsersMap
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->gamesObj->addGameUserInformation($payload);

        if (preg_match ( '/^\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new GameUser($this->userId);

?>
