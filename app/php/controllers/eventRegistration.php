<?php

class EventRegistration {
    private $registrationsObj;
    private $requestMethod;
    private $userId;
    private $registrationLineItemHelper;

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
        if ($this->registrationsObj->result) {
            while($dbObj = $this->registrationsObj->result->fetch_object()) {
                array_push( $eventJson, 
                    array (
                        'badgeLine1' => $dbObj->badgeLine1,
                        'badgeLine2' => $dbObj->badgeLine2, 
                        'meetAndGreet' => $dbObj->meetAndGreet,
                        'ageVerification' => $dbObj->ageVerification,
                        'tShirtSize' => $dbObj->tShirtSize,
                        'paid' => $dbObj->paid,
                        'name' => $dbObj->name
                    )
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode ($eventJson);
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->registrationsObj->addRegistrationInformation($payload);

        if (preg_match ( '/\d+/', $response )) {
            $this->registrationLineItemHelper = new registrationLineItemHelper();
            $this->registrationLineItemHelper->addRegistrationLineItems($payload);

            $emailObj = new mail('to_be_set_later');
            $emailObj->sendEventRegistrationMessage($this->userId);

            header("HTTP/1.0 201 Created");

        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new EventRegistration($this->userId);

?>
