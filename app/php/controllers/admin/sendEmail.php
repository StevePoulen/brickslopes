<?php

class SendEmail {
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

        if ($requestMethod == "POST") {
            $this->post();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function validatePayload($payload) {
        if (!(ISSET($payload['type']) && ISSET($payload['userId']))) {
            header("HTTP/1.0 400 Bad Request");
            return false;
        }

        return true;
    }

    private function isRegistrationPaidMessage($payload) {
        return $payload['type'] === 'registrationPaid';
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }

        if ($this->validatePayload($payload)) {
            if ($this->isRegistrationPaidMessage($payload)) {
                $this->sendRegistrationPaidMessage($payload);
            } else {
                header("HTTP/1.0 412 Precondition Failed");
            }
        }
    }

    private function sendRegistrationPaidMessage($payload) {
        $this->usersObj->getUserInformation($payload['userId']);
        if($this->usersObj->result) {
            $dbObj = $this->usersObj->result->fetch_object();
            $email = $dbObj->email;
            $emailObj = new mail($email);
            $emailObj->sendRegistrationPaidMessage($dbObj->firstName);
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 412 Precondition Failed");
        }
    }
}

new SendEmail();

?>
