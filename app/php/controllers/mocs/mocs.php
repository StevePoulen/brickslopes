<?php

class Mocs {
    private $userId;
    private $requestMethod;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->mocObj = new mocModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "POST") {
            $this->post();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->mocObj->addMocInformation($payload);
        echo $response;
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Mocs($this->userId);

?>
