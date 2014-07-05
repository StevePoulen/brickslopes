<?php

class RegisteredAfols {
    private $registrationsObj;
    private $registrationLineItemsObj;
    private $requestMethod;
    private $userId;

    public function __construct() {
        $this->registrationsObj = new registrations();
        $this->registrationLineItemsObj = new registrationLineItems();
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
        $eventJson = array();
        $this->registrationsObj->getAllRegisteredUsers($_GET['eventId']);
        if ($this->registrationsObj->result) {
            while($dbObj = $this->registrationsObj->result->fetch_object()) {
                if (! ISSET($eventJson[$dbObj->eventId])) {
                    $eventJson[$dbObj->eventId] = array (
                        'eventName' => $dbObj->eventName,
                        'registeredAfols' => array ()
                    );
                }

                array_push( $eventJson[$dbObj->eventId]['registeredAfols'], 
                    array (
                        'registrationId' => $dbObj->registrationId,
                        'firstName' => $dbObj->firstName,
                        'lastName' => $dbObj->lastName,
                        'paid' => $dbObj->paid,
                        'lineItems' => $this->registrationLineItemsObj->getRegisteredLineItems($dbObj->userId, $dbObj->eventId)
                    )
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode($eventJson);
    }
}

new RegisteredAfols();
?>
