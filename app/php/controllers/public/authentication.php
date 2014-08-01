<?php

class Authentication extends jwtToken {
    private $usersObj;
    private $requestMethod;
    private $userId;

    function __construct($userId = null) {
        parent::__construct();
        $this->usersObj = new users();
        $this->userId = $userId;
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "POST") {
            $this->post();
        } else if ($requestMethod == "PUT") {
            $this->put();
        } else if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if($this->usersObj->authenticateUser($payload) === 1) {
            if ($this->usersObj->result) {
                header("HTTP/1.0 200 Success");
                $dbObj = $this->usersObj->result->fetch_object();
                echo $this->createPayload (
                    $dbObj->userId,
                    $dbObj->firstName, 
                    $dbObj->lastName, 
                    $dbObj->admin,
                    $dbObj->registered,
                    $dbObj->paid
                );
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
        }
    }

    private function put() {
        $payload = json_decode(file_get_contents("php://input"), true);
        $newPassword = $this->generatePassword();
        $this->usersObj->resetPassword($payload, $newPassword);
        if ($this->usersObj->result) {
            $dbObj = $this->usersObj->result->fetch_object();
            $emailObj = new mail($payload['email']);
            $emailObj->sendResetEmailMessage($dbObj->firstName, $newPassword);
        }
        header("HTTP/1.0 200 Success");
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        $response = $this->usersObj->updatePassword($this->userId, $payload);
        if ($response != 0) {
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 412 Precondition Failed");
        }
    }

    private function generatePassword() {
        return \base_convert(rand(78364164096, 2821109907455), 10, 36);
    }

}

new Authentication($this->userId);

?>
