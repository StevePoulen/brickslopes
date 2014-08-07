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
        } else if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $eventJson = array();
        $this->registrationsObj->getRegistrationInformationByUserId($this->userId);
        if ($this->registrationsObj->result) {
            $registrationLineItemsObj = new registrationLineItems($this->userId, false);
            while($dbObj = $this->registrationsObj->result->fetch_object()) {
                $eventJson[$dbObj->eventId] = 
                    array (
                        'ageVerification' => $dbObj->ageVerification,
                        'paid' => $dbObj->paid,
                        'comments' => $dbObj->comments,
                        'name' => $dbObj->eventName,
                        'registrationId' => $dbObj->registrationId,
                        'lineItems' => $registrationLineItemsObj->getRegisteredLineItems($this->userId, $dbObj->eventId)
                    );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode ($eventJson);
    }

    private function deleteGameUserInformation($payload) {
        $payload['gameId'] = 3;
        $gameUserObj = new gameUserModel();
        $gameUserObj->deleteGameUserInformation($payload);
        $payload['gameId'] = 4;
        $gameUserObj->deleteGameUserInformation($payload);
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->registrationsObj->updateRegistrationInformation($payload);

        $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
        $this->registrationLineItemHelper->deleteRegistrationLineItems(
            $payload['userId'],
            $payload['eventId']
        );
        
        $this->deleteGameUserInformation($payload);

        if (preg_match ( '/\d+/', $response )) {
            $this->registrationLineItemHelper->addRegistrationLineItems($payload);

            $emailObj = new mail($this->userId);
            $emailObj->sendEventRegistrationMessage($this->userId, $payload['eventId']);

            header("HTTP/1.0 201 Created");

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
        $response = $this->registrationsObj->addRegistrationInformation($payload);

        if (preg_match ( '/\d+/', $response )) {
            $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
            $this->registrationLineItemHelper->addRegistrationLineItems($payload);

            $emailObj = new mail($this->userId);
            $emailObj->sendEventRegistrationMessage($this->userId, $payload['eventId']);

            header("HTTP/1.0 201 Created");

        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new EventRegistration($this->userId);

?>
