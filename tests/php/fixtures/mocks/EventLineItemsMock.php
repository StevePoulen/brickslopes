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
    public function code() { return $this->getData(4); }
}

/*
+-----------------+---------+-------+---------------------+-------+----------+--------+
| eventLineItemId | eventId | code  | lineItem            | cost  | discount | active |
+-----------------+---------+-------+---------------------+-------+----------+--------+
|              10 |       2 | 10000 | 4 Day Event Pass    | 65.00 |    60.00 | YES    |
|              11 |       2 | 10001 | T-Shirt             | 20.00 |    15.00 | YES    |
|              12 |       2 | 10002 | Meet And Greet      | 20.00 |    15.00 | YES    |
|              13 |       2 | 10003 | Complete Name Badge | 10.00 |    10.00 | YES    |
|              14 |       2 | 10004 | 1st Badge Brick     |  0.00 |     0.00 | YES    |
|              15 |       2 | 10005 | 2nd Badge Brick     |  0.00 |     0.00 | YES    |
|              16 |       2 | 10006 | Event Badge Brick   |  0.00 |     0.00 | YES    |
|              17 |       2 | 10007 | Draft - $15         | 15.00 |    15.00 | YES    |
|              18 |       2 | 10008 | Draft - $25         | 25.00 |    25.00 | YES    |
+-----------------+---------+-------+---------------------+-------+----------+--------+


*/

?>
