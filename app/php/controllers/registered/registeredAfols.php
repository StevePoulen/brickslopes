<?php

class RegisteredAfols {
    private $registrationsObj;
    private $registrationLineItemsObj;
    private $requestMethod;
    private $isAdmin;

    public function __construct($isAdmin) {
        $this->isAdmin = $isAdmin;
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

                $afolArray = array (
                    'registrationId' => $dbObj->registrationId,
                    'userId' => $dbObj->userId,
                    'firstName' => $dbObj->firstName,
                    'lastName' => $dbObj->lastName,
                    'city' => $dbObj->city,
                    'state' => $dbObj->state,
                    'mocCount' => $dbObj->mocCount,
                    'gameCount' => $dbObj->gameCount,
                    'themeCount' => $dbObj->themeCount
                );

                if ($this->isAdmin) {
                    $afolArray['email'] = $dbObj->email;
                    $afolArray['comments'] = $dbObj->comments;
                    $afolArray['paid'] = $dbObj->paid;
                    $afolArray['lineItems'] = $this->registrationLineItemsObj->getRegisteredLineItems($dbObj->userId, $dbObj->eventId);
                }

                array_push( 
                    $eventJson[$dbObj->eventId]['registeredAfols'], 
                    $afolArray
                );
            }
        }
        header("HTTP/1.0 200 Success");
        echo json_encode($eventJson);
    }
}

new RegisteredAfols($this->isAdmin);
?>
