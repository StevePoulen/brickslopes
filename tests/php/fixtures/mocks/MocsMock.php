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

}

class MocsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('mocsDB.txt');
    }

    public function eventId() { return $this->getData(0); }
    public function userId() { return $this->getData(1); }
    public function themeId() { return $this->getData(2); }
    public function title() { return $this->getData(3); }
    public function displayName() { return $this->getData(4); }
    public function mocImageUrl() { return $this->getData(5); }
    public function baseplateWidth() { return $this->getData(6); }
    public function baseplateDepth() { return $this->getData(7); }
    public function description() { return $this->getData(8); }
    public function theme() { return $this->getData(9); }
}
?>
