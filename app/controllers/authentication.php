<?php
    include_once(__DIR__ . '/../models/users.php');
    include_once(__DIR__ . '/../lib/mail.php');

    $usersObj = new users();
    $requestMethod = $_SERVER['REQUEST_METHOD'];

    if ($requestMethod == "GET") {
        if($usersObj->authenticateUser($_GET) === 1) {
            if ($usersObj->result) {
                header("HTTP/1.0 200 Success");
                $dbObj = $usersObj->result->fetch_object();
                echo createPayload(
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
    } else if ($requestMethod == "POST") {
        $payload = json_decode(file_get_contents("php://input"), true);
        $response = $usersObj->addUserInformation($payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
            echo createPayload(
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
    } else if ($requestMethod == "PUT") {
        $payload = json_decode(file_get_contents("php://input"), true);
        $newPassword = generatePassword();
        $response = $usersObj->resetPassword($payload, $newPassword);
        if ($usersObj->result) {
            $dbObj = $usersObj->result->fetch_object();
            $emailObj = new Mail($payload['email']);
            $emailObj->sendResetEmailMessage($dbObj->firstName, $newPassword);
        }
        header("HTTP/1.0 200 Success");
    } else {
        header("HTTP/1.0 405 Method Not Allowed");
    }

    function generatePassword() {
        return \base_convert(rand(78364164096, 2821109907455), 10, 36);
    }

    function createPayload($userId, $firstName, $lastName, $status, $self) {
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

?>
