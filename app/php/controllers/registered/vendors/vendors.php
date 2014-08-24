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
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $vendorJson = array();
        $payload = $_GET;
        $this->vendorsObj->getVendorInformation($payload);
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
}

new Vendors($this->userId);

?>
