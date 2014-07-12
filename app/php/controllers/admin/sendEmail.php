<?php

class SendEmail {
    private $usersObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
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

    private function isEventRegistrationMessage($payload) {
        return $payload['type'] === 'eventRegistration';
    }

    private function isUserRegistrationMessage($payload) {
        return $payload['type'] === 'userRegistration';
    }

    private function isRegistrationPaidDisplayMessage($payload) {
        return $payload['type'] === 'registrationPaidDisplay';
    }

    private function isResetPasswordMessage($payload) {
        return $payload['type'] === 'resetPassword';
    }

    private function get() {
        $payload = $_GET;

        if ($this->validatePayload($payload)) {
            if ($this->isRegistrationPaidMessage($payload)) {
                $this->sendRegistrationPaidMessage($payload);
            } else if ($this->isEventRegistrationMessage($payload)) {
                $this->displayEventRegistrationMessage();
            } else if ($this->isUserRegistrationMessage($payload)) {
                $this->displayUserRegistrationMessage();
            } else if ($this->isRegistrationPaidDisplayMessage($payload)) {
                $this->displayRegistrationPaidMessage();
            } else if ($this->isResetPasswordMessage($payload)) {
                $this->displayResetPasswordMessage();
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

    private function displayEventRegistrationMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed');
        echo $emailObj->sendEventRegistrationMessage($this->userId, true);
    }

    private function displayUserRegistrationMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed');
        echo $emailObj->sendUserRegistrationMessage('Brian', true);
    }

    private function displayRegistrationPaidMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed');
        echo $emailObj->sendRegistrationPaidMessage('Brian', true);
    }

    private function displayResetPasswordMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed');
        echo $emailObj->sendResetEmailMessage('Brian', 'New Password', true);
    }
}

try {
    if(ISSET($this)) {
        $userId = $this->userId;
    } else {
        $userId = null;
    }
} catch (exception $e) {
    $userId = null;
}

new SendEmail($userId);

?>
