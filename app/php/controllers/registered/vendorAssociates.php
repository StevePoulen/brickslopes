<?php

class VendorAssociates {
    private $vendorsObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->vendorsObj = new vendorModel();
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
        $vendorJson = array();
        $payload = $_GET;
        $this->vendorsObj->getVendorAssociateInformation($payload);
        if ($this->vendorsObj->result) {
            while($dbObj = $this->vendorsObj->result->fetch_object()) {
                array_push(
                    $vendorJson,
                    array (
                        'vendorConnectorId' => $dbObj->vendorConnectorId,
                        'firstName' => $dbObj->firstName,
                        'lastName' => $dbObj->lastName
                    )
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode ($vendorJson);
    }

    private function addAssociateVendor($payload) {
        $registrationPayload = array (
            'eventId' => $payload['eventId'],
            'userId' => $payload['userId'],
            'ageVerification' => 'YES',
            'comments' => '',
            'type' => 'VENDOR'
        );

        $registrationsObj = new registrations();
        $registrationsObj->addRegistrationInformation($registrationPayload);

        $lineItemPayload = array (
            'discountDate' => '2199-01-01 12:00:00',
            'eventId' => $payload['eventId']
        );

        if ($payload['addAfolPass'] === 'YES') {
            $lineItemPayload['userId'] = $this->userId;
            $lineItemPayload['badgeLine1'] = "{$payload['firstName']} {$payload['lastName']}";
        } else {
            $lineItemPayload['userId'] = $payload['userId'];
            $lineItemPayload['vendorPass'] = 'YES';
        }


        $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
        $this->registrationLineItemHelper->addRegistrationLineItems($lineItemPayload);

        $vendorConnectorId = $this->vendorsObj->addVendorConnectorInformation($payload);
        if (preg_match ( '/\d+/', $vendorConnectorId)) {
            header("HTTP/1.0 201 Created");

            echo json_encode (
                array (
                    'vendorConnectorId' => $vendorConnectorId
                )
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
        //add user
        $userPayload = array (
            'firstName' => $payload['firstName'],
            'lastName' => $payload['lastName'],
            'email' => $payload['email'],
        );
        $userObj = new users();
        $userId = $userObj->addUserInformation($userPayload);
        if (preg_match ( '/\d+/', $userId)) {
            $payload['userId'] = $userId;
            $this->addAssociateVendor($payload);
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }

        $userObj = new users();
        $userObj->getUserInformation($payload['userId']);
        if ($userObj->result) {
            $dbObj = $userObj->result->fetch_object();
            $payload['firstName'] = $dbObj->firstName;
            $payload['lastName'] = $dbObj->lastName;
            $payload['email'] = $dbObj->email;
            $this->addAssociateVendor($payload);
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new VendorAssociates($this->userId);

?>