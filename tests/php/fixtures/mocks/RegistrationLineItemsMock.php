<?php

class registrationLineItemModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addRegistrationLineItems($data) {
        if(!ISSET($GLOBALS['addRegistrationLineItems'])) {
            $GLOBALS['addRegistrationLineItems'] = array();
        }
        array_push($GLOBALS['addRegistrationLineItems'], $data);
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
    protected $className;
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/registrationLineItemsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->registrationLineItemId = $this->registrationLineItemId();
        $this->eventId = $this->eventId();
        $this->userId = $this->userId();
        $this->lineItem = $this->lineItem();
        $this->amount = $this->amount();
        $this->paid = $this->paid();
        $this->discount = $this->discount();
        $this->description = $this->description();
        $this->size = $this->size();
        $this->quantity = $this->quantity();
        $this->active = $this->active();
        $this->entryDate = $this->entryDate();
    }

    public function registrationLineItemId() { return $this->getData(__FUNCTION__,0); }
    public function eventId() { return $this->getData(__FUNCTION__,1); }
    public function userId() { return $this->getData(__FUNCTION__,2); }
    public function lineItem() { return $this->getData(__FUNCTION__,3); }
    public function amount() { return $this->getData(__FUNCTION__,4); }
    public function paid() { return $this->getData(__FUNCTION__,5); }
    public function discount() { return $this->getData(__FUNCTION__,6); }
    public function description() { return $this->getData(__FUNCTION__,7); }
    public function size() { return $this->getData(__FUNCTION__,8); }
    public function quantity() { return $this->getData(__FUNCTION__,9); }
    public function active() { return $this->getData(__FUNCTION__,10); }
    public function entryDate() { return $this->getData(__FUNCTION__,11); }
}
?>
