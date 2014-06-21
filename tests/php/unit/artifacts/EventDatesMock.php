<?php

class EventDatesMock extends modelObjects {
    protected $className;

    public function __construct() {
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

    public function eventId() { return $this->getData(__FUNCTION__); }
    public function startDate() { return $this->getData(__FUNCTION__); }
    public function endDate() { return $this->getData(__FUNCTION__); }
    public function type() { return $this->getData(__FUNCTION__); }
}
?>
