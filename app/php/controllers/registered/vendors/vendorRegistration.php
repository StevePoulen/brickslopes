<?php

class VendorRegistration {
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
        $payload['userId'] = $this->userId;
        $this->vendorsObj->getVendorStoreInformation($payload);
        if ($this->vendorsObj->result) {
            if ($dbObj = $this->vendorsObj->result->fetch_object()) {
                $vendorJson = array (
                    'storeId' => $dbObj->storeId,
                    'name' => $dbObj->name,
                    'description' => $dbObj->description,
                    'url' => $dbObj->url,
                    'logo' => $dbObj->logo,
                    'tables' => $dbObj->tables
                );
                header("HTTP/1.0 200 Success");
                echo json_encode ($vendorJson);
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
        $storeId = $this->vendorsObj->addStoreInformation($payload);

        if (preg_match ( '/\d+/', $storeId)) {
            header("HTTP/1.0 201 Created");

            echo json_encode (
                array (
                    'storeId' => $storeId
                )
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $storeId = $this->vendorsObj->editStoreInformation($payload);

        if (preg_match ( '/\d+/', $storeId)) {
            header("HTTP/1.0 200 Success");
            echo '200';
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new VendorRegistration($this->userId);

?>
