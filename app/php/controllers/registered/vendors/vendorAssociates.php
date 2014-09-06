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
        } else if ($requestMethod == "DELETE") {
            $this->delete();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $associateJson = array();
        $payload = $_GET;
        $this->vendorsObj->getStoreEventUserInformation($payload);
        if ($this->vendorsObj->result) {
            while($dbObj = $this->vendorsObj->result->fetch_object()) {
                array_push(
                    $associateJson,
                    array (
                        'associateId' => $dbObj->associateId,
                        'firstName' => $dbObj->firstName,
                        'lastName' => $dbObj->lastName
                    )
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode ($associateJson);
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
        $registrationId = $registrationsObj->addRegistrationInformation($registrationPayload);

        if (preg_match ( '/^\d+/', $registrationId)) {
            $lineItemPayload = array (
                'discountDate' => '2199-01-01 12:00:00',
                'eventId' => $payload['eventId']
            );

            if ($payload['addAfolPass'] === 'YES') {
                $lineItemPayload['badgeLine1'] = "{$payload['firstName']} {$payload['lastName']}";
            } else {
                $lineItemPayload['vendorPass'] = 'YES';
            }
            $lineItemPayload['description'] = "{$payload['firstName']} {$payload['lastName']}";

            $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
            //Add the line item to the vendor (store owner)
            $lineItemPayload['userId'] = $this->userId;
            $lineItemPayload['isOwner'] = 'NO';
            $this->registrationLineItemHelper->addRegistrationLineItems($lineItemPayload);

            //Add the line item to the user (store associate)
            $lineItemPayload['userId'] = $payload['userId'];
            $lineItemPayload['nocost'] = true;
            $lineItemPayload['isOwner'] = 'YES';
            $this->registrationLineItemHelper->addRegistrationLineItems($lineItemPayload);

            $associateId = $this->vendorsObj->addStoreEventUserInformation($payload);
            if (preg_match ( '/\d+/', $associateId)) {
                header("HTTP/1.0 201 Created");

                echo json_encode (
                    array (
                        'associateId' => $associateId,
                        'firstName' => $payload['firstName'],
                        'lastName' => $payload['lastName']
                    )
                );

            } else {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode (array(
                    'error' => 'Bad Request' 
                ));
            }
        } else {
            header("HTTP/1.0 412 Precondition Failed");
            echo json_encode (array(
                'error' => 'existing registrar' 
            ));
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }

        $payload['type'] = 'ASSOCIATE';
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
            $emailObj = new mail($userId);
            $emailObj->sendUserRegistrationMessage($userId);
        } else {
            $userObj->getUserInformationByEmail($payload['email']);
            if ($userObj->result) {
                $dbObj = $userObj->result->fetch_object();
                if ($dbObj->userId == $this->userId) {
                    header("HTTP/1.0 412 Precondition Failed");
                    echo json_encode (array(
                        'error' => 'selfie' 
                    ));
                } else {
                    $payload['userId'] = $dbObj->userId;
                    $payload['firstName'] = $dbObj->firstName;
                    $payload['lastName'] = $dbObj->lastName;
                    $payload['email'] = $dbObj->email;
                    $this->addAssociateVendor($payload);
                }
            } else {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode (array(
                    'error' => 'Bad Request' 
                ));
            }
        }
    }
}

new VendorAssociates($this->userId);

?>
