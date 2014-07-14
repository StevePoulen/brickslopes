<?php

class ThemesMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/themesDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->themeId = $this->themeId();
        $this->eventId = $this->eventId();
        $this->themeAwardId = $this->themeAwardId();
        $this->theme = $this->theme();
        $this->type = $this->type();
        $this->award = $this->award();
        $this->place = $this->place();
    }

    public function themeId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function theme() { return $this->getData(2); }
    public function type() { return $this->getData(3); }
    public function themeAwardId() { return $this->getData(4); }
    public function award() { return $this->getData(5); }
    public function place() { return $this->getData(6); }
}
?>
