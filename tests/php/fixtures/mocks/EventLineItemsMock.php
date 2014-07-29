<?php

class eventLineItems extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new EventLineItemsMock();
        parent::__construct();
    }

    public function getEventLineItems() {
        return $this->query();
    }
}

class EventLineItemsMock extends modelObjects {
    public function __construct() {
        parent::__construct('eventLineItemsDB.txt');
    }

    public function lineItem() { return $this->getData(0); }
    public function cost() { return $this->getData(1); }
    public function discount() { return $this->getData(2); }
    public function active() { return $this->getData(3); }
}
?>
