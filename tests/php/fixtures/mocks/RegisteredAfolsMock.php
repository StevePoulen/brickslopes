<?php

class RegisteredAfolsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/registeredAfolsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->eventId = $this->eventId();
        $this->eventName = $this->eventName();
        $this->registrationId = $this->registrationId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
        $this->paid = $this->paid();
        $this->userId = $this->userId();
        $this->lineItem = $this->lineItem();
        $this->amount = $this->amount();
        $this->discount = $this->discount();
        $this->description = $this->description();
        $this->size = $this->size();
        $this->quantity = $this->quantity();
        $this->active = $this->active();
        $this->entryDate = $this->entryDate();
    }

    public function eventId() { return $this->getData(__FUNCTION__, 0); }
    public function eventName() { return $this->getData(__FUNCTION__, 1); }
    public function registrationId() { return $this->getData(__FUNCTION__, 2); }
    public function firstName() { return $this->getData(__FUNCTION__, 3); }
    public function lastName() { return $this->getData(__FUNCTION__, 4); }
    public function paid() { return $this->getData(__FUNCTION__, 5); }
    public function userId() { return $this->getData(__FUNCTION__, 6); }
    public function lineItem() { return $this->getData(__FUNCTION__,7); }
    public function amount() { return $this->getData(__FUNCTION__,8); }
    public function discount() { return $this->getData(__FUNCTION__,9); }
    public function description() { return $this->getData(__FUNCTION__,10); }
    public function size() { return $this->getData(__FUNCTION__,11); }
    public function quantity() { return $this->getData(__FUNCTION__,12); }
    public function active() { return $this->getData(__FUNCTION__,13); }
    public function entryDate() { return $this->getData(__FUNCTION__,14); }
}
?>