<?php

class RegistrationLineItems {
    private $registrationLineItemObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null) {
        $this->registrationLineItemObj = new registrationLineItemModel();
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

    private function buildLineItemDTO($dbObj) {
        return array (
            'lineItem' => $dbObj->lineItem,
            'amount' => $dbObj->amount,
            'paid' => $dbObj->paid,
            'discount' => $dbObj->discount,
            'description' => $dbObj->description,
            'size' => $dbObj->size,
            'quantity' => $dbObj->quantity,
            'active' => $dbObj->active,
            'entryDate' => $dbObj->entryDate
        );
    }

    private function get() {
        $this->registrationLineItemObj->getRegistrationLineItemsByUserId($this->userId);
        if ($this->registrationLineItemObj->result) {
            $lineItemMap = array();
            while($dbObj = $this->registrationLineItemObj->result->fetch_object()) {
                if(array_key_exists($dbObj->eventId, $lineItemMap)) {
                    array_push (
                        $lineItemMap[$dbObj->eventId],
                        $this->buildLineItemDTO($dbObj)
                    );
                } else {
                    $lineItemMap[$dbObj->eventId] = array(
                        $this->buildLineItemDTO($dbObj)
                    );
                }
            }
            header("HTTP/1.0 200 Success");
            echo json_encode (
                $lineItemMap
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new RegistrationLineItems($this->userId);

?>
