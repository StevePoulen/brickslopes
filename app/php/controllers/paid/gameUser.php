<?php

class GameUser {
    private $gameUserObj;
    private $userId;
    private $requestMethod;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->gameUserObj = new gameUserModel();
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
        } else if ($requestMethod == "DELETE") {
            $this->delete();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $payload = $_GET;
        $payload['userId'] = $this->userId;
        $this->gameUserObj->getGameUserInformation($payload);
        if ($this->gameUserObj->result) {
            $gamesUsersMap = array();
            while($dbObj = $this->gameUserObj->result->fetch_object()) {
                $gamesUsersMap[$dbObj->gameId] = array (
                    'eventId' => $dbObj->eventId,
                    'gameId' => $dbObj->gameId,
                    'userId' => $dbObj->userId,
                    'gameTeamId' => $dbObj->gameTeamId,
                    'type' => $dbObj->type,
                    'gameTitle' => $dbObj->gameTitle
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

    private function getDiscountDateOfTomorrow() {
        return date('Y-m-d h:i:s', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
    }

    private function addGameFees($payload) {
        if ($payload['gameId'] === '3' or $payload['gameId'] === '4') {
            $payload['discountDate'] = $this->getDiscountDateOfTomorrow();
            $registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
            if ($payload['gameId'] === '3') {
                $registrationLineItemHelper->addDraftOneLineItemFromGames($payload);
            } else {
                $registrationLineItemHelper->addDraftTwoLineItemFromGames($payload);
            }
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->gameUserObj->addGameUserInformation($payload);
        $this->addGameFees($payload);

        if (preg_match ( '/^\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function delete() {
        $payload = $_GET;
        $payload['userId'] = $this->userId;
        $response = $this->gameUserObj->deleteGameUserInformation($payload);

        if (preg_match ( '/^\d+/', $response )) {
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new GameUser($this->userId);

?>
