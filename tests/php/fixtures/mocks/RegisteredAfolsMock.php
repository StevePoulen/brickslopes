<?php

class RegisteredAfolsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/registeredAfolsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->eventId = $this->eventId();
        $this->eventName = $this->eventName();
        $this->registrationId = $this->registrationId();
        $this->comments = $this->comments();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
        $this->email = $this->email();
        $this->city = $this->city();
        $this->state = $this->state();
        $this->paid = $this->paid();
        $this->userId = $this->userId();
        $this->registrationLineItemId = $this->registrationLineItemId();
        $this->lineItem = $this->lineItem();
        $this->amount = $this->amount();
        $this->discount = $this->discount();
        $this->description = $this->description();
        $this->size = $this->size();
        $this->quantity = $this->quantity();
        $this->active = $this->active();
        $this->entryDate = $this->entryDate();
    }

    public function eventId() { return $this->getData(0); }
    public function eventName() { return $this->getData(1); }
    public function registrationId() { return $this->getData(2); }
    public function comments() { return $this->getData(3); }
    public function firstName() { return $this->getData(4); }
    public function lastName() { return $this->getData(5); }
    public function email() { return $this->getData(6); }
    public function city() { return $this->getData(7); }
    public function state() { return $this->getData(8); }
    public function paid() { return $this->getData(9); }
    public function userId() { return $this->getData(10); }
    public function registrationLineItemId() { return $this->getData(11); }
    public function lineItem() { return $this->getData(12); }
    public function amount() { return $this->getData(13); }
    public function discount() { return $this->getData(14); }
    public function description() { return $this->getData(15); }
    public function size() { return $this->getData(16); }
    public function quantity() { return $this->getData(17); }
    public function active() { return $this->getData(18); }
    public function entryDate() { return $this->getData(19); }
}
?>
