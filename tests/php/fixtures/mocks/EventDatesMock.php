<?php

class eventDatesModel extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new EventDatesMock();
        parent::__construct();
    }

    public function getEventDates() {
        return $this->query();
    }
}

class EventDatesMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('eventDatesDB.txt');
    }

    public function eventId() { return $this->getData(0); }
    public function startDate() { return $this->getData(1); }
    public function endDate() { return $this->getData(2); }
    public function type() { return $this->getData(3); }
}
?>
