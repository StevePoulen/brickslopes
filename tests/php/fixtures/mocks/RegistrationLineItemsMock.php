<?php

class registrationLineItemModel extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new RegistrationLineItemsMock();
        parent::__construct();
    }

    public function addRegistrationLineItems($data) {
        if(!ISSET($GLOBALS['addRegistrationLineItems'])) {
            $GLOBALS['addRegistrationLineItems'] = array();
        }
        array_push($GLOBALS['addRegistrationLineItems'], $data);
        return $this->query();
    }

    public function deleteRegistrationLineItems($userId, $eventId) {
        if(!ISSET($GLOBALS['deleteRegistrationLineItems'])) {
            $GLOBALS['deleteRegistrationLineItems'] = array();
        }
        $GLOBALS['deleteRegistrationLineItems']['userId'] = $userId;
        $GLOBALS['deleteRegistrationLineItems']['eventId'] = $eventId;
        return $this->query();
    }

    public function deleteEventTableLineItems($userId, $eventId) {
        if(!ISSET($GLOBALS['deleteEventTableLineItems'])) {
            $GLOBALS['deleteEventTableLineItems'] = array();
        }
        $GLOBALS['deleteEventTableLineItems']['userId'] = $userId;
        $GLOBALS['deleteEventTableLineItems']['eventId'] = $eventId;
        return $this->query();
    }

    public function getRegistrationLineItemsByUserId($data) {
        return $this->query();
    }

    public function updateRegistrationLineItemsPaid($data) {
        return $this->query();
    }

    public function updateRegistrationLineItemsRevoke($data) {
        return $this->query();
    }
}

class RegistrationLineItemsMock extends modelObjects {
    public function __construct() {
        parent::__construct('registrationLineItemsDB.txt');
    }

    public function registrationLineItemId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function userId() { return $this->getData(2); }
    public function lineItemCode() { return $this->getData(3); }
    public function lineItem() { return $this->getData(4); }
    public function amount() { return $this->getData(5); }
    public function paid() { return $this->getData(6); }
    public function discount() { return $this->getData(7); }
    public function description() { return $this->getData(8); }
    public function size() { return $this->getData(9); }
    public function quantity() { return $this->getData(10); }
    public function active() { return $this->getData(11); }
    public function isOwner() { return $this->getData(12); }
    public function entryDate() { return $this->getData(13); }
}
?>
