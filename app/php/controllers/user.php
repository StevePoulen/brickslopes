<?php

class User extends jwtToken {
    private $usersObj;
    private $requestMethod;
    private $userId;
    private $isAdmin;
    private $isRegistered;

    function __construct($userId, $isAdmin, $isRegistered) {
        parent::__construct();
        $this->userId = $userId;
        $this->isAdmin = $isAdmin;
        $this->isRegistered = $isRegistered;
        $this->usersObj = new users();
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
                    'flickr' => $dbObj->flickr,
                    'joined' => $dbObj->joined
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
        $response = $this->usersObj->addUserInformation($payload);
        if (preg_match ( '/\d+/', $response )) {
            $emailObj = new mail($payload['email']);
            $emailObj->sendUserRegistrationMessage($payload['firstName']);
            header("HTTP/1.0 201 Created");
            echo $this->createPayload (
                $response,
                $payload['firstName'], 
                $payload['lastName'], 
                'NO',
                'NO',
                201 
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
            echo json_encode (
                array (
                    'data' => 'Duplicate E-mail',
                    'status' => 400
                )
            );
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $response = $this->usersObj->updateUserInformation($this->userId, $payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
            echo $this->createPayload (
                $this->userId,
                $payload['firstName'], 
                $payload['lastName'], 
                ($this->isAdmin ? 'YES' : 'NO'),
                ($this->isRegistered ? 'YES' : 'NO'),
                201 
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
            echo json_encode (
                array (
                    'data' => 'Duplicate E-mail',
                    'status' => 400
                )
            );
        }
    }
}

new User($this->userId, $this->isAdmin, $this->isRegistered);

?>
