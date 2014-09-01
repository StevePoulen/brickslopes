<?php

class TableRegistration {
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
        } else if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $payload = $_GET;
        $this->vendorsObj->getTableInformation($payload['tableId']);
        if ($this->vendorsObj->result) {
            if ($dbObj = $this->vendorsObj->result->fetch_object()) {
                $tableJson = array (
                    'storeId' => $dbObj->storeId,
                    'eventId' => $dbObj->eventId,
                    'tableId' => $dbObj->tableId,
                    'tables' => $dbObj->tables
                );
                header("HTTP/1.0 200 Success");
                echo json_encode ($tableJson);
                return;
            }
        }

        header("HTTP/1.0 412 Precondition Failed");
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $payload['type'] = 'OWNER';
        $tableId = $this->vendorsObj->addTableInformation($payload);

        if (preg_match ( '/\d+/', $tableId)) {
            $registrationPayload = array (
                'eventId' => $payload['eventId'],
                'userId' => $payload['userId'],
                'ageVerification' => 'YES',
                'comments' => '',
                'type' => 'AFOL'
            );

            $registrationsObj = new registrations();
            $registrationsObj->addRegistrationInformation($registrationPayload);

            $userObj = new users();
            $userObj->getUserInformation($this->userId);
            if ($userObj->result) {
                $dbObj = $userObj->result->fetch_object();
                $payload['firstName'] = $dbObj->firstName;
                $payload['lastName'] = $dbObj->lastName;
            }

            $lineItemPayload = array (
                'discountDate' => '2199-01-01 12:00:00',
                'eventId' => $payload['eventId'],
                'userId' => $payload['userId'],
                'badgeLine1' => "{$payload['firstName']} {$payload['lastName']}",
                'vendor' => 'YES',
                'vendorTables' => $payload['tables'],
                'description' => "{$payload['firstName']} {$payload['lastName']}"
            );
            $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);
            $this->registrationLineItemHelper->addRegistrationLineItems($lineItemPayload);

            $emailObj = new mail($this->userId);
            $emailObj->sendVendorRegistrationMessage($this->userId, $payload['eventId']);

            header("HTTP/1.0 201 Created");

            echo json_encode (
                array (
                    'storeId' => $payload['storeId']
                )
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function adjustExistingTableLineItems($payload) {

        $this->deleteExistingTableLineItems($payload);
        $this->updateTableLineItems($payload);
    }

    private function deleteExistingTableLineItems($payload) {
        $this->registrationLineItemHelper->deleteEventTableLineItems(
            $payload['userId'],
            $payload['eventId']
        );
    }

    private function updateTableLineItems($payload) {
        $lineItemPayload = array (
            'discountDate' => '2199-01-01 12:00:00',
            'eventId' => $payload['eventId'],
            'userId' => $payload['userId'],
            'vendor' => 'YES',
            'vendorTables' => $payload['tables'],
        );
        $this->registrationLineItemHelper->addVendorLineItemFromTables($lineItemPayload);
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $tableId = $this->vendorsObj->editTableInformation($payload);

        if (preg_match ( '/\d+/', $tableId)) {
            $this->registrationLineItemHelper = new registrationLineItemHelper($payload['eventId']);

            $this->adjustExistingTableLineItems($payload);

            header("HTTP/1.0 200 Success");
            echo 200;

        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new TableRegistration($this->userId);

?>
