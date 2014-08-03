<?php

class Payment {
    private $registrationLineItemObj;
    private $registrationsObj;
    private $requestMethod;

    public function __construct() {
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
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }

        if ($payload['revoke'] === 'yes') {
            $response = $this->registrationLineItemObj->updateRegistrationLineItemsRevoke($payload);
        } else {
            $response = $this->registrationLineItemObj->updateRegistrationLineItemsPaid($payload);
        }

        if ($response != 0) {
            $this->registrationLineItemObj->getRegistrationLineItemsByUserId($payload['userId']);
            if ($this->registrationLineItemObj->result) {
                $registrationPaid = true;
                $amountPaid = 0;
                while ($dbObj = $this->registrationLineItemObj->result->fetch_object()) {
                    if ($dbObj->active === 'YES') {
                        if ($dbObj->paid === 'NO') {
                            $registrationPaid = false;
                        } else {
                            $amountPaid += $dbObj->amount;
                        }
                    }
                }

                $this->registrationsObj->updateRegistrationPaid(
                    $payload['registrationId'],
                    ($registrationPaid ? 'YES' : 'NO'),
                    $amountPaid
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

new Payment();
?>
