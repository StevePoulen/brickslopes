<?php

class Payment {
    private $registrationLineItemObj;
    private $registrationsObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->registrationLineItemObj = new registrationLineItemModel();
        $this->registrationsObj = new registrations();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if ($payload['revoke'] === 'yes') {
            $response = $this->registrationLineItemObj->updateRegistrationLineItemsRevoke($payload);
        } else {
            $response = $this->registrationLineItemObj->updateRegistrationLineItemsPaid($payload);
        }

        if ($response != 0) {
            $this->registrationLineItemObj->getRegistrationLineItemsByUserId($this->userId);
            if ($this->registrationLineItemObj->result) {
                $registrationPaid = true;
                while ($dbObj = $this->registrationLineItemObj->result->fetch_object()) {

                    if ($dbObj->paid == 'NO') {
                        $registrationPaid = false;
                    }

                }

                $this->registrationsObj->updateRegistrationPaid(
                    $payload['registrationId'],
                    ($registrationPaid ? 'YES' : 'NO')
                );

            }
            header("HTTP/1.0 200 Success");
            echo json_encode (
                array (
                    'registrationPaid' => $registrationPaid
                )
            );
        } else {
            header("HTTP/1.0 412 Precondition Failed");
        }
    }
}

new Payment($this->userId);

?>
