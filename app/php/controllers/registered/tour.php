<?php

class Tour {
    private $userObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
        $this->userObj = new users();
        $this->userId = $userId;
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $this->userObj->updateTour($payload);
        header("HTTP/1.0 200 Success");
    }
}

new Tour($this->userId);

?>
