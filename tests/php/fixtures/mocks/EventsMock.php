<?php

class events extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new EventsMock();
        parent::__construct();
    }

    public function getEventInformation() {
        return $this->query();
    }
}

class EventsMock extends modelObjects {
    public function __construct() {
        parent::__construct('eventsDB.txt');
    }

    public function eventId() { return $this->getData(0); }
    public function name() { return $this->getData(1); }
    public function city() { return $this->getData(2); }
    public function state() { return $this->getData(3); }
    public function year() { return $this->getData(4); }
    public function discountDate() { return $this->getData(5); }
    public function displayName() { return $this->getData(6); }
}
?>
