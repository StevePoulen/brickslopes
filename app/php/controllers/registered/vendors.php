<?php

class Vendors {
    private $vendorsObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
        $this->vendorsObj = new vendorModel();
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
        $vendorJson = array();
        $payload = $_GET;
        $this->vendorsObj->getVendorInformation($payload['eventId']);
        if ($this->vendorsObj->result) {
            while($dbObj = $this->vendorsObj->result->fetch_object()) {
                array_push(
                    $vendorJson,
                    array (
                        'vendorId' => $dbObj->vendorId,
                        'name' => $dbObj->name,
                        'description' => $dbObj->description,
                        'url' => $dbObj->url,
                        'logo' => $dbObj->logo,
                        'tables' => $dbObj->tables
                    )
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode ($vendorJson);
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $vendorId = $this->vendorsObj->addVendorInformation($payload);

        if (preg_match ( '/\d+/', $vendorId)) {
            $registrationPayload = array (
                'eventId' => $payload['eventId'],
                'userId' => $payload['userId'],
                'ageVerification' => 'YES',
                'comments' => '',
                'type' => 'AFOL'
            );

            $registrationsObj = new registrations();
            $registrationsObj->addRegistrationInformation($registrationPayload);

            $lineItemPayload = array (
                'discountDate' => '2199-01-01 12:00:00',
                'eventId' => $payload['eventId'],
                'userId' => $payload['userId'],
                'badgeLine1' => $payload['name'],
                'vendor' => 'YES',
                'vendorTables' => '10',
            );
            $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
            $this->registrationLineItemHelper->addRegistrationLineItems($lineItemPayload);

            $emailObj = new mail($this->userId);
            $emailObj->sendVendorRegistrationMessage($this->userId, $payload['eventId']);

            header("HTTP/1.0 201 Created");

        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Vendors($this->userId);

?>
