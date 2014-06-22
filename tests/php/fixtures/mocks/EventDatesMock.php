<?php

class EventDatesMock extends modelObjects {
    protected $className;
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/eventDatesDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->eventId = $this->eventId();
        $this->startDate = $this->startDate();
        $this->endDate = $this->endDate();
        $this->type = $this->type();
    }

    public function eventId() { return $this->getData(__FUNCTION__, 0); }
    public function startDate() { return $this->getData(__FUNCTION__, 1); }
    public function endDate() { return $this->getData(__FUNCTION__, 2); }
    public function type() { return $this->getData(__FUNCTION__, 3); }
}
?>
