<?php

class EventDatesMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/eventDatesDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->eventId = $this->eventId();
        $this->startDate = $this->startDate();
        $this->endDate = $this->endDate();
        $this->type = $this->type();
    }

    public function eventId() { return $this->getData(0); }
    public function startDate() { return $this->getData(1); }
    public function endDate() { return $this->getData(2); }
    public function type() { return $this->getData(3); }
}
?>
