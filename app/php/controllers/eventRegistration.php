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

        if ($requestMethod == "GET") {
            $this->get();
        } else if ($requestMethod == "POST") {
            $this->post();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $eventJson = array();
        $this->registrationsObj->getRegistrationInformationByUserId($this->userId);
        header("HTTP/1.0 200 Success");
        if ($this->registrationsObj->result) {
            while($dbObj = $this->registrationsObj->result->fetch_object()) {
                array_push( $eventJson, 
                    array (
                        'badgeLine1' => $dbObj->badgeLine1,
                        'badgeLine2' => $dbObj->badgeLine2, 
                        'meetAndGreet' => $dbObj->meetAndGreet,
                        'ageVerification' => $dbObj->ageVerification,
                        'tShirtSize' => $dbObj->tShirtSize,
                        'tShirtPaid' => $dbObj->tShirtPaid,
                        'paid' => $dbObj->paid,
                        'name' => $dbObj->name
                    )
                );
            }
        }
        echo json_encode ($eventJson);
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
