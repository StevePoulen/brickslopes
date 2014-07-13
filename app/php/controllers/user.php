<?php

class User {
    private $usersObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->usersObj = new users();
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
        $response = $this->usersObj->getUserInformation($this->userId);
        if ($response) {
            header("HTTP/1.0 200 Success");
            $dbObj = $this->usersObj->result->fetch_object();
            echo json_encode (
                array (
                    'userId' => $dbObj->userId,
                    'firstName' => $dbObj->firstName, 
                    'lastName' => $dbObj->lastName,
                    'email' => $dbObj->email,
                    'address' => $dbObj->address,
                    'city' => $dbObj->city,
                    'state' => $dbObj->state,
                    'zipcode' => $dbObj->zipcode,
                    'phoneNumber' => $dbObj->phoneNumber,
                    'joined' => $dbObj->joined
                )
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new User($this->userId);

?>
