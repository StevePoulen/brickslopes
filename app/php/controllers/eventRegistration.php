<?php

class EventRegistration {
    private $registrationsObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
        $this->registrationsObj = new registrations();
        $this->userId = $userId;
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
        $payload['userId'] = $this->userId;
        $response = $this->registrationsObj->addRegistrationInformation($payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new EventRegistration($this->userId);

?>
