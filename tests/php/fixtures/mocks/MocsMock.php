<?php

class mocModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addMocInformation($data) {
        return $this->query();
    }

}

class MocsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/mocsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
    }

    //public function joined() { return $this->getData(11); }
}
?>
