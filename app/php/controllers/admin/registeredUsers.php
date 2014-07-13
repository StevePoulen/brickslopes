<?php

class RegisteredUsers {
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
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->usersObj->getAllUserInformation();
        header("HTTP/1.0 200 Success");
        $users = array();
        while ($dbObj = $this->usersObj->result->fetch_object()) {
            array_push(
                $users,
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
        }
        echo json_encode (
            $users
        );
    }
}

new RegisteredUsers();

?>
