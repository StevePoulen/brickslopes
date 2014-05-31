<?php

class Authentication {
    private $usersObj;
    private $requestMethod;

    public function __construct() {
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
        } else if ($requestMethod == "PUT") {
            $this->put();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        if($this->usersObj->authenticateUser($_GET) === 1) {
            if ($this->usersObj->result) {
                header("HTTP/1.0 200 Success");
                $dbObj = $this->usersObj->result->fetch_object();
                echo $this->createPayload(
                    $dbObj->userId,
                    $dbObj->firstName, 
                    $dbObj->lastName, 
                    200 
                );
            }
        } else {
            header("HTTP/1.0 401 Unauthorized");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        $response = $this->usersObj->addUserInformation($payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
            echo $this->createPayload(
                $response,
                $payload['firstName'], 
                $payload['lastName'], 
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

    private function put() {
        $payload = json_decode(file_get_contents("php://input"), true);
        $newPassword = $this->generatePassword();
        $response = $this->usersObj->resetPassword($payload, $newPassword);
        if ($this->usersObj->result) {
            $dbObj = $this->usersObj->result->fetch_object();
            $emailObj = new Mail($payload['email']);
            $emailObj->sendResetEmailMessage($dbObj->firstName, $newPassword);
        }
        header("HTTP/1.0 200 Success");
    }

    private function generatePassword() {
        return \base_convert(rand(78364164096, 2821109907455), 10, 36);
    }

    private function createPayload($userId, $firstName, $lastName, $status) {
        return json_encode (
            array (
                'data' => array (
                    'firstName' => $firstName, 
                    'lastName' => $lastName,
                    'token' => $this->encodeJWT($userId)
                ),
                'status' => $status
            )
        );
    }

    private function encodeJWT($userId) {
        $token = array(
            "iss" => "https://www.brickslopes.com",
            "aud" => $_SERVER['HTTP_HOST'],
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "userId" => $userId
         );

        $jwt = JWT::encode($token, JWT_KEY);
        return $jwt;
    }
}

new Authentication();

?>
