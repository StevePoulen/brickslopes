<?php

class mocModel extends db {
    function __construct() {
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
        $this->dataSet = file(__DIR__ . '/../artifacts/mocsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->eventId = $this->eventId();
        $this->userId = $this->userId();
        $this->themeId = $this->themeId();
        $this->title = $this->title();
        $this->displayName = $this->displayName();
        $this->mocImageUrl = $this->mocImageUrl();
        $this->baseplateWidth = $this->baseplateWidth();
        $this->baseplateDepth = $this->baseplateDepth();
        $this->description = $this->description();
        $this->theme = $this->theme();
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
