<?php

class EventDatesMock extends modelObjects {
    protected $className;
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/eventDatesDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->className = 'eventDates';
        $this->eventId = $this->eventId();
        $this->startDate = $this->startDate();
        $this->endDate = $this->endDate();
        $this->type = $this->type();
    }

    public function getDTO() {
        return array (
            'eventId' => '2',
            'startDate' => '2014-05-16 08:00:00',
            'endDate' => '2014-05-16 20:00:00',
            'type' => 'AFOL'
        );
    }

    public function eventId() { return $this->getData(__FUNCTION__, 0); }
    public function startDate() { return $this->getData(__FUNCTION__, 1); }
    public function endDate() { return $this->getData(__FUNCTION__, 2); }
    public function type() { return $this->getData(__FUNCTION__, 3); }
}
?>
