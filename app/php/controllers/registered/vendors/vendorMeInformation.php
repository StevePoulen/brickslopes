<?php

class VendorMeInformation {
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
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function getAssociates($payload) {
        $associates = array();
        $this->vendorsObj->getStoreEventUserInformation($payload);
        if ($this->vendorsObj->result) {
            while ($dbObj = $this->vendorsObj->result->fetch_object()) {
                array_push(
                    $associates,
                    array (
                        'associateId' => $dbObj->associateId,
                        'firstName' => $dbObj->firstName,
                        'lastName' => $dbObj->lastName
                    )   
                );
            }
        }

        return $associates;
    }

    private function getStoreInformation($payload) {
        $this->vendorsObj->getVendorStoreInformation($payload);
        if ($this->vendorsObj->result) {
            if ($dbObj = $this->vendorsObj->result->fetch_object()) {
                return array (
                    'storeId' => $dbObj->storeId,
                    'name' => $dbObj->name,
                    'description' => $dbObj->description,
                    'url' => $dbObj->url,
                    'logo' => $dbObj->logo,
                    'creationDate' => $dbObj->creationDate
                );
            }
        }

        return false;
    }

    private function getEventTableInformation($payload) {
        $tables = array();
        $this->vendorsObj->getEventTableInformation($payload);
        if ($this->vendorsObj->result) {
            if ($dbObj = $this->vendorsObj->result->fetch_object()) {
                $tables = array (
                    'tableId' => $dbObj->tableId,
                    'tables' => $dbObj->tables
                );
            }
        }

        return $tables;
    }

    private function get() {
        $payload = $_GET;
        $payload['userId'] = $this->userId;
        $continue = true;
        $vendorJson = array (
            'store' => array(),
            'tables' => array(),
            'associates' => array() 
        );

        $storeJson = $this->getStoreInformation($payload);
        if (is_array($storeJson)) {
            $vendorJson['store'] = $storeJson;
            $payload['storeId'] = $storeJson['storeId'];
            $vendorJson['tables'] = $this->getEventTableInformation($payload);
            $vendorJson['associates'] = $this->getAssociates($payload);
        } else {
            $continue = false;
        }

        if ($continue) {
            header("HTTP/1.0 200 Success");
            echo json_encode ($vendorJson);
        } else {
            header("HTTP/1.0 412 Precondition Failed");
        }
    }
}

new VendorMeInformation($this->userId);

?>
