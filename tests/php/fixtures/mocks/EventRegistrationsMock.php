<?php

class EventRegistrationsObject extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/eventRegistrationsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->userId = $this->userId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
    }

    public function userId() { return $this->getData(0); }
    public function firstName() { return $this->getData(1); }
    public function lastName() { return $this->getData(2); }
}
?>
