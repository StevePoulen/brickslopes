<?php

class Authentication {
    private $usersObj;
    private $requestMethod;

    public function __construct() {
        $this->usersObj = new users();
        $this->requestMethod = $_SERVER['REQUEST_METHOD'];
        $this->runIt();
    }

    public function runIt() {

        if ($this->requestMethod == "GET") {
            if($this->usersObj->authenticateUser($_GET) === 1) {
                if ($this->usersObj->result) {
                    header("HTTP/1.0 200 Success");
                    $dbObj = $this->usersObj->result->fetch_object();
                    echo $this->createPayload(
                        $dbObj->userId,
                        $dbObj->firstName, 
                        $dbObj->lastName, 
                        200, 
                        $this
                    );
                }
            } else {
                header("HTTP/1.0 401 Unauthorized");
            }
        } else if ($this->requestMethod == "POST") {
            $payload = json_decode(file_get_contents("php://input"), true);
            $response = $this->usersObj->addUserInformation($payload);
            if (preg_match ( '/\d+/', $response )) {
                header("HTTP/1.0 201 Created");
                echo $this->createPayload(
                    $response,
                    $payload['firstName'], 
                    $payload['lastName'], 
                    201, 
                    $this
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
        } else if ($this->requestMethod == "PUT") {
            $payload = json_decode(file_get_contents("php://input"), true);
            $newPassword = $this->generatePassword();
            $response = $this->usersObj->resetPassword($payload, $newPassword);
            if ($this->usersObj->result) {
                $dbObj = $this->usersObj->result->fetch_object();
                $emailObj = new Mail($payload['email']);
                $emailObj->sendResetEmailMessage($dbObj->firstName, $newPassword);
            }
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function generatePassword() {
        return \base_convert(rand(78364164096, 2821109907455), 10, 36);
    }

    private function createPayload($userId, $firstName, $lastName, $status, $self) {
        return json_encode (
            array (
                'data' => array (
                    'firstName' => $firstName, 
                    'lastName' => $lastName,
                    'token' => $self->encodeJWT($userId)
                ),
                'status' => $status
            )
        );
    }
}

new Authentication();

?>
