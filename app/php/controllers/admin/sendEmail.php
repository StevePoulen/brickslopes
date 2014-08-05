<?php

class SendEmail {
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
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

    private function isPreviewSiteNewsMessage($payload) {
        return $payload['type'] === 'previewSiteNews';
    }

    private function isSendSiteNewsMessage($payload) {
        return $payload['type'] === 'siteNews';
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
            } else if ($this->isPreviewSiteNewsMessage($payload)) {
                $this->sendSiteNewsMessage($payload, true);
            } else if ($this->isSendSiteNewsMessage($payload)) {
                $this->sendSiteNewsMessage($payload );
            } else {
                header("HTTP/1.0 412 Precondition Failed");
            }
        }
    }

    private function sendRegistrationPaidMessage($payload) {
        $emailObj = new mail('provided_later', $this->userId);
        $emailObj->sendRegistrationPaidMessage($payload['userId'], $payload['eventId']);
        header("HTTP/1.0 200 Success");
    }

    private function sendSiteNewsMessage($payload, $isPreview=false) {
        if ($this->userId == '1') {
            $emailObj = new mail('provided_later', $this->userId);
            $previewBody = $emailObj->sendSiteNewsMessage($payload['emailBody'], $isPreview);
            if ($isPreview) {
                echo $previewBody;
            } 
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 412 Precondition Failed");
        }
    }

    private function displayEventRegistrationMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed', $this->userId);
        echo $emailObj->sendEventRegistrationMessage(21, 2, true);
    }

    private function displayUserRegistrationMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed', $this->userId);
        echo $emailObj->sendUserRegistrationMessage(1, true);
    }

    private function displayRegistrationPaidMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed', $this->userId);
        echo $emailObj->sendRegistrationPaidMessage(21, 2, true);
    }

    private function displayResetPasswordMessage() {
        header("HTTP/1.0 200 Success");
        $emailObj = new mail('not_needed', $this->userId);
        echo $emailObj->sendResetEmailMessage(1, true);
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
