<?php

class mocModel extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new MocsMock();
        parent::__construct();
    }

    public function addMocInformation($data) {
        return $this->query();
    }

    public function getMocInformation($data) {
        return $this->query();
    }

    public function updateMocInformation($data) {
        return $this->query();
    }
}

class MocsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('mocsDB.txt');
    }

    public function mocId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function userId() { return $this->getData(2); }
    public function themeId() { return $this->getData(3); }
    public function title() { return $this->getData(4); }
    public function displayName() { return $this->getData(5); }
    public function mocImageUrl() { return $this->getData(6); }
    public function baseplateWidth() { return $this->getData(7); }
    public function baseplateDepth() { return $this->getData(8); }
    public function description() { return $this->getData(9); }
    public function theme() { return $this->getData(10); }
    public function isTfol() { return $this->getData(11); }
    public function isSet() { return $this->getData(12); }
}
?>
